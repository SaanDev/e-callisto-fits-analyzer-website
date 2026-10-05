'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Sun, Moon, Menu, X, Download, ArrowRight } from 'lucide-react';
import { GitHubIcon } from '@/components/icons';
import { asset, links } from '@/lib/site';

const nav = [
  ['Overview', '/'],
  ['User guide', '/guide/'],
  ['Tutorials', '/tutorials/'],
  ['Science', '/science/'],
  ['Community', '/community/'],
] as const;

function isCurrent(pathname: string, url: string) {
  const path = pathname.replace(/\/$/, '') || '/';
  const target = url.replace(/\/$/, '') || '/';
  return target === '/' ? path === '/' : path === target || path.startsWith(target + '/');
}

export default function SiteHeader() {
  const pathname = usePathname();
  const [menu, setMenu] = useState(false);

  useEffect(() => {
    document.body.style.overflow = menu ? 'hidden' : '';
    const onKey = (event: KeyboardEvent) => { if (event.key === 'Escape') setMenu(false); };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [menu]);

  function toggleTheme() {
    const root = document.documentElement;
    const dark = !root.classList.contains('dark');
    root.classList.add('theme-transition');
    root.classList.toggle('dark', dark);
    window.setTimeout(() => root.classList.remove('theme-transition'), 400);
    try { localStorage.setItem('callisto-theme', dark ? 'dark' : 'light'); } catch { /* private mode */ }
  }

  return <header className={'site-header' + (menu ? ' menu-open' : '')}>
    <div className="wrap header-inner">
      <Link href="/" className="brand" aria-label="e-CALLISTO FITS Analyzer home">
        <img src={asset('/logo-96.png')} alt="" width={38} height={38} />
        <span>e-CALLISTO<small>FITS ANALYZER</small></span>
      </Link>
      <nav aria-label="Main navigation" className="nav">
        {nav.map(([label, url]) => <Link key={url} href={url} aria-current={isCurrent(pathname, url) ? 'page' : undefined}>{label}</Link>)}
      </nav>
      <div className="header-actions">
        <a className="icon-button github-chip" href={links.repo} target="_blank" rel="noreferrer"><GitHubIcon size={17} />GitHub</a>
        <button type="button" className="icon-button theme-toggle" onClick={toggleTheme} aria-label="Toggle dark theme">
          <Sun className="sun" size={18} />
          <Moon className="moon" size={18} />
        </button>
        <Link className="button primary sm header-download" href="/download/"><Download size={16} />Download</Link>
        <button type="button" className="icon-button menu-button" aria-label={menu ? 'Close navigation' : 'Open navigation'} aria-expanded={menu} aria-controls="mobile-nav" onClick={() => setMenu(!menu)}>
          {menu ? <X size={20} /> : <Menu size={20} />}
        </button>
      </div>
    </div>
    <nav id="mobile-nav" className={'mobile-nav' + (menu ? ' open' : '')} aria-label="Mobile navigation" inert={!menu}>
      {nav.map(([label, url], i) => <Link key={url} href={url} onClick={() => setMenu(false)} style={{ '--i': i } as React.CSSProperties} aria-current={isCurrent(pathname, url) ? 'page' : undefined}>{label}<ArrowRight size={18} /></Link>)}
      <a href={links.repo} target="_blank" rel="noreferrer" style={{ '--i': nav.length } as React.CSSProperties}>GitHub<ArrowRight size={18} /></a>
      <Link className="button primary lg" href="/download/" onClick={() => setMenu(false)}><Download size={18} />Download v3.1.0</Link>
    </nav>
  </header>;
}
