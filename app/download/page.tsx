import Link from 'next/link';
import { Monitor, Terminal, Laptop, Wrench, Info, BookOpen, ArrowRight, Activity, Box, Orbit, Image as ImageIcon, FolderOpen, Satellite, Sparkles } from 'lucide-react';
import PageIntro from '@/components/page-intro';
import DownloadCards from '@/components/download-cards';
import releases from '@/releases-verified.json';
import { highlights, fixes, notes } from '@/lib/release-notes';
import { links } from '@/lib/site';
import JsonLd from '@/components/json-ld';
import { pageMetadata, softwareData } from '@/lib/seo';

export const metadata = pageMetadata({
  title: 'Download v3.1.0',
  description: 'Download e-CALLISTO FITS Analyzer v3.1.0 for Windows, Linux and macOS, with checksums, installation steps and the full list of what’s new.',
  path: '/download/',
});

const icons = { radio: Activity, gcs: Box, solar: Orbit, figures: ImageIcon, files: FolderOpen, downloader: Satellite };

const previous = Object.values(releases.reduce<Record<string, { version: string; prerelease: boolean; platforms: { name: string; url: string }[] }>>((all, r) => {
  const [, version, platform] = r.tag.match(/^v(.+?)\((.+)\)$/) ?? [];
  if (!version || version === '3.1.0') return all;
  all[version] ??= { version, prerelease: r.prerelease, platforms: [] };
  all[version].platforms.push({ name: platform === 'MacOS' ? 'macOS' : platform, url: r.url });
  return all;
}, {}));

export default function Downloads() {
  return <>
    <JsonLd data={softwareData()} />
    <PageIntro label="Download v3.1.0 · Windows, macOS & Linux" title={<>One toolkit.<br />A wider view of the Sun.</>} crumbs={[['Download']]}>
      Process radio spectra, analyze solar images and reconstruct CMEs in three dimensions. Free and open source for Windows, Linux and macOS.
    </PageIntro>

    <section className="wrap content-section">
      <DownloadCards />

      <div className="notice" data-reveal style={{ display: 'flex', gap: 14, alignItems: 'flex-start' }}>
        <Info size={20} style={{ color: 'var(--accent)', flexShrink: 0, marginTop: 3 }} />
        <div><strong>Verify your download.</strong><p>Compare the SHA-256 checksum on each card with your file, for example with <code>certutil -hashfile file SHA256</code> on Windows or <code>shasum -a 256 file</code> on macOS and Linux.</p></div>
      </div>
    </section>

    <section className="section band" id="install">
      <div className="wrap">
        <div className="section-heading" data-reveal>
          <div><span className="eyebrow">Installation</span><h2>Up and running in minutes.</h2></div>
          <p>Installers are self-contained, so no separate Python installation is needed. Each upgrades an existing v3.x installation in place.</p>
        </div>
        <div className="install-grid">
          <article className="card" data-reveal>
            <h3><Monitor size={20} />Windows</h3>
            <ol>
              <li>Close any running instance of the analyzer.</li>
              <li>Run <code>e-CALLISTO_FITS_Analyzer_v3.1.0_Setup.exe</code> and approve the administrator prompt.</li>
              <li>Follow the setup wizard, then launch from the Start menu or desktop shortcut.</li>
            </ol>
          </article>
          <article className="card" data-reveal style={{ '--delay': '90ms' } as React.CSSProperties}>
            <h3><Terminal size={20} />Linux</h3>
            <ol>
              <li>Install the package from your download folder:<pre style={{ marginTop: 10 }}>sudo apt install ./e-callisto-fits-analyzer_3.1.0_amd64.deb</pre></li>
              <li>Launch from the application menu or run <code>e-callisto-fits-analyzer</code>.</li>
              <li>If the graphics driver prevents start-up, run with <code>CALLISTO_FORCE_SOFTWARE_OPENGL=1</code>.</li>
            </ol>
          </article>
          <article className="card" data-reveal style={{ '--delay': '180ms' } as React.CSSProperties}>
            <h3><Laptop size={20} />macOS</h3>
            <ol>
              <li>Open the disk image and drag <strong>e-Callisto FITS Analyzer</strong> into <strong>Applications</strong>.</li>
              <li><strong>macOS 15 and later:</strong> open the app once, then choose <strong>System Settings → Privacy &amp; Security → Open Anyway</strong>.</li>
              <li><strong>macOS 13 and 14:</strong> Control-click the app, choose <strong>Open</strong>, then confirm.</li>
            </ol>
          </article>
        </div>
        <p className="small" style={{ marginTop: 22 }} data-reveal>The macOS app is signed ad hoc and not notarized, so macOS asks for confirmation once per installed version. Full steps are in <Link className="text-link" href="/guide/installation/">Chapter 2 of the user guide</Link>.</p>
      </div>
    </section>

    <section className="section wrap" id="whats-new">
      <div className="section-heading" data-reveal>
        <div><span className="eyebrow">What’s new in v3.1.0</span><h2>Sharper measurements.<br />A wider view.</h2></div>
        <p>Automatic ridge tracking and density-model comparisons for radio bursts, multi-view GCS CME and shock fitting, PFSS modelling and publication-style figure exports.</p>
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
          <h3 style={{ display: 'flex', gap: 10, alignItems: 'center', marginTop: 0 }}><Wrench size={19} />Fixes and improvements</h3>
          <ul className="prose" style={{ fontSize: 15 }}>{fixes.map(f => <li key={f}>{f}</li>)}</ul>
        </article>
        <article className="card" data-reveal style={{ '--delay': '90ms' } as React.CSSProperties}>
          <h3 style={{ display: 'flex', gap: 10, alignItems: 'center', marginTop: 0 }}><Info size={19} />Notes on interpretation</h3>
          <ul className="prose" style={{ fontSize: 15 }}>{notes.map(n => <li key={n}>{n}</li>)}</ul>
        </article>
      </div>
      <div className="actions" style={{ marginTop: 28 }} data-reveal>
        <Link className="button" href="/guide/introduction/#what-is-new-in-version-3.1.0"><BookOpen size={17} />What’s new, in the user guide</Link>
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
