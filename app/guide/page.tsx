import Link from 'next/link';
import PageIntro from '@/components/page-intro';
import GuidePdf from '@/components/guide-pdf';
import HandbookSearch from '@/components/handbook-search';
import HandbookCover from '@/components/handbook-cover';
import handbook from '@/content/handbook.json';
import JsonLd from '@/components/json-ld';
import { pageMetadata, userGuideData } from '@/lib/seo';
import { guidePdf } from '@/lib/site';

export const metadata = pageMetadata({
  title: `User guide · v${guidePdf.version}`,
  description: `Read the e-CALLISTO FITS Analyzer v${guidePdf.version} user guide for radio FITS processing, burst analysis, event context, geomagnetic response, solar imaging and GCS fitting.`,
  path: '/guide/',
});

export default function Guide() {
  const parts = [...new Set(handbook.map(c => c.part))];
  return <>
    <JsonLd data={userGuideData()} />
    <PageIntro label={`e-CALLISTO FITS Analyzer user guide · v${guidePdf.version}`} title="Your guide to the analyzer." crumbs={[['User guide']]}>
      Learn solar radio data analysis with e-CALLISTO FITS Analyzer, free and open-source desktop software for Windows, macOS and Linux. This complete guide by Sahan S Liyanage covers FITS files, dynamic spectra, Type II bursts, event context, geomagnetic response, solar imaging and three-dimensional CME reconstruction.
    </PageIntro>
    <section className="wrap content-section">
      <div className="handbook-intro">
        <div data-reveal>
          <span className="eyebrow">One book. Two ways to read.</span>
          <h2>Explore a chapter. Or keep a copy.</h2>
          <p>Browse the searchable web edition with every screenshot, table, equation and reference, or download the original illustrated PDF for offline reading and printing.</p>
          <p>New in this edition: <Link className="text-link" href="/guide/event-context/">Event Context and Geomagnetic Response</Link>, including the Event Context Strip and Event Figure Composer, plus updated project reports, archive options and Analyzer Lite guidance.</p>
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
