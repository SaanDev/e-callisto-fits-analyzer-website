import Link from 'next/link';
import { Download, BookOpen, ArrowRight, ArrowUpRight, Activity, ScanLine, Layers, Monitor, ShieldCheck, MessagesSquare, Quote, Orbit, Box, FolderOpen, Plus, Check, FileChartColumn } from 'lucide-react';
import WorkspacePreview from '@/components/workspace-preview';
import { InstallerDownloadCount } from '@/components/stats-band';
import { GitHubIcon } from '@/components/icons';
import EditionComparison from '@/components/edition-comparison';
import JsonLd from '@/components/json-ld';
import { asset, links, version } from '@/lib/site';
import { pageMetadata, siteName, defaultDescription, websiteData, softwareData } from '@/lib/seo';

export const metadata = pageMetadata({ title: `${siteName} · Solar radio burst analysis software`, absoluteTitle: true, description: defaultDescription, path: '/' });

const workflow = [
  { icon: FolderOpen, title: 'Start with your observation', body: 'Open and combine FITS files, or find an event with the built-in archive downloader.', link: '/guide/opening-data/', label: 'Open your data' },
  { icon: ScanLine, title: 'Bring the signal into focus', body: 'Subtract the background, clean radio interference and measure Type II burst drift.', link: '/guide/type-ii/', label: 'Explore burst analysis' },
  { icon: FileChartColumn, title: 'Take your results further', body: 'Save your analysis as a project and export figures, measurements and reports.', link: '/guide/', label: 'Explore the user guide' },
];

const faqs = [
  { q: 'Which edition should I choose?', a: 'Choose Analyzer Lite for a lightweight CALLISTO radio workflow, including spectrum processing, burst measurements and exports. Choose the full analyzer for solar imaging, PFSS, GCS CME fitting, SWAVES and space-weather context. Both editions are available for Windows, Linux and macOS.', link: ['Compare editions and downloads', '/download/#editions'] },
  { q: 'What is e-CALLISTO FITS Analyzer?', a: 'e-CALLISTO FITS Analyzer is a free, open-source desktop application for Windows, macOS and Linux. It visualizes, processes and analyzes the solar radio dynamic spectra recorded by the e-CALLISTO spectrometer network, together with solar images from SDO, SOHO and STEREO.', link: ['Introduction', '/guide/introduction/'] },
  { q: 'How do I open an e-CALLISTO FITS file?', a: 'Use File > Open (Ctrl+O) or drag the files onto the main window. The analyzer reads .fit and .fits files, compressed or not, and merges consecutive files into one continuous dynamic spectrum.', link: ['Opening and combining data', '/guide/opening-data/'] },
  { q: 'Where can I get e-CALLISTO data?', a: 'The built-in downloader retrieves FITS files directly from the e-CALLISTO archive, for one station or for every station that observed an event, and browses the Monstein burst list. Learmonth and STEREO/WAVES data are available too.', link: ['The e-CALLISTO FITS downloader', '/guide/downloader/'] },
  { q: 'Can it remove the background and radio interference?', a: 'Yes. Subtract a mean, median or median (dB) background, clip noise and clean radio-frequency interference (RFI) to bring out faint solar radio bursts in the spectrogram.', link: ['Viewing and processing tools', '/guide/processing-tools/'] },
  { q: 'How do I measure a Type II radio burst?', a: 'Isolate the burst, extract or track its intensity maxima and fit its backbone. The analyzer derives the drift rate, shock speed and shock height with five coronal density models, and the magnetic field from band splitting.', link: ['Type II burst analysis', '/guide/type-ii/'] },
  { q: 'Do I need Python, and is it free?', a: 'No separate Python installation is needed: the installers for Windows, macOS and Linux include everything the analyzer uses. It is free and open source under the MIT license.', link: ['Installation and startup', '/guide/installation/'] },
];

/** Keeps the product name together in narrow layouts. */
const keepName = (text: string) => text.split('e-CALLISTO').flatMap((part, i) => i ? [<span className="nowrap" key={i}>e-CALLISTO</span>, part] : [part]);

