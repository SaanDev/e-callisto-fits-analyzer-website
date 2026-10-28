import Link from 'next/link';
import { Monitor, Terminal, Laptop, Wrench, Info, BookOpen, ArrowRight, Activity, Box, Orbit, Image as ImageIcon, FolderOpen, Satellite, Sparkles, Zap, CalendarRange, PanelsTopLeft, Earth } from 'lucide-react';
import PageIntro from '@/components/page-intro';
import DownloadCards from '@/components/download-cards';
import EditionComparison from '@/components/edition-comparison';
import releases from '@/releases-verified.json';
import { highlights, releaseHighlights, fixes, notes, patchReleases } from '@/lib/release-notes';
import { currentReleases, currentLiteReleases, asset, links, version, liteVersion, guidePdf } from '@/lib/site';
import JsonLd from '@/components/json-ld';
import { pageMetadata, softwareData } from '@/lib/seo';

export const metadata = pageMetadata({
  title: 'Download · Full analyzer & Lite',
  description: `Download free, open-source e-CALLISTO FITS Analyzer v${version} for Windows, Linux and macOS. Compare the full edition with the lightweight Analyzer Lite v${liteVersion}, with installers and checksums.`,
  path: '/download/',
});

const icons = { lite: Zap, context: CalendarRange, composer: PanelsTopLeft, geomagnetic: Earth, archives: Satellite, projects: FolderOpen, reports: BookOpen, imaging: ImageIcon, reset: Sparkles, radio: Activity, gcs: Box, solar: Orbit, figures: ImageIcon, files: FolderOpen, downloader: Satellite };

const current: string[] = [...Object.values(currentReleases), ...Object.values(currentLiteReleases).filter((tag): tag is string => tag !== null)];
const platformNames: Record<string, string> = { windows: 'Windows', macos: 'macOS', linux: 'Linux', appimage: 'AppImage' };

const previous = Object.values(releases.reduce<Record<string, { version: string; prerelease: boolean; platforms: { name: string; url: string }[] }>>((all, r) => {
  const [, version, platform] = r.tag.match(/^v(.+?)\((.+)\)$/) ?? [];
  if (!version || current.includes(r.tag)) return all;
  all[version] ??= { version, prerelease: r.prerelease, platforms: [] };
  all[version].platforms.push({ name: platformNames[platform.toLowerCase()] ?? platform, url: r.url });
  return all;
}, {}));

