import Link from 'next/link';
import PageIntro from '@/components/page-intro';
import GuidePdf from '@/components/guide-pdf';
import HandbookSearch from '@/components/handbook-search';
import HandbookCover from '@/components/handbook-cover';
import handbook from '@/content/handbook.json';

export const metadata = {
  title: 'User guide · v3.1.0',
  description: 'The complete, illustrated v3.1.0 user guide: 21 chapters, five appendices, glossary, bibliography and index. Read online or download the 174-page PDF.',
};

export default function Guide() {
  const parts = [...new Set(handbook.map(c => c.part))];
  return <>
    <PageIntro label="The complete user guide · v3.1.0" title="Your guide to the analyzer." crumbs={[['User guide']]}>
      From your first FITS observation to solar imaging and three-dimensional CME reconstruction. The complete guide by Sahan S Liyanage.
    </PageIntro>
    <section className="wrap content-section">
      <div className="handbook-intro">
        <div data-reveal>
          <span className="eyebrow">One book. Two ways to read.</span>
          <h2>Explore a chapter. Or keep a copy.</h2>
          <p>Browse the searchable web edition with every screenshot, table, equation and reference, or download the original illustrated PDF for offline reading and printing.</p>
          <GuidePdf />
        </div>
        <div data-reveal="scale" style={{ '--delay': '120ms' } as React.CSSProperties}><HandbookCover /></div>
      </div>
      <HandbookSearch chapters={handbook.map(({ slug, title, part, number, text }) => ({ slug, title, part, number, text }))} />
      <div className="handbook-contents">
        {parts.map((part, i) => <section className="handbook-part" key={part} data-reveal style={{ '--delay': `${(i % 2) * 80}ms` } as React.CSSProperties}>
          <h2>{part}</h2>
          <div className="handbook-chapters">
            {handbook.filter(c => c.part === part).map(c => <Link key={c.slug} href={`/guide/${c.slug}/`}><span>{c.number || '·'}</span><strong>{c.title}</strong></Link>)}
          </div>
        </section>)}
      </div>
    </section>
  </>;
}
