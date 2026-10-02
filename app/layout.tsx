import type { Metadata } from 'next';
import SiteHeader from '@/components/site-header';
import './globals.css';
export const metadata: Metadata = { title: { default: 'e-CALLISTO FITS Analyzer · A clearer view of the radio Sun', template: '%s · e-CALLISTO FITS Analyzer' }, description: 'Free, open-source solar radio analysis for Windows, Linux and macOS. Download e-CALLISTO FITS Analyzer, learn the science, and join the community.', icons: { icon: '/favicon.ico', shortcut: '/favicon.ico' } };
export default function RootLayout({ children }: {
    children: React.ReactNode;
}) { return <html lang="en" suppressHydrationWarning><body><a className="skip-link" href="#main">Skip to content</a><SiteHeader /><main id="main">{children}</main><footer className="site-footer"><div className="wrap footer-top"><a className="brand" href="/"><img src="/logo.png" alt=""/><span>e-CALLISTO<small>FITS ANALYZER</small></span></a><p>Open tools for understanding our star.</p><div><a href="/download">Downloads</a><a href="/citation">Cite the software</a><a href="https://github.com/SaanDev/e-Callisto_FITS_Analyzer">GitHub</a></div></div><div className="wrap footer-bottom"><span>© 2026 Sahan S Liyanage · <a href="/LICENSE.txt">MIT License</a></span><span>Made for a global community of discovery.</span></div></footer></body></html>; }
