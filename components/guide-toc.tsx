'use client';

import { useEffect, useState } from 'react';
import { usePathname } from 'next/navigation';

type Heading = { id: string; title: string };

/** "On this page" links that follow the section being read. */
export default function GuideToc({ headings }: { headings: Heading[] }) {
  const pathname = usePathname();
  const [active, setActive] = useState(headings[0]?.id ?? '');

  useEffect(() => {
    const targets = headings.map(h => document.getElementById(h.id)).filter((el): el is HTMLElement => !!el);
    if (!targets.length) return;
    let raf = 0;
    const update = () => {
      raf = 0;
      const line = window.innerHeight * 0.3;
      let current = targets[0].id;
      for (const el of targets) if (el.getBoundingClientRect().top <= line) current = el.id;
      setActive(current);
    };
    const onScroll = () => { if (!raf) raf = requestAnimationFrame(update); };
    update();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => { window.removeEventListener('scroll', onScroll); cancelAnimationFrame(raf); };
  }, [headings, pathname]);

  if (!headings.length) return null;
  return <nav aria-label="On this page">
    <p>On this page</p>
    {headings.map(h => <a key={h.id} href={'#' + h.id} className={h.id === active ? 'active' : undefined} aria-current={h.id === active ? 'location' : undefined}>{h.title}</a>)}
  </nav>;
}
