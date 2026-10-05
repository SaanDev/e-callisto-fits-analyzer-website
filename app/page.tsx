import Link from 'next/link';
import { Download, BookOpen, ArrowRight, Activity, ScanLine, Layers, Monitor, ShieldCheck, Code2, MessagesSquare, Quote, Sparkles, Orbit, Box, Image as ImageIcon, FolderOpen, Satellite } from 'lucide-react';
import HeroSpectrum from '@/components/hero-spectrum';
import WorkspacePreview from '@/components/workspace-preview';
import StatsBand from '@/components/stats-band';
import ToolMap from '@/components/tool-map';
import SolarShowcase from '@/components/solar-showcase';
import HandbookCover from '@/components/handbook-cover';
import { GitHubIcon } from '@/components/icons';
import { highlights } from '@/lib/release-notes';
import JsonLd from '@/components/json-ld';
import { links } from '@/lib/site';
import { pageMetadata, siteName, defaultDescription, websiteData, softwareData } from '@/lib/seo';

export const metadata = pageMetadata({ title: `${siteName} · A clearer view of our dynamic Sun`, absoluteTitle: true, description: defaultDescription, path: '/' });

const highlightIcons = { radio: Activity, gcs: Box, solar: Orbit, figures: ImageIcon, files: FolderOpen, downloader: Satellite };

const radioFeatures = [
  { icon: Activity, title: 'Reveal the structure', body: 'Subtract the background, tune display thresholds and clean radio-frequency interference from raw spectra.', items: ['Mean, median or median (dB) background', 'RFI cleaning and noise clipping', 'Combine files across time and frequency'] },
  { icon: ScanLine, title: 'Measure the burst', body: 'Isolate features, extract intensity maxima and quantify drift, shock speed and Type II band splitting.', items: ['Automatic ridge tracking', 'Five coronal density models', 'Band-splitting magnetic field'] },
  { icon: Layers, title: 'See the wider event', body: 'Bring GOES X-rays, CME catalogs, geomagnetic indices and solar imagery into the context of your observation.', items: ['GOES XRS & SEP, Kp, Dst', 'LASCO CME catalog', 'e-CALLISTO, Learmonth & STEREO/WAVES'] },
];

