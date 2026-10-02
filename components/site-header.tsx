'use client';
import { useEffect, useState } from 'react';
import { usePathname } from 'next/navigation';
import { Sun, Moon, Menu, X, Download } from 'lucide-react';
import { Switch } from '@/components/ui/switch';
export default function SiteHeader() { const [dark, setDark] = useState(false); const [menu, setMenu] = useState(false); const pathname = usePathname(); useEffect(() => { let value = window.matchMedia('(prefers-color-scheme: dark)').matches; try {
    const saved = localStorage.getItem('callisto-theme');
    if (saved)
        value = saved === 'dark';
}
catch { } setDark(value); document.documentElement.classList.toggle('dark', value); }, []); function toggle(value: boolean) { setDark(value); document.documentElement.classList.toggle('dark', value); try {
    localStorage.setItem('callisto-theme', value ? 'dark' : 'light');
}
catch { } } return <header className="site-header"><div className="wrap header-inner"><a href="/" className="brand" aria-label="e-CALLISTO FITS Analyzer home"><img src="/logo.png" alt=""/><span>e-CALLISTO<small>FITS ANALYZER</small></span></a><nav aria-label="Main navigation" className={menu ? 'nav open' : 'nav'}>{[['Overview', '/'], ['Documentation', '/docs'], ['Science', '/science'], ['Community', '/forum']].map(([label, url]) => <a key={url} href={url} aria-current={pathname === url ? 'page' : undefined} onClick={() => setMenu(false)}>{label}</a>)}</nav><div className="header-actions"><div className="theme-control"><Sun size={15}/><Switch aria-label="Dark theme" checked={dark} onCheckedChange={toggle}/><Moon size={15}/></div><a className="button header-download" href="/download"><Download size={16}/>Download</a><button className="menu-button" aria-label={menu ? 'Close navigation' : 'Open navigation'} aria-expanded={menu} onClick={() => setMenu(!menu)}>{menu ? <X /> : <Menu />}</button></div></div></header>; }
