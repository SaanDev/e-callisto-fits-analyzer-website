'use client';

import { useSyncExternalStore } from 'react';
import { Monitor, Terminal, Laptop, Download, ChevronRight, FileText } from 'lucide-react';
import CopyButton from '@/components/copy-button';
import releases from '@/releases-verified.json';

type OS = 'Windows' | 'Linux' | 'macOS';

const platforms = [
  { os: 'Windows' as OS, tag: 'v3.1.0(Windows)', arch: 'Windows 10 or 11 · 64-bit', ext: '.exe', Icon: Monitor, install: 'Run the installer and follow the setup wizard. It upgrades any v3.x installation, including the v3.1.0 beta, in place.' },
  { os: 'Linux' as OS, tag: 'v3.1.0(Linux)', arch: 'Debian / Ubuntu · amd64', ext: '.deb', Icon: Terminal, install: 'Install with apt, then launch from your applications menu or with e-callisto-fits-analyzer.' },
  { os: 'macOS' as OS, tag: 'v3.1.0(MacOS)', arch: 'macOS 13 Ventura or later · Apple silicon', ext: '.dmg', Icon: Laptop, install: 'Open the disk image and drag the app into Applications. Allow it once under Privacy & Security, as described below.' },
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

export default function DownloadCards() {
  // The visitor's platform is only known in the browser; the static HTML has none.
  const os = useSyncExternalStore(noSubscription, detectOS, () => null);

  return <div className="download-grid">
    {platforms.map((p, i) => {
      const release = releases.find(r => r.tag === p.tag)!;
      const file = release.assets[0];
      const digest = file.digest.replace('sha256:', '');
      const recommended = os === p.os;
      return <article key={p.os} className={'download-card spotlight' + (recommended ? ' recommended' : '')} data-reveal style={{ '--delay': `${i * 90}ms` } as React.CSSProperties}>
        {recommended && <span className="recommended-badge">Recommended for your system</span>}
        <div className="platform-head">
          <span className="card-icon"><p.Icon size={24} /></span>
          <div><h2>{p.os}</h2><p>{p.arch}</p></div>
        </div>
        <a className={'button ' + (recommended || !os ? 'primary' : '')} href={file.browser_download_url}><Download size={17} />Download {p.ext}</a>
        <div className="download-meta"><span>v3.1.0 · {(file.size / 1e6).toFixed(0)} MB</span><span>Hosted on GitHub</span></div>
        <p className="install">{p.install}</p>
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
