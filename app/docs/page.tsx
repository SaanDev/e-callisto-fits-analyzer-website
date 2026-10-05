import Link from 'next/link';
import { BookOpen, GraduationCap, Orbit, Box, Atom, Download, Quote, MessagesSquare, ArrowRight, Bug, FileCode2 } from 'lucide-react';
import PageIntro from '@/components/page-intro';
import GuidePdf from '@/components/guide-pdf';
import HandbookCover from '@/components/handbook-cover';
import { asset, links } from '@/lib/site';
import { pageMetadata } from '@/lib/seo';

export const metadata = pageMetadata({ title: 'Documentation', description: 'Everything you need to learn e-CALLISTO FITS Analyzer: the user guide, tutorials, tool guides, scientific background, installation and citation.', path: '/docs/' });

const resources = [
  { icon: BookOpen, title: 'User guide', body: 'The complete v3.1.0 reference for radio spectra, solar imaging, GCS fitting, exports and more.', href: '/guide/' },
  { icon: GraduationCap, title: 'Tutorials', body: 'Written walkthroughs to get started. Video tutorials are coming soon.', href: '/tutorials/' },
  { icon: Orbit, title: 'Solar Image Analyzer', body: 'SDO, SOHO and STEREO imaging, CME tracking, height–time measurements and PFSS.', href: '/tools/solar-imaging/' },
  { icon: Box, title: 'GCS CME fitting', body: 'Multi-viewpoint fitting, shock models and recorded CME kinematics.', href: '/tools/gcs-fitting/' },
  { icon: Atom, title: 'Scientific background', body: 'Dynamic spectra, plasma emission, frequency drift and model-dependent estimates.', href: '/science/' },
  { icon: Download, title: 'Installation & releases', body: 'v3.1.0 packages for Windows, Linux and macOS, with checksums and installation steps.', href: '/download/' },
  { icon: Quote, title: 'Citation', body: 'The published paper, recommended attribution and a copyable BibTeX entry.', href: '/citation/' },
  { icon: MessagesSquare, title: 'Community support', body: 'Ask a question, describe a workflow or discuss a scientific interpretation.', href: '/community/' },
];

export default function Docs() {
  return <>
    <PageIntro label="Documentation · v3.1.0" title="A good place to get started." crumbs={[['Documentation']]}>
      Learn the tools, understand the methods and make your analysis reproducible.
    </PageIntro>
    <section className="wrap content-section">
      <div className="handbook-intro">
        <div data-reveal>
          <span className="eyebrow">The complete user guide</span>
          <h2>Every tool. Every workflow.</h2>
          <p>21 chapters, five appendices, a glossary, bibliography and index, with every screenshot. Read the searchable web edition or keep the original PDF.</p>
          <p style={{ marginTop: 14 }}><Link className="text-link" href="/guide/">Open the web edition <ArrowRight size={15} /></Link></p>
          <GuidePdf />
        </div>
        <div data-reveal="scale"><HandbookCover /></div>
      </div>
      <div className="cards">
        {resources.map((r, i) => <Link className="card spotlight" href={r.href} key={r.href} data-reveal style={{ '--delay': `${(i % 3) * 70}ms` } as React.CSSProperties}>
          <span className="card-icon"><r.icon size={21} /></span>
          <h2>{r.title}</h2>
          <p>{r.body}</p>
          <span className="more">Open<ArrowRight size={15} /></span>
        </Link>)}
      </div>
      <div className="cards two" style={{ marginTop: 20 }}>
        <article className="card" data-reveal>
          <span className="card-icon"><FileCode2 size={21} /></span>
          <h2>For developers and advanced users</h2>
          <p>Read the <a className="text-link" href={asset('/docs/architecture.md')} download>architecture reference (Markdown)</a> or explore the <a className="text-link" href={links.repo} target="_blank" rel="noreferrer">source repository</a>.</p>
        </article>
        <article className="card" data-reveal style={{ '--delay': '80ms' } as React.CSSProperties}>
          <span className="card-icon"><Bug size={21} /></span>
          <h2>Found a bug?</h2>
          <p>Use <strong>About → Report a Bug…</strong> in the analyzer to generate a diagnostics bundle and include the steps to reproduce the issue. Review diagnostics before sharing them.</p>
        </article>
      </div>
    </section>
  </>;
}
