'use client';

import Link from 'next/link';

export default function ErrorPage({ reset }: { reset: () => void }) {
  return <section className="wrap not-found">
    <span className="eyebrow plain">Something went wrong</span>
    <h1 style={{ fontSize: 'clamp(30px, 4vw, 44px)' }}>Something interrupted this page.</h1>
    <p style={{ margin: '16px auto 30px', maxWidth: 480 }}>Please try again. If the problem persists, return to the homepage.</p>
    <div className="actions" style={{ justifyContent: 'center' }}>
      <button type="button" className="button primary" onClick={reset}>Try again</button>
      <Link className="button" href="/">Homepage</Link>
    </div>
  </section>;
}
