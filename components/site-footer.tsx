import Link from 'next/link';
import { GitHubIcon } from '@/components/icons';
import { asset, links, version, guidePdf } from '@/lib/site';

const columns: [string, [string, string][]][] = [
  ['Software', [['Download', '/download/'], ['What’s new in v3.1.0', '/download/#whats-new'], ['Solar Image Analyzer', '/tools/solar-imaging/'], ['GCS CME fitting', '/tools/gcs-fitting/']]],
  ['Learn', [['User guide', '/guide/'], ['PDF edition', '/guide/pdf/'], ['Tutorials', '/tutorials/'], ['Scientific background', '/science/']]],
  ['Community', [['Discussions', '/community/'], ['Report a bug', links.newIssue], ['Documentation hub', '/docs/'], ['Cite the software', '/citation/']]],
  ['Project', [['Source code', links.repo], ['All releases', links.releases], ['Software paper', links.paper], ['MIT License', '/LICENSE.txt']]],
];

function FooterLink({ label, url }: { label: string; url: string }) {
  if (url.startsWith('http')) return <a href={url} target="_blank" rel="noreferrer">{label}</a>;
  if (url.endsWith('.txt') || url.endsWith('.pdf')) return <a href={asset(url)}>{label}</a>;
  return <Link href={url}>{label}</Link>;
}

export default function SiteFooter() {
  return <footer className="site-footer">
    <div className="wrap">
      <div className="footer-grid">
        <div className="footer-brand">
          <Link className="brand" href="/"><img src={asset('/logo-96.png')} alt="" width={38} height={38} /><span>e-CALLISTO<small>FITS ANALYZER</small></span></Link>
          <p>Free, open tools for solar radio spectra, solar imaging and CME reconstruction.</p>
          <span className="tag">v{version} · {guidePdf.pages}-page user guide</span>
        </div>
        {columns.map(([title, items]) => <div className="footer-col" key={title}>
          <h3>{title}</h3>
          {items.map(([label, url]) => <FooterLink key={label} label={label} url={url} />)}
        </div>)}
      </div>
      <div className="footer-spectrum" aria-hidden="true" />
      <div className="footer-bottom">
        <span>© 2026 Sahan S Liyanage · Astronomical and Space Science Unit, University of Colombo</span>
        <a href={links.repo} target="_blank" rel="noreferrer" style={{ display: 'inline-flex', gap: 8, alignItems: 'center' }}><GitHubIcon size={15} />SaanDev/e-Callisto_FITS_Analyzer</a>
      </div>
    </div>
  </footer>;
}