export default function Downloads() {
  return <>
    <JsonLd data={softwareData()} />
    <PageIntro label="Download e-CALLISTO FITS Analyzer" title={<>Choose your toolkit.<br />Follow your observation.</>} crumbs={[['Download']]}>
      Download e-CALLISTO FITS Analyzer, free and open-source software for solar radio FITS data analysis on Windows, macOS and Linux. Visualize dynamic spectra, measure radio bursts, analyze solar images and reconstruct CMEs in three dimensions.
    </PageIntro>

    <section className="wrap content-section" id="editions">
      <nav className="actions edition-nav" aria-label="Download page sections">
        <Link className="button primary" href="#installers">Download full analyzer</Link>
        <Link className="button" href="#lite">Analyzer Lite</Link>
        <Link className="button" href="#whats-new">v{version} features</Link>
      </nav>
      <div className="section-heading" data-reveal>
        <div><span className="eyebrow">Full analyzer + Lite</span><h2>The tools your research needs.</h2></div>
        <p>Version {version} is available for Windows, Linux and macOS in both the full analyzer and Analyzer Lite. All six installers share one GitHub release tag; choose your edition and operating system below.</p>
      </div>
      <EditionComparison detailed />
      <div className="notice" data-reveal>
        <strong>Opening projects from older versions?</strong>
        <p>v3.1 radio projects open in v{version}, but projects saved by v{version} cannot be opened in v3.1. Keep a copy before saving older work in the new version.</p>
      </div>
    </section>

    <section className="section band" id="installers">
      <div className="wrap">
        <div className="section-heading" data-reveal>
          <div><span className="eyebrow">Available now · v{version}</span><h2>Download the full analyzer.</h2></div>
          <p>The complete solar radio, imaging and CME toolkit. Choose your operating system below.</p>
        </div>
        <DownloadCards />

        <div className="notice" data-reveal style={{ display: 'flex', gap: 14, alignItems: 'flex-start' }}>
          <Info size={20} style={{ color: 'var(--accent)', flexShrink: 0, marginTop: 3 }} />
          <div><strong>Verify your download.</strong><p>Compare the SHA-256 checksum on each card with your file, for example with <code>certutil -hashfile file SHA256</code> on Windows or <code>shasum -a 256 file</code> on macOS and Linux.</p></div>
        </div>
      </div>
    </section>

    <section className="section wrap" id="lite">
      <div className="section-heading" data-reveal>
        <div><span className="eyebrow">v{liteVersion} · Available now</span><h2>Less overhead.<br />More CALLISTO.</h2></div>
        <p>Built in Rust for a lightweight, responsive radio workspace, with GPU rendering and software fallbacks. Keep background subtraction, RFI cleaning, ridge tracking, Type II analysis, projects and exports in a familiar interface.</p>
      </div>
      <DownloadCards edition="lite" />
      <p className="small edition-note">Lite has its own application, settings and cache, so you can keep the full analyzer installed. No separate Python or Rust installation is needed for packaged installers.</p>
    </section>

    <section className="section band" id="install">
      <div className="wrap">
        <div className="section-heading" data-reveal>
          <div><span className="eyebrow">Full analyzer installation</span><h2>Up and running in minutes.</h2></div>
          <p>Installers are self-contained, so no separate Python installation is needed. Full-edition installers upgrade an existing v3.x full installation in place. Lite installs separately.</p>
        </div>
        <div className="install-grid">
          <article className="card" data-reveal>
            <h3><Monitor size={20} />Windows</h3>
            <ol>
              <li>Close any running instance of the analyzer.</li>
              <li>Run <code>e-CALLISTO_FITS_Analyzer_v{version}_Setup.exe</code> and approve the administrator prompt.</li>
              <li>Follow the setup wizard, then launch from the Start menu or desktop shortcut.</li>
            </ol>
          </article>
          <article className="card" data-reveal style={{ '--delay': '90ms' } as React.CSSProperties}>
            <h3><Terminal size={20} />Linux</h3>
            <ol>
              <li>Install the package from your download folder:<pre style={{ marginTop: 10 }}>sudo apt install ./e-callisto-fits-analyzer_{version}_amd64.deb</pre></li>
              <li>Launch from the application menu or run <code>e-callisto-fits-analyzer</code>.</li>
              <li>If the graphics driver prevents start-up, run with <code>CALLISTO_FORCE_SOFTWARE_OPENGL=1</code>.</li>
            </ol>
          </article>
          <article className="card" data-reveal style={{ '--delay': '180ms' } as React.CSSProperties}>
            <h3><Laptop size={20} />macOS</h3>
            <ol>
              <li>Open the disk image and drag <strong>e-Callisto FITS Analyzer</strong> into <strong>Applications</strong>.</li>
              <li>Open the app once, then choose <strong>System Settings → Privacy &amp; Security → Open Anyway</strong>.</li>
              <li><strong>macOS 13 and 14:</strong> v{version} needs macOS 15 or later. Install <a className="text-link" href="#previous">v3.1.0</a> instead, then Control-click the app, choose <strong>Open</strong> and confirm.</li>
            </ol>
          </article>
        </div>
        <p className="small" style={{ marginTop: 22 }} data-reveal>The macOS app is signed ad hoc and not notarized, so macOS asks for confirmation once per installed version. Full steps are in <Link className="text-link" href="/guide/installation/">Chapter 2 of the user guide</Link>.</p>
      </div>
    </section>

    <section className="section wrap" id="whats-new">
      <div className="section-heading" data-reveal>
        <div><span className="eyebrow">What’s new in v{version}</span><h2>From a radio burst<br />to the whole event.</h2></div>
        <p>One project for the whole event, expanded geomagnetic analysis, event figures, richer reports and new solar imaging tools, alongside the first Analyzer Lite release.</p>
      </div>
      <div className="highlight-grid">
        {releaseHighlights.map((h, i) => {
          const Icon = icons[h.id as keyof typeof icons] ?? Sparkles;
          return <article key={h.id} className={'highlight spotlight' + (h.tone ? ' ' + h.tone : '')} data-reveal style={{ '--delay': `${(i % 3) * 80}ms` } as React.CSSProperties}>
            <span className="card-icon"><Icon size={20} /></span><h3>{h.title}</h3>
            <ul>{h.items.map(([title, body]) => <li key={title}><strong>{title}.</strong> {body}</li>)}</ul>
          </article>;
        })}
      </div>
      <div className="actions" style={{ marginTop: 28 }} data-reveal>
        <a className="button" href={asset('/docs/release-notes/RELEASE_NOTES_v3.2.0.md')} download><BookOpen size={17} />Download v{version} release notes</a>
        <Link className="button" href="/guide/introduction/#sec:whats-new"><BookOpen size={17} />Read the v{guidePdf.version} user guide</Link>
      </div>
      <p className="small edition-note">Event context, Event Figure Composer, geomagnetic response and solar archive options belong to the full edition. The illustrated v{guidePdf.version} user guide covers these workflows in <Link className="text-link" href="/guide/event-context/">Chapter 15: Event Context and Geomagnetic Response</Link>.</p>
    </section>

    <section className="section wrap" id="stable-notes">
      <div className="section-heading" data-reveal>
        <div><span className="eyebrow">What’s new in v3.1</span><h2>Sharper measurements.<br />A wider view.</h2></div>
        <p>Automatic ridge tracking and density-model comparisons for radio bursts, multi-view GCS CME and shock fitting, PFSS modelling and publication-style figure exports.</p>
      </div>
      <div className="notice" data-reveal style={{ display: 'flex', gap: 14, alignItems: 'flex-start', marginTop: 0 }}>
        <Wrench size={20} style={{ color: 'var(--accent)', flexShrink: 0, marginTop: 3 }} />
        <div>
          <strong>Earlier fixes in v3.1.2 and v3.1.1.</strong>
          {patchReleases.map(r => <p key={r.version}><strong>v{r.version} · {r.platforms}.</strong> {r.fixes.join(' ')}</p>)}
          <p>The macOS app requires macOS 15 Sequoia or later. On macOS 13 or 14, use <a className="text-link" href="#previous">v3.1.0</a>. Everything below arrived in v3.1.0.</p>
        </div>
      </div>
      <div className="highlight-grid">
        {highlights.map((h, i) => {
          const Icon = icons[h.id as keyof typeof icons] ?? Sparkles;
          return <article key={h.id} className={'highlight spotlight' + (h.tone ? ' ' + h.tone : '')} data-reveal style={{ '--delay': `${(i % 3) * 80}ms` } as React.CSSProperties}>
            <span className="card-icon"><Icon size={20} /></span>
            <h3>{h.title}</h3>
            <ul>{h.items.map(([title, body]) => <li key={title}><strong>{title}.</strong> {body}</li>)}</ul>
          </article>;
        })}
      </div>
      <div className="cards two" style={{ marginTop: 20 }}>
        <article className="card" data-reveal>
          <h3 style={{ display: 'flex', gap: 10, alignItems: 'center', marginTop: 0 }}><Wrench size={19} />Fixes and improvements in v3.1.0</h3>
          <ul className="prose" style={{ fontSize: 15 }}>{fixes.map(f => <li key={f}>{f}</li>)}</ul>
        </article>
        <article className="card" data-reveal style={{ '--delay': '90ms' } as React.CSSProperties}>
          <h3 style={{ display: 'flex', gap: 10, alignItems: 'center', marginTop: 0 }}><Info size={19} />Notes on interpretation</h3>
          <ul className="prose" style={{ fontSize: 15 }}>{notes.map(n => <li key={n}>{n}</li>)}</ul>
        </article>
      </div>
      <div className="actions" style={{ marginTop: 28 }} data-reveal>
        <Link className="button" href="/guide/introduction/"><BookOpen size={17} />Read the current user guide</Link>
        <Link className="button ghost" href="/guide/">Read the complete guide <ArrowRight className="arrow" size={16} /></Link>
      </div>
    </section>

    <section className="section band" id="previous">
      <div className="wrap">
        <div className="section-heading" data-reveal>
          <div><span className="eyebrow">Earlier versions</span><h2>Previous releases</h2></div>
          <p>Need an earlier version to reproduce a published result? Every release remains available on GitHub.</p>
        </div>
        <div className="table-scroll" data-reveal>
          <table className="release-table">
            <thead><tr><th>Version</th><th>Downloads</th></tr></thead>
            <tbody>
              {previous.map(r => <tr key={r.version}>
                <td><strong>v{r.version}</strong>{r.prerelease && <span className="tag" style={{ marginLeft: 10 }}>Pre-release</span>}</td>
                <td>{r.platforms.map((p, i) => <span key={p.name}>{i > 0 && ' · '}<a href={p.url} target="_blank" rel="noreferrer">{p.name}</a></span>)}</td>
              </tr>)}
            </tbody>
          </table>
        </div>
        <p className="small" style={{ marginTop: 18 }}><a className="text-link" href={links.releases} target="_blank" rel="noreferrer">Browse all releases on GitHub <ArrowRight size={14} /></a></p>
      </div>
    </section>
  </>;
}
