'use client';
export default function ErrorPage({ reset }: {
    reset: () => void;
}) { return <section className="wrap section"><h1>Something interrupted this page.</h1><p style={{ margin: '25px 0' }}>Please try again. If the issue persists, return to the homepage.</p><button className="button primary" onClick={reset}>Try again</button> <a className="button secondary" href="/">Homepage</a></section>; }
