import { getChatGPTUser } from '@/app/chatgpt-auth';
import { database } from '@/db';
import { categories } from '@/lib/forum';
export const dynamic = 'force-dynamic';
function json(data: unknown, status = 200) { return Response.json(data, { status, headers: { 'Cache-Control': 'no-store', 'X-Content-Type-Options': 'nosniff' } }); }
function validText(v: unknown, min: number, max: number) { return typeof v === 'string' && v.trim().length >= min && v.trim().length <= max; }
function safePage(v: string | null) { const n = Number(v); return Number.isInteger(n) && n >= 0 ? Math.min(n, 10000) : 0; }
export async function GET(req: Request) { try {
    const db = database();
    const user = await getChatGPTUser();
    const url = new URL(req.url);
    const profile = user ? await db.prepare('SELECT name FROM profiles WHERE id = ?').bind(user.userId).first<{
        name: string;
    }>() : null;
    const identity = { signedIn: !!user, profile: profile?.name ?? null };
    const id = url.searchParams.get('topic');
    const page = safePage(url.searchParams.get('page'));
    if (id) {
        const topic = await db.prepare('SELECT t.id,t.title,t.body,t.category,t.created_at,t.updated_at,p.name AS author,(t.user_id = ?) AS owned FROM topics t JOIN profiles p ON p.id=t.user_id WHERE t.id=?').bind(user?.userId ?? '', id).first();
        if (!topic)
            return json({ error: 'Discussion not found.' }, 404);
        const replies = await db.prepare('SELECT r.id,r.body,r.created_at,p.name AS author,(r.user_id=?) AS owned FROM replies r JOIN profiles p ON p.id=r.user_id WHERE r.topic_id=? ORDER BY r.created_at ASC,r.id ASC LIMIT 31 OFFSET ?').bind(user?.userId ?? '', id, page * 30).all();
        return json({ ...identity, topic, replies: replies.results.slice(0, 30), hasMore: replies.results.length > 30, page });
    }
    const category = url.searchParams.get('category');
    if (category && !categories.includes(category as typeof categories[number]))
        return json({ error: 'Unknown category.' }, 400);
    const result = await db.prepare('SELECT t.id,t.title,t.category,t.created_at,t.updated_at,p.name AS author,(SELECT COUNT(*) FROM replies r WHERE r.topic_id=t.id) AS reply_count FROM topics t JOIN profiles p ON p.id=t.user_id ' + (category ? 'WHERE t.category=? ' : '') + 'ORDER BY t.updated_at DESC,t.id DESC LIMIT 21 OFFSET ?').bind(...(category ? [category, page * 20] : [page * 20])).all();
    return json({ ...identity, topics: result.results.slice(0, 20), hasMore: result.results.length > 20, page });
}
catch (error) {
    console.error('Community read failed', error);
    return json({ error: 'The community is temporarily unavailable. Please try again.' }, 503);
} }
async function mutate(req: Request) {
    const origin = req.headers.get('origin');
    if (!origin || origin !== new URL(req.url).origin)
        return json({ error: 'Please submit from this website.' }, 403);
    if (!req.headers.get('content-type')?.includes('application/json'))
        return json({ error: 'JSON required.' }, 415);
    const user = await getChatGPTUser();
    if (!user)
        return json({ error: 'Sign in before posting.' }, 401);
    const raw = await req.text();
    if (raw.length > 25000)
        return json({ error: 'Your message is too long.' }, 413);
    let input;
    try {
        input = JSON.parse(raw);
    }
    catch {
        return json({ error: 'Invalid request.' }, 400);
    }
    if (!input || typeof input !== 'object')
        return json({ error: 'Invalid request.' }, 400);
    const db = database();
    const now = Date.now();
    if (input.action === 'profile') {
        if (!validText(input.name, 2, 40) || /[\r\n\u0000-\u001f]/.test(input.name))
            return json({ error: 'Use a display name between 2 and 40 characters.' }, 400);
        await db.prepare('INSERT INTO profiles(id,name,created_at) VALUES(?,?,?) ON CONFLICT(id) DO UPDATE SET name=excluded.name').bind(user.userId, input.name.trim(), now).run();
        return json({ ok: true, name: input.name.trim() });
    }
    const profile = await db.prepare('SELECT id FROM profiles WHERE id=?').bind(user.userId).first();
    if (!profile)
        return json({ error: 'Choose your public display name first.' }, 409);
    if (input.action === 'deleteTopic' || input.action === 'deleteReply') {
        const table = input.action === 'deleteTopic' ? 'topics' : 'replies';
        if (!validText(input.id, 1, 80))
            return json({ error: 'Invalid record.' }, 400);
        const row = await db.prepare('SELECT user_id FROM ' + table + ' WHERE id=?').bind(input.id).first<{
            user_id: string;
        }>();
        if (!row || row.user_id !== user.userId)
            return json({ error: 'You can only remove your own posts.' }, 403);
        await db.prepare('DELETE FROM ' + table + ' WHERE id=? AND user_id=?').bind(input.id, user.userId).run();
        return json({ ok: true });
    }
    if (input.action !== 'topic' && input.action !== 'reply')
        return json({ error: 'Unknown action.' }, 400);
    if (!validText(input.body, 5, 10000))
        return json({ error: 'Write between 5 and 10,000 characters.' }, 400);
    if (input.action === 'topic' && (!validText(input.title, 5, 160) || !categories.includes(input.category)))
        return json({ error: 'Choose a category and enter a title between 5 and 160 characters.' }, 400);
    if (input.action === 'reply') {
        if (!validText(input.topicId, 1, 80))
            return json({ error: 'Invalid discussion.' }, 400);
        if (!await db.prepare('SELECT id FROM topics WHERE id=?').bind(input.topicId).first())
            return json({ error: 'This discussion is no longer available.' }, 404);
    }
    const limit = await db.prepare('INSERT INTO posting_limits(user_id,last_post_at) VALUES(?,?) ON CONFLICT(user_id) DO UPDATE SET last_post_at=excluded.last_post_at WHERE posting_limits.last_post_at <= ? RETURNING user_id').bind(user.userId, now, now - 10000).first();
    if (!limit)
        return json({ error: 'Please wait 10 seconds between posts.' }, 429);
    const id = crypto.randomUUID();
    if (input.action === 'topic') {
        await db.prepare('INSERT INTO topics(id,user_id,title,body,category,created_at,updated_at) VALUES(?,?,?,?,?,?,?)').bind(id, user.userId, input.title.trim(), input.body.trim(), input.category, now, now).run();
        return json({ id }, 201);
    }
    await db.batch([db.prepare('INSERT INTO replies(id,topic_id,user_id,body,created_at) VALUES(?,?,?,?,?)').bind(id, input.topicId, user.userId, input.body.trim(), now), db.prepare('UPDATE topics SET updated_at=? WHERE id=?').bind(now, input.topicId)]);
    return json({ id }, 201);
}
export async function POST(req: Request) { try {
    return await mutate(req);
}
catch (error) {
    console.error('Community write failed', error);
    return json({ error: 'Your changes could not be saved. Your text is still here; please try again.' }, 503);
} }
