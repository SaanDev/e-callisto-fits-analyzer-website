import type { Metadata, Viewport } from 'next';
import { Inter, JetBrains_Mono } from 'next/font/google';
import SiteHeader from '@/components/site-header';
import SiteFooter from '@/components/site-footer';
import SiteEffects from '@/components/site-effects';
import { asset, basePath, siteUrl } from '@/lib/site';
import './globals.css';

const inter = Inter({ subsets: ['latin'], variable: '--font-inter', display: 'swap' });
const mono = JetBrains_Mono({ subsets: ['latin'], variable: '--font-mono', display: 'swap' });

const description = 'Free, open-source analysis of e-CALLISTO solar radio spectra and solar images, with CME tracking, PFSS and GCS fitting, for Windows, Linux and macOS. Download v3.1.0, read the complete user guide and join the community.';

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl + basePath + '/'),
  title: { default: 'e-CALLISTO FITS Analyzer · A clearer view of our dynamic Sun', template: '%s · e-CALLISTO FITS Analyzer' },
  description,
  applicationName: 'e-CALLISTO FITS Analyzer',
  authors: [{ name: 'Sahan S Liyanage' }],
  keywords: ['e-CALLISTO', 'CALLISTO', 'FITS', 'solar radio', 'dynamic spectrum', 'Type II burst', 'CME', 'GCS', 'PFSS', 'space weather', 'solar physics'],
  icons: { icon: asset('/favicon.ico'), apple: asset('/apple-touch-icon.png') },
  openGraph: { type: 'website', siteName: 'e-CALLISTO FITS Analyzer', title: 'e-CALLISTO FITS Analyzer', description, images: [{ url: 'og-image.jpg', width: 1200, height: 630 }] },
  twitter: { card: 'summary_large_image' },
};

export const viewport: Viewport = {
  themeColor: [{ media: '(prefers-color-scheme: light)', color: '#f7f9fc' }, { media: '(prefers-color-scheme: dark)', color: '#060b14' }],
};

// Applied before first paint so the saved theme never flashes.
const themeScript = `(function(){var d=document.documentElement;d.classList.add('js');try{var t=localStorage.getItem('callisto-theme');if(t?t==='dark':matchMedia('(prefers-color-scheme: dark)').matches)d.classList.add('dark')}catch(e){}})()`;

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return <html lang="en" className={`${inter.variable} ${mono.variable}`} suppressHydrationWarning>
    <head><script dangerouslySetInnerHTML={{ __html: themeScript }} /></head>
    <body>
      <a className="skip-link" href="#main">Skip to content</a>
      <SiteEffects />
      <SiteHeader />
      <main id="main">{children}</main>
      <SiteFooter />
    </body>
  </html>;
}
