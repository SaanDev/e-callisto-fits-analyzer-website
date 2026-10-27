'use client';

import { useSyncExternalStore } from 'react';
import { Monitor, Terminal, Laptop, Download, ChevronRight, FileText } from 'lucide-react';
import CopyButton from '@/components/copy-button';
import { links, liteVersion, version } from '@/lib/site';
import { getDownload, type Edition, type OS } from '@/lib/downloads';

const platforms = [
  { os: 'Windows' as OS, arch: 'Windows 10 or 11 · 64-bit', ext: '.exe', Icon: Monitor, install: 'Run the installer and follow the setup wizard. It upgrades any earlier v3.x installation, including the v3.1.0 beta, in place.' },
  { os: 'Linux' as OS, arch: 'Debian / Ubuntu · amd64', ext: '.deb', Icon: Terminal, install: 'Install with apt, then launch from your applications menu or with e-callisto-fits-analyzer.' },
  { os: 'macOS' as OS, arch: 'macOS 15 Sequoia or later · Apple silicon', ext: '.dmg', Icon: Laptop, install: 'Open the disk image and drag the app into Applications. Allow it once under Privacy & Security, as described below.' },
];

function detectOS(): OS | null {
  const nav = navigator as Navigator & { userAgentData?: { platform?: string } };
  const platform = (nav.userAgentData?.platform || navigator.platform || '').toLowerCase();
  const ua = navigator.userAgent.toLowerCase();
  if (/android|iphone|ipad/.test(ua)) return null;
  if (platform.includes('win') || ua.includes('windows')) return 'Windows';
  if (platform.includes('mac') || ua.includes('mac os')) return 'macOS';
  if (platform.includes('linux') || ua.includes('linux')) return 'Linux';
  return null;
}

const noSubscription = () => () => {};

export default function DownloadCards({ edition = 'full' }: { edition?: Edition }) {
  // The visitor's platform is only known in the browser; the static HTML has none.
  const os = useSyncExternalStore(noSubscription, detectOS, () => null);

  return <div className="download-grid">
    {platforms.map((p, i) => {
      const download = getDownload(p.os, edition);
      if (!download) return <article key={p.os} className="download-card" data-reveal>
        <div className="platform-head"><span className="card-icon"><p.Icon size={24} /></span><div><h3>{p.os}</h3><p>{p.arch}</p></div></div>
        <span className="tag pending-release">{edition === 'lite' ? `v${liteVersion}` : `v${version}`} · Unavailable</span>
        <p className="install">No verified installer is listed for this platform. Check GitHub releases for available packages.</p>
        <a className="release-link" href={links.releases} target="_blank" rel="noreferrer"><FileText size={15} />Check GitHub releases</a>
      </article>;
      const { release, file } = download;
      const digest = file.digest.replace('sha256:', '');
      const recommended = os === p.os;
      return <article key={p.os} className={'download-card spotlight' + (recommended ? ' recommended' : '')} data-reveal style={{ '--delay': `${i * 90}ms` } as React.CSSProperties}>
        {recommended && <span className="recommended-badge">Recommended for your system</span>}
        <div className="platform-head">
          <span className="card-icon"><p.Icon size={24} /></span>
          <div><h3>{p.os}</h3><p>{p.arch}</p></div>
        </div>
        <a className={'button ' + (recommended || !os ? 'primary' : '')} href={file.browser_download_url} aria-label={`Download ${edition === 'lite' ? 'Analyzer Lite' : 'full analyzer'} for ${p.os}`}><Download size={17} />Download {edition === 'lite' ? 'Lite ' : ''}{p.ext}</a>
        <div className="download-meta"><span>{release.tag.split('(')[0]}{edition === 'lite' ? ' Lite' : ''} · {(file.size / 1e6).toFixed(0)} MB</span><span>Hosted on GitHub</span></div>
        <p className="install">{edition === 'lite' ? ({ Windows: 'Run the Lite setup wizard. It installs alongside the full analyzer.', Linux: <>Install with <code>sudo apt install ./{file.name}</code>, then launch <code>e-callisto-fits-analyzer-lite</code>.</>, macOS: 'Open the disk image and drag Analyzer Lite into Applications. Allow it once under Privacy & Security, as described below.' }[p.os]) : p.install}</p>
        <details className="checksum">
          <summary><ChevronRight size={14} />SHA-256 checksum</summary>
          <pre>{digest}</pre>
          <CopyButton text={digest} label="Copy checksum" />
        </details>
        <a className="release-link" href={release.url} target="_blank" rel="noreferrer"><FileText size={15} />{p.os} release on GitHub</a>
      </article>;
    })}
  </div>;
}
