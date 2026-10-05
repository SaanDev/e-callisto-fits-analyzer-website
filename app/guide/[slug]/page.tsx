import { notFound } from 'next/navigation';
import handbook from '@/content/handbook.json';
export function generateStaticParams() { return handbook.map(c => ({slug:c.slug})); }
export async function generateMetadata({params}:{params:Promise<{slug:string}>}) { const {slug}=await params; const chapter=handbook.find(c=>c.slug===slug); return {title:chapter ? `${chapter.title} · User guide` : 'Chapter not found'}; }
export default async function GuideChapter({params}:{params:Promise<{slug:string}>}) {
  const {slug}=await params; const index=handbook.findIndex(c=>c.slug===slug); if(index<0) notFound();
  const chapter=handbook[index], previous=handbook[index-1], next=handbook[index+1];
  return <section className="wrap content-section handbook-reader">
    <aside className="handbook-sidebar"><a className="text-link" href="/guide">All chapters & search</a><p className="eyebrow">USER GUIDE · v3.1.0</p><details><summary>Browse the book</summary><nav aria-label="Handbook chapters">{handbook.map(c=><a aria-current={c.slug===slug?'page':undefined} href={'/guide/'+c.slug} key={c.slug}>{c.number && c.number+' · '}{c.title}</a>)}</nav></details><nav aria-label="On this page"><p className="eyebrow">ON THIS PAGE</p>{chapter.headings.map(h=><a href={'#'+h.id} key={h.id}>{h.title}</a>)}</nav><a className="text-link" href="/guide/pdf">PDF edition</a></aside>
    <div className="handbook-body"><p className="eyebrow">{chapter.part}{chapter.number && ` · ${/^\d+$/.test(chapter.number) ? 'Chapter' : 'Appendix'} ${chapter.number}`}</p><article className="prose handbook-prose" dangerouslySetInnerHTML={{__html:chapter.html}}/>
      <nav className="chapter-pagination" aria-label="Chapter navigation">{previous ? <a href={'/guide/'+previous.slug}><span>Previous</span>{previous.title}</a> : <span/>}{next && <a href={'/guide/'+next.slug}><span>Next</span>{next.title}</a>}</nav>
    </div></section>;
}
