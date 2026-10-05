import Link from 'next/link';
import { Home, BookOpen } from 'lucide-react';

export const metadata = { title: 'Page not found' };

export default function NotFound() {
  return <section className="wrap not-found">
    <div className="big" aria-hidden="true">404</div>
    <span className="eyebrow plain">Page not found</span>
    <h1 style={{ fontSize: 'clamp(30px, 4vw, 44px)' }}>This page is off the spectrum.</h1>
    <p style={{ margin: '16px auto 30px', maxWidth: 480 }}>The page may have moved. Try the homepage or search the user guide.</p>
    <div className="actions" style={{ justifyContent: 'center' }}>
      <Link className="button primary" href="/"><Home size={17} />Back to the homepage</Link>
      <Link className="button" href="/guide/"><BookOpen size={17} />Search the user guide</Link>
    </div>
  </section>;
}
