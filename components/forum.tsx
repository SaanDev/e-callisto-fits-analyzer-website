'use client';
import { useEffect, useState, useCallback, useRef } from 'react';
import { MessageSquare, Plus } from 'lucide-react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { AlertDialog, AlertDialogTrigger, AlertDialogContent, AlertDialogTitle, AlertDialogDescription, AlertDialogCancel, AlertDialogAction, AlertDialogFooter } from '@/components/ui/alert-dialog';
import { categories, type Topic, type Reply } from '@/lib/forum';
type Data = {
    signedIn: boolean;
    profile: string | null;
    topics?: Topic[];
    topic?: Topic;
    replies?: Reply[];
    hasMore: boolean;
};
function date(value: number) { return new Date(value).toLocaleString(undefined, { dateStyle: 'medium', timeStyle: 'short' }); }
function CategorySelect({ value, onChange, filter = false }: {
    value: string;
    onChange: (v: string) => void;
    filter?: boolean;
}) { return <Select value={value} onValueChange={onChange}><SelectTrigger aria-label={filter ? 'Filter discussions by category' : 'Discussion category'} style={{ minWidth: 210 }}><SelectValue /></SelectTrigger><SelectContent style={{ background: 'var(--panel)', color: 'var(--ink)', borderColor: 'var(--line)' }}>{filter && <SelectItem value="all">All discussions</SelectItem>}{categories.map(c => <SelectItem value={c} key={c}>{c}</SelectItem>)}</SelectContent></Select>; }
export default function Forum({ topicId, signIn, signOut }: {
    topicId?: string;
    signIn: string;
    signOut: string;
}) {
    const [data, setData] = useState<Data | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [message, setMessage] = useState('');
    const [page, setPage] = useState(0);
    const [filter, setFilter] = useState('all');
    const [name, setName] = useState('');
    const [title, setTitle] = useState('');
    const [body, setBody] = useState('');
    const [category, setCategory] = useState<string>(categories[0]);
    const [creating, setCreating] = useState(false);
    const [busy, setBusy] = useState(false);
    const toolState = useRef({ data, page });
    toolState.current = { data, page };
    const load = useCallback(async () => { setLoading(true); setError(''); try {
        const q = new URLSearchParams({ page: String(page) });
        if (topicId)
            q.set('topic', topicId);
        else if (filter !== 'all')
            q.set('category', filter);
        const r = await fetch('/api/community?' + q);
        const d = await r.json() as Data & {
            error?: string;
        };
        if (!r.ok)
            throw new Error(d.error);
        setData(d);
    }
    catch (e) {
        setError(e instanceof Error ? e.message : 'Unable to load discussions.');
    }
    finally {
        setLoading(false);
    } }, [topicId, page, filter]);
    useEffect(() => { void load(); }, [load]);
    useEffect(() => { type Tool = {
        name: string;
        description: string;
        inputSchema: object;
        annotations: object;
        execute: (input: unknown) => unknown;
    }; const ctx = (document as Document & {
        modelContext?: {
            registerTool: (tool: Tool, options: {
                signal: AbortSignal;
            }) => void | Promise<void>;
        };
    }).modelContext; if (!ctx)
        return; const ac = new AbortController(); Promise.resolve(ctx.registerTool({ name: 'read_community_discussions', description: 'Read the discussion or discussion list currently visible on this page. Does not post.', inputSchema: { type: 'object', properties: {}, additionalProperties: false }, annotations: { readOnlyHint: true, untrustedContentHint: true }, execute: (input) => { if (!input || typeof input !== 'object' || Object.keys(input).length)
            throw new Error('Expected an empty object'); const current = toolState.current; return current.data ? { topic: current.data.topic, replies: current.data.replies, topics: current.data.topics, page: current.page, hasMore: current.data.hasMore } : { status: 'loading' }; } }, { signal: ac.signal })).catch(() => { }); return () => ac.abort(); }, []);
    async function post(payload: object) { const r = await fetch('/api/community', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(payload) }); const d = await r.json() as {
        id: string;
        error?: string;
    }; if (!r.ok)
        throw new Error(d.error ?? 'Unable to save.'); return d; }
    async function saveProfile(e: React.FormEvent) { e.preventDefault(); setBusy(true); setError(''); try {
        await post({ action: 'profile', name });
        setMessage('Your public display name is saved.');
        await load();
    }
    catch (e) {
        setError((e as Error).message);
    }
    finally {
        setBusy(false);
    } }
    async function submit(e: React.FormEvent) { e.preventDefault(); setBusy(true); setError(''); try {
        const result = await post(topicId ? { action: 'reply', topicId, body } : { action: 'topic', title, category, body });
        setBody('');
        setTitle('');
        if (!topicId) {
            window.location.assign('/forum/' + result.id);
            return;
        }
        setMessage('Reply posted.');
        await load();
    }
    catch (e) {
        setError((e as Error).message);
    }
    finally {
        setBusy(false);
    } }
    async function remove(action: string, id: string) { setBusy(true); setError(''); try {
        await post({ action, id });
        if (action === 'deleteTopic') {
            window.location.assign('/forum');
            return;
        }
        await load();
        setMessage('Reply removed.');
    }
    catch (e) {
        setError((e as Error).message);
    }
    finally {
        setBusy(false);
    } }
    function DeleteButton({ id, topic = false }: {
        id: string;
        topic?: boolean;
    }) { return <AlertDialog><AlertDialogTrigger asChild><button className="danger-link" disabled={busy}>Remove {topic ? 'discussion' : 'reply'}</button></AlertDialogTrigger><AlertDialogContent><AlertDialogTitle>Remove this {topic ? 'discussion' : 'reply'}?</AlertDialogTitle><AlertDialogDescription>{topic ? 'This will also remove all replies to your discussion.' : 'Your reply will be permanently removed.'} This cannot be undone.</AlertDialogDescription><AlertDialogFooter><AlertDialogCancel>Cancel</AlertDialogCancel><AlertDialogAction onClick={() => void remove(topic ? 'deleteTopic' : 'deleteReply', id)}>Remove</AlertDialogAction></AlertDialogFooter></AlertDialogContent></AlertDialog>; }
    return <section className="wrap content-section"><div className="forum-toolbar">{topicId ? <a className="text-link" href="/forum">All discussions</a> : <CategorySelect value={filter} onChange={v => { setFilter(v); setPage(0); }} filter/>}{!topicId && data?.signedIn && data.profile && <button className="button primary" onClick={() => setCreating(!creating)}><Plus size={17}/>{creating ? 'Close editor' : 'New discussion'}</button>}</div><div className="forum-grid"><div>{error && <div role="alert" className="notice form-error">{error} <button className="text-link" onClick={() => void load()}>Try again</button></div>}{message && <p className="status" role="status">{message}</p>}{loading ? <p role="status">Loading the conversation…</p> : !error && !topicId && data?.topics?.length === 0 ? <div className="forum-empty"><MessageSquare size={32}/><h2>{filter === 'all' ? 'Every community starts with a question.' : 'No discussions in this category yet.'}</h2><p>Share a workflow, ask for help, or start a scientific discussion.</p></div> : null}
    {!loading && !topicId && data?.topics?.map(t => <article className="thread" key={t.id}><span className="tag">{t.category}</span><h2><a href={'/forum/' + t.id}>{t.title}</a></h2><p className="small">{t.author} · {date(t.updated_at)} · {t.reply_count} {t.reply_count === 1 ? 'reply' : 'replies'}</p></article>)}
    {topicId && data?.topic && <><article className="reply"><span className="tag">{data.topic.category}</span><h2 style={{ fontSize: 32, margin: '20px 0' }}>{data.topic.title}</h2><p className="small" style={{ marginBottom: 22 }}>{data.topic.author} · {date(data.topic.created_at)}</p><p className="thread-body">{data.topic.body}</p>{!!data.topic.owned && <DeleteButton id={data.topic.id} topic/>}</article><h2 style={{ fontSize: 23, marginTop: 35 }}>Replies</h2>{data.replies?.length === 0 && <p style={{ marginTop: 20 }}>No replies yet. Add your perspective.</p>}{data.replies?.map(r => <article className="reply" key={r.id}><header><strong>{r.author}</strong><span>{date(r.created_at)}</span></header><p className="thread-body">{r.body}</p>{!!r.owned && <DeleteButton id={r.id}/>}</article>)}</>}
    {data && (page > 0 || data.hasMore) && <div className="pagination"><button className="button secondary" disabled={page === 0 || loading} onClick={() => setPage(page - 1)}>Previous page</button><span className="small">Page {page + 1}</span><button className="button secondary" disabled={!data.hasMore || loading} onClick={() => setPage(page + 1)}>Next page</button></div>}
    {data?.signedIn && data.profile && ((topicId && data.topic) || creating) && <form onSubmit={submit} className="card" style={{ marginTop: 30 }}><h2>{topicId ? 'Add a reply' : 'Start a discussion'}</h2>{!topicId && <><label className="form-label" htmlFor="topic-title">Discussion title</label><input id="topic-title" className="input" required minLength={5} maxLength={160} value={title} onChange={e => setTitle(e.target.value)} placeholder="What would you like to discuss?"/><label className="form-label">Category</label><CategorySelect value={category} onChange={setCategory}/></>}<label className="form-label" htmlFor="body" style={{ display: 'block', marginTop: 20 }}>Your message</label><textarea id="body" className="input" required minLength={5} maxLength={10000} value={body} onChange={e => setBody(e.target.value)} placeholder="Include the analyzer version, data source, and what you have tried."/><p className="small">Plain text · Your display name and message will be visible to community readers.</p><button className="button primary" disabled={busy}>{busy ? 'Saving…' : topicId ? 'Post reply' : 'Publish discussion'}</button></form>}</div><aside><div className="card account-card"><h2>Your community profile</h2>{data?.signedIn ? <><p>{data.profile ? 'Posting as ' + data.profile : 'Choose a public display name to join the conversation.'}</p><form onSubmit={saveProfile}><label className="form-label" htmlFor="display-name">Public display name</label><input id="display-name" className="input" value={name} onChange={e => setName(e.target.value)} required minLength={2} maxLength={40} placeholder={data.profile ?? 'Your name'}/><button className="button secondary" disabled={busy}>{busy ? 'Saving…' : 'Save display name'}</button></form><a href={signOut} target="_top" className="text-link small" style={{ display: 'block', marginTop: 20 }}>Sign out</a></> : <><p>Sign in to create your profile, start discussions, and reply.</p><a className="button primary" href={signIn} target="_top">Sign in with ChatGPT</a></>}</div><div className="card"><span className="eyebrow">A CONSIDERATE COMMUNITY</span><p>Be curious and respectful. Share evidence and explain your assumptions. Keep personal information out of posts.</p><p style={{ marginTop: 18 }}>For software defects, include a reproducible example in a <a className="text-link" href="https://github.com/SaanDev/e-Callisto_FITS_Analyzer/issues">GitHub issue</a>.</p></div></aside></div></section>;
}