export default function Home() {
  return <>
    <JsonLd data={[websiteData(), softwareData()]} />
    <section className="hero">
      <HeroSpectrum />
      <div className="wrap">
        <Link className="release-pill" href="/download/#whats-new">
          <span className="dot" aria-hidden="true" />Version 3.1.0 is here
          <span className="pill-cta">See what’s new <ArrowRight size={13} /></span>
        </Link>
        <h1>A clearer view of <em>our dynamic Sun.</em></h1>
        <p className="hero-copy">From radio bursts to erupting coronal structures. Analyze e-CALLISTO spectra and solar images in one connected, open-source toolkit.</p>
        <div className="actions">
          <Link className="button primary lg" href="/download/"><Download size={18} />Download v3.1.0</Link>
          <Link className="button lg" href="/guide/"><BookOpen size={18} />Explore the user guide</Link>
        </div>
        <div className="hero-meta">
          <span><Monitor size={15} />Windows · Linux · macOS</span><i />
          <span><ShieldCheck size={15} />Free &amp; open source · MIT</span><i />
          <span><Quote size={15} />Published in RAS Techniques &amp; Instruments</span>
        </div>
        <WorkspacePreview />
      </div>
    </section>

    <StatsBand />

    <ToolMap />

    <section className="section band" id="radio-tool">
      <div className="wrap">
        <div className="section-heading" data-reveal>
          <div><span className="eyebrow">Tool 01 · e-CALLISTO FITS Analyzer</span><h2>Follow the signal.<br />Find the science.</h2></div>
          <p>Process and analyze e-CALLISTO dynamic spectra, from the first FITS file to a publication-ready figure.</p>
        </div>
        <div className="feature-grid">
          {radioFeatures.map((f, i) => <article className="feature spotlight" key={f.title} data-reveal style={{ '--delay': `${i * 90}ms` } as React.CSSProperties}>
            <span className="card-icon"><f.icon size={22} /></span>
            <h3>{f.title}</h3>
            <p>{f.body}</p>
            <ul>{f.items.map(item => <li key={item}>{item}</li>)}</ul>
          </article>)}
        </div>
      </div>
    </section>

    <SolarShowcase />

    <section className="section wrap" id="whats-new">
      <div className="section-heading" data-reveal>
        <div><span className="eyebrow">New in v3.1.0</span><h2>Sharper measurements.<br />A wider view.</h2></div>
        <p>Ridge tracking, five density models, multi-view GCS fitting, PFSS modelling and publication-style exports. <Link className="text-link" href="/download/#whats-new">Full release notes <ArrowRight size={15} /></Link></p>
      </div>
      <div className="highlight-grid">
        {highlights.map((h, i) => {
          const Icon = highlightIcons[h.id as keyof typeof highlightIcons] ?? Sparkles;
          return <article className={'highlight spotlight' + (h.tone ? ' ' + h.tone : '')} key={h.id} data-reveal style={{ '--delay': `${(i % 3) * 80}ms` } as React.CSSProperties}>
            <span className="card-icon"><Icon size={20} /></span>
            <h3>{h.title}</h3>
            <ul>{h.items.slice(0, 3).map(([title]) => <li key={title}>{title}</li>)}</ul>
          </article>;
        })}
      </div>
    </section>

    <section className="section band">
      <div className="wrap learn-grid">
        <div data-reveal>
          <span className="eyebrow">Start curious. Go deeper.</span>
          <h2>Your next discovery<br />starts here.</h2>
          <p>The complete user guide covers every window, method and formula, from your first FITS file to three-dimensional CME reconstruction. Read it online or keep the PDF.</p>
          <div className="resource-links" style={{ marginTop: 32 }}>
            {[['01', 'User guide', 'Searchable, illustrated, chapter by chapter.', '/guide/'], ['02', 'Tutorials', 'Follow an observation from import to export.', '/tutorials/'], ['03', 'The science', 'Understand the physics behind the spectrum.', '/science/']].map(([n, title, body, url]) =>
              <Link href={url} key={n}><span>{n}</span><div><h3>{title}</h3><p>{body}</p></div><ArrowRight size={20} /></Link>)}
          </div>
        </div>
        <div data-reveal="scale" style={{ '--delay': '120ms' } as React.CSSProperties}><HandbookCover badge={false} /></div>
      </div>
    </section>

    <section className="section wrap">
      <div className="community-banner">
        <div className="community-card" data-reveal>
          <span className="eyebrow">Science works better together</span>
          <h2>A shared sky.<br />A shared conversation.</h2>
          <p>Ask questions, compare methods and share what you’re learning with researchers and students using the analyzer.</p>
          <div className="actions">
            <Link className="button primary" href="/community/"><MessagesSquare size={17} />Join the discussion</Link>
            <a className="button" href={links.repo} target="_blank" rel="noreferrer"><GitHubIcon size={17} />Star on GitHub</a>
          </div>
        </div>
        <div className="citation-teaser" data-reveal style={{ '--delay': '100ms' } as React.CSSProperties}>
          <span className="eyebrow">Built for research</span>
          <h3>Using the analyzer<br />in your work?</h3>
          <p>Credit the software and make your methods easier to reproduce. The paper is published in RAS Techniques and Instruments.</p>
          <Link className="text-link" href="/citation/">Citation &amp; BibTeX <ArrowRight size={15} /></Link>
          <a className="github-link" href={links.repo} target="_blank" rel="noreferrer"><Code2 size={18} />Explore the source on GitHub</a>
        </div>
      </div>
    </section>

    <section className="wrap" style={{ paddingBottom: 96 }}>
      <div className="cta-banner" data-reveal="scale">
        <h2>Ready to look closer at the Sun?</h2>
        <p>Download e-CALLISTO FITS Analyzer v3.1.0 for Windows, Linux or macOS. Free, open source and ready for your next observation.</p>
        <div className="actions">
          <Link className="button primary lg" href="/download/"><Download size={18} />Download v3.1.0</Link>
          <Link className="button secondary lg" href="/guide/"><BookOpen size={18} />Read the guide</Link>
        </div>
      </div>
    </section>
  </>;
}
