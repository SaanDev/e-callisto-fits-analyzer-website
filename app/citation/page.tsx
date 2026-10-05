import { ExternalLink } from 'lucide-react';
import PageIntro from '@/components/page-intro';
import CopyButton from '@/components/copy-button';
import { citation, bibtex } from '@/lib/citation';
import { links } from '@/lib/site';

export const metadata = { title: 'Citation', description: 'How to cite e-CALLISTO FITS Analyzer: the RAS Techniques and Instruments software paper, a copyable reference and BibTeX.' };

export default function Citation() {
  return <>
    <PageIntro label="Acknowledge the tools behind your work" title="Good science gives credit." crumbs={[['Citation']]}>
      If you use e-CALLISTO FITS Analyzer in your research, please cite the software paper.
    </PageIntro>
    <section className="wrap content-section">
      <div className="cards two">
        <article className="card" data-reveal>
          <span className="eyebrow plain">Recommended citation</span>
          <p style={{ color: 'var(--ink-2)', fontSize: 16, lineHeight: 1.8 }}>{citation}</p>
          <div style={{ marginTop: 18 }}><CopyButton text={citation} label="Copy citation" /></div>
          <a className="text-link" href={links.paper} target="_blank" rel="noreferrer" style={{ marginTop: 10 }}>Read the paper · DOI 10.1093/rasti/rzag056 <ExternalLink size={14} /></a>
        </article>
        <article className="card" data-reveal style={{ '--delay': '90ms' } as React.CSSProperties}>
          <span className="eyebrow plain">BibTeX</span>
          <pre style={{ margin: '4px 0 16px', fontSize: 12.5 }}>{bibtex}</pre>
          <CopyButton text={bibtex} label="Copy BibTeX" />
        </article>
      </div>
      <article className="prose" style={{ marginTop: 24 }} data-reveal>
        <h2>Make your methods reproducible</h2>
        <p>State the software version you used (for example, v3.1.0) and report important processing and model choices: background subtraction, RFI settings, the selected frequency range, the density model and fold multiplier, and any GCS fitting assumptions. Cite the relevant data providers and scientific methods separately where appropriate.</p>
        <p>The citation above matches the recommendation in the software’s built-in citation dialog (<strong>Cite this Software</strong> in the main toolbar).</p>
      </article>
    </section>
  </>;
}
