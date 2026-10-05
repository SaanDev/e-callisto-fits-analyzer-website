'use client';

import { useEffect, useMemo, useRef, useState } from 'react';
import Link from 'next/link';
import { Search } from 'lucide-react';

type Chapter = { slug: string; title: string; number: string; part: string; text: string };

function escape(term: string) { return term.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'); }

/** Wrap every occurrence of the query words in <mark>. */
function Highlight({ text, words }: { text: string; words: string[] }) {
  if (!words.length) return <>{text}</>;
  const parts = text.split(new RegExp(`(${words.map(escape).join('|')})`, 'gi'));
  return <>{parts.map((part, i) => i % 2 ? <mark key={i}>{part}</mark> : part)}</>;
}

export default function HandbookSearch({ chapters }: { chapters: Chapter[] }) {
  const [query, setQuery] = useState('');
  const input = useRef<HTMLInputElement>(null);
  const words = useMemo(() => query.trim().toLocaleLowerCase().split(/\s+/).filter(w => w.length > 1), [query]);

  // Press "/" anywhere on the page to jump to the search field.
  useEffect(() => {
    const onKey = (event: KeyboardEvent) => {
      const target = event.target as HTMLElement;
      if (event.key === '/' && !/input|textarea|select/i.test(target.tagName) && !target.isContentEditable) {
        event.preventDefault();
        input.current?.focus();
      }
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, []);

  const results = useMemo(() => {
    if (!words.length) return [];
    return chapters.map(c => {
      const title = c.title.toLocaleLowerCase(), text = c.text.toLocaleLowerCase();
      if (!words.every(w => title.includes(w) || text.includes(w))) return null;
      const score = words.reduce((n, w) => n + (title.includes(w) ? 50 : 0) + text.split(w).length - 1, 0);
      const at = Math.max(0, text.indexOf(words[0]));
      const start = Math.max(0, at - 70);
      return { c, score, snippet: (start > 0 ? '…' : '') + c.text.slice(start, start + 230) + '…' };
    }).filter(r => r !== null).sort((a, b) => b.score - a.score);
  }, [chapters, words]);

  return <div className="handbook-search" role="search" data-reveal>
    <label htmlFor="handbook-query" className="sr-only">Search the complete guide</label>
    <div className="search-field">
      <Search size={19} />
      <input ref={input} id="handbook-query" type="search" autoComplete="off" value={query} onChange={e => setQuery(e.target.value)} placeholder="Search the guide: background subtraction, PFSS, GCS…" />
      {!query && <kbd aria-hidden="true">/</kbd>}
    </div>
    {words.length > 0 && <div className="handbook-results">
      <p role="status" className="small" style={{ margin: '4px 0 6px' }}>{results.length ? `${results.length} matching ${results.length === 1 ? 'section' : 'chapters and reference sections'}` : 'No matches. Try another term.'}</p>
      {results.slice(0, 12).map(({ c, snippet }, i) => <Link href={`/guide/${c.slug}/`} key={c.slug} style={{ animationDelay: `${i * 30}ms` }}>
        <strong>{c.number && c.number + ' · '}<Highlight text={c.title} words={words} /></strong>
        <span><Highlight text={snippet} words={words} /></span>
      </Link>)}
    </div>}
  </div>;
}
