'use client';

import { useEffect, useRef, useState } from 'react';
import { usePathname } from 'next/navigation';
import { ArrowUp } from 'lucide-react';

/** Site-wide motion: scroll progress, header state, scroll reveals,
 *  pointer-following card highlights and the back-to-top button. */
export default function SiteEffects() {
  const pathname = usePathname();
  const bar = useRef<HTMLDivElement>(null);
  const [showTop, setShowTop] = useState(false);

  useEffect(() => {
    let frame = 0;
    const update = () => {
      frame = 0;
      const y = window.scrollY;
      const max = document.documentElement.scrollHeight - window.innerHeight;
      bar.current?.style.setProperty('--progress', String(max > 0 ? Math.min(1, y / max) : 0));
      document.documentElement.toggleAttribute('data-scrolled', y > 8);
      setShowTop(y > 900);
    };
    const onScroll = () => { if (!frame) frame = requestAnimationFrame(update); };
    update();
    window.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('resize', onScroll);
    return () => {
      window.removeEventListener('scroll', onScroll);
      window.removeEventListener('resize', onScroll);
      cancelAnimationFrame(frame);
    };
  }, []);

  // Reveal [data-reveal] elements as they enter the viewport, including those
  // rendered after a client-side navigation.
  useEffect(() => {
    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    // The huge top margin counts everything above the viewport as seen, so
    // content skipped by an anchor jump is not left hidden.
    const observer = new IntersectionObserver(entries => {
      for (const entry of entries) {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-visible');
          observer.unobserve(entry.target);
        }
      }
    }, { rootMargin: '100000px 0px -8% 0px', threshold: 0 });
    const scan = (root: ParentNode) => root.querySelectorAll<HTMLElement>('[data-reveal]:not(.is-visible)').forEach(el => {
      if (reduce) el.classList.add('is-visible');
      else observer.observe(el);
    });
    scan(document);
    const mutations = new MutationObserver(records => {
      for (const record of records) record.addedNodes.forEach(node => {
        if (node instanceof HTMLElement) {
          if (node.matches('[data-reveal]')) scan(node.parentElement ?? document);
          else scan(node);
        }
      });
    });
    mutations.observe(document.body, { childList: true, subtree: true });
    return () => { observer.disconnect(); mutations.disconnect(); };
  }, [pathname]);

  // Feed the pointer position to .spotlight cards for their hover glow.
  useEffect(() => {
    const onMove = (event: PointerEvent) => {
      const card = (event.target as Element | null)?.closest?.('.spotlight') as HTMLElement | null;
      if (!card) return;
      const rect = card.getBoundingClientRect();
      card.style.setProperty('--mx', `${event.clientX - rect.left}px`);
      card.style.setProperty('--my', `${event.clientY - rect.top}px`);
    };
    document.addEventListener('pointermove', onMove, { passive: true });
    return () => document.removeEventListener('pointermove', onMove);
  }, []);

  return <>
    <div className="scroll-progress" ref={bar} aria-hidden="true" />
    <button
      type="button"
      className={'back-to-top' + (showTop ? ' visible' : '')}
      aria-label="Back to top"
      tabIndex={showTop ? 0 : -1}
      onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
    >
      <ArrowUp size={18} />
    </button>
  </>;
}