export default function Home() {
  return <div className="homepage">
    <JsonLd data={[websiteData(), softwareData()]} />

    <section className="product-hero" aria-labelledby="home-title">
      <div className="wrap hero-grid">
        <div className="hero-content">
          <Link className="product-release" href="/download/#whats-new"><span>NEW</span>v{version} &amp; Analyzer Lite<ArrowRight size={14} /></Link>
          <h1 id="home-title"><span className="product-name">e-CALLISTO FITS Analyzer</span>Solar radio data.<br /><em>Scientific clarity.</em></h1>
          <p className="product-lede">Turn solar observations into scientific insight. Explore dynamic spectra, measure radio bursts and connect the full story of a solar eruption in one desktop toolkit.</p>
          <div className="actions">
            <Link className="button primary lg" href="/download/"><Download size={18} />Download for free</Link>
            <Link className="button lg" href="/guide/"><BookOpen size={18} />User guide</Link>
          </div>
          <div className="product-platforms"><Monitor size={15} aria-hidden="true" /><span>Windows, macOS &amp; Linux</span><span className="platform-divider" aria-hidden="true" /><span>Free &amp; open source</span></div>
          <p className="product-install-note"><Check size={14} aria-hidden="true" />No separate Python installation needed</p>
        </div>
        <WorkspacePreview />
      </div>
    </section>

    <section className="research-strip" aria-label="About the software">
      <div className="wrap research-strip-inner">
        <InstallerDownloadCount />
        <a href={links.repo} target="_blank" rel="noreferrer"><GitHubIcon size={22} /><span>Open development<small>Source available on GitHub</small></span><ArrowUpRight size={14} /></a>
        <Link href="/citation/"><Quote size={23} /><span>Published research<small>RAS Techniques and Instruments</small></span><ArrowUpRight size={14} /></Link>
        <a href={asset('/LICENSE.txt')} target="_blank" rel="noreferrer"><ShieldCheck size={23} /><span>Free to use &amp; build on<small>Licensed under MIT</small></span><ArrowUpRight size={14} /></a>
      </div>
    </section>

    <section className="section wrap home-workflow" id="radio-tool" aria-labelledby="workflow-title">
      <div className="section-heading" data-reveal>
        <div><span className="eyebrow">A complete research workflow</span><h2 id="workflow-title">From your first FITS file<br />to your next finding.</h2></div>
        <p>Spend less time moving between tools. Bring your data, processing and measurements together in a visual workspace.</p>
      </div>
      <div className="workflow-grid">
        {workflow.map((step, i) => <article className="workflow-step" key={step.title} data-reveal>
          <div className="workflow-step-top"><span className="workflow-icon"><step.icon size={22} /></span><span className="workflow-number">0{i + 1}</span></div>
          <h3>{step.title}</h3><p>{step.body}</p>
          <Link className="text-link" href={step.link}>{step.label}<ArrowRight size={15} /></Link>
        </article>)}
      </div>
      <div className="workflow-capabilities"><span><Activity size={15} />Dynamic spectra</span><span><ScanLine size={15} />Automatic ridge tracking</span><span><Layers size={15} />Five coronal density models</span><span><FileChartColumn size={15} />Publication-ready figures</span></div>
    </section>

    <section className="section band home-perspectives" id="tools" aria-labelledby="perspectives-title">
      <div className="wrap">
        <div className="section-heading" data-reveal>
          <div><span className="eyebrow">The full analyzer</span><h2 id="perspectives-title">See the event.<br />Understand the bigger picture.</h2></div>
          <p>Go beyond the radio spectrum with dedicated solar imaging and 3D reconstruction workspaces, included in the full edition.</p>
        </div>
        <div className="perspective-grid">
          <article className="perspective-card" data-reveal>
            <Link className="perspective-image" href="/tools/solar-imaging/" aria-label="Explore the Solar Image Analyzer"><img src={asset('/showcase/solar.webp')} alt="Solar Image Analyzer showing solar imagery, magnetic field lines and a CME height–time plot" width={1800} height={1172} loading="lazy" /></Link>
            <div className="perspective-copy"><span className="perspective-label"><Orbit size={17} />Solar imaging</span><h3>Follow the Sun, frame by frame.</h3><p>Explore SDO, SOHO and STEREO images. Track CMEs, compare image sequences and overlay PFSS magnetic fields.</p><Link className="text-link" href="/tools/solar-imaging/">Explore solar imaging<ArrowRight size={15} /></Link></div>
          </article>
          <article className="perspective-card" data-reveal>
            <Link className="perspective-image" href="/tools/gcs-fitting/" aria-label="Explore GCS CME fitting"><img src={asset('/showcase/gcs.webp')} alt="GCS CME fitting with a shared red wireframe across three coronagraph viewpoints" width={1800} height={1249} loading="lazy" /></Link>
            <div className="perspective-copy"><span className="perspective-label"><Box size={17} />3D CME reconstruction</span><h3>One eruption. Multiple perspectives.</h3><p>Fit a shared GCS model to coronagraph observations. Reconstruct CME geometry, measure its evolution and export your results.</p><Link className="text-link" href="/tools/gcs-fitting/">Explore GCS fitting<ArrowRight size={15} /></Link></div>
          </article>
        </div>
      </div>
    </section>

    <section className="section wrap home-editions" id="editions" aria-labelledby="editions-title">
      <div className="section-heading" data-reveal>
        <div><span className="eyebrow">Choose your workspace</span><h2 id="editions-title">Two editions.<br />Open science in both.</h2></div>
        <p>A focused radio workflow or the complete solar analysis toolkit. Choose what fits your research, on any supported platform.</p>
      </div>
      <EditionComparison />
      <div className="home-release-note"><span className="tag">v{version}</span><p>New in this release: connected projects, event context and multi-panel figures.</p><Link className="text-link" href="/download/#whats-new">See what’s new<ArrowRight size={15} /></Link></div>
    </section>

    <section className="section band home-resources" aria-labelledby="resources-title">
      <div className="wrap">
        <div className="section-heading" data-reveal>
          <div><span className="eyebrow">Built for your next question</span><h2 id="resources-title">A clear path to getting started.</h2></div>
          <p>Practical guidance, scientific background and an open community to help you move your research forward.</p>
        </div>
        <div className="home-resource-grid">
          {[
            { icon: BookOpen, title: 'Read the user guide', body: 'Illustrated, searchable documentation for every workspace, method and formula.', label: 'Explore the guide', href: '/guide/' },
            { icon: ScanLine, title: 'Learn by doing', body: 'Follow practical tutorials that take an observation from import to analysis and export.', label: 'Browse tutorials', href: '/tutorials/' },
            { icon: MessagesSquare, title: 'Join the conversation', body: 'Ask questions, discuss methods and share your work with researchers and students.', label: 'Visit the community', href: '/community/' },
          ].map(resource => <Link className="home-resource" href={resource.href} key={resource.href} data-reveal><resource.icon size={23} /><h3>{resource.title}</h3><p>{resource.body}</p><span>{resource.label}<ArrowUpRight size={16} /></span></Link>)}
        </div>
      </div>
    </section>

    <section className="section home-faq" id="faq">
      <div className="wrap">
        <div className="section-heading" data-reveal>
          <div><span className="eyebrow">A few useful answers</span><h2>Before you get started.</h2></div>
          <p>New to <span className="nowrap">e-CALLISTO</span> data? Find the essentials here, with more detail in the user guide.</p>
          <Link className="text-link" href="/guide/">Visit the documentation<ArrowRight size={15} /></Link>
        </div>
        <div className="faq-list" data-reveal>
          {faqs.map((f, i) => <details className="faq-item" name="home-faq" key={f.q} open={i === 0}>
            <summary><span className="faq-number" aria-hidden="true">0{i + 1}</span><h3>{keepName(f.q)}</h3><Plus size={19} aria-hidden="true" /></summary>
            <div className="faq-answer"><p>{keepName(f.a)}</p><Link className="text-link" href={f.link[1]}>{f.link[0]}<ArrowRight size={15} /></Link></div>
          </details>)}
        </div>
      </div>
    </section>

    <section className="wrap home-cta-section">
      <div className="home-cta" data-reveal>
        <div><span className="eyebrow">Your next observation starts here</span><h2>Bring your solar data to life.</h2><p>Free, open-source tools for a closer look at our dynamic Sun.</p></div>
        <div><Link className="button primary lg" href="/download/"><Download size={18} />Download the analyzer<ArrowRight size={17} /></Link><span>Windows · macOS · Linux</span></div>
      </div>
    </section>
  </div>;
}
