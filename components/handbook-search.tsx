'use client';
import { useState } from 'react';
import { Search } from 'lucide-react';
type Chapter = { slug: string; title: string; number: string; part: string; text: string };
export default function HandbookSearch({ chapters }: { chapters: Chapter[] }) {
  const [query, setQuery] = useState('');
  const term = query.trim().toLocaleLowerCase();
  const results = term ? chapters.filter(c => (c.title + ' ' + c.text).toLocaleLowerCase().includes(term)) : [];
  return <div className="handbook-search"><label htmlFor="handbook-query"><Search size={18}/>Search the complete guide</label><input id="handbook-query" type="search" value={query} onChange={e => setQuery(e.target.value)} placeholder="Try background subtraction, PFSS, or GCS"/>
    {term && <div className="handbook-results"><p role="status" className="small">{results.length ? `${results.length} matching chapters and reference sections` : 'No matches. Try another term.'}</p>{results.map(c => { const i = c.text.toLocaleLowerCase().indexOf(term); const start = Math.max(0, i - 75); return <a href={'/guide/' + c.slug} key={c.slug}><strong>{c.number && c.number + ' · '}{c.title}</strong><span>{start > 0 && '…'}{c.text.slice(start, start + 220)}…</span></a>; })}</div>}
  </div>;
}
