'use client';

import { useEffect, useRef, useState } from 'react';
import { usePathname } from 'next/navigation';
import { ArrowUp } from 'lucide-react';

/** Progress and reveals use one observer / animation frame, with no idle loops. */
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
    const resize = new ResizeObserver(onScroll);
    resize.observe(document.body);
    update();
    window.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('resize', onScroll);
    return () => {
      window.removeEventListener('scroll', onScroll);
      window.removeEventListener('resize', onScroll);
      resize.disconnect();
      cancelAnimationFrame(frame);
    };
  }, []);

  useEffect(() => {
    const motion = window.matchMedia('(prefers-reduced-motion: reduce)');
    const observer = new IntersectionObserver(entries => {
      for (const entry of entries) {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-visible');
          observer.unobserve(entry.target);
        }
      }
    }, { rootMargin: '100000px 0px -6% 0px', threshold: 0 });
    const prepare = (el: HTMLElement) => {
      if (el.classList.contains('is-visible')) return;
      // Reconnect nodes when React replays effects or the route changes.
      if (el.hasAttribute('data-animate')) { observer.observe(el); return; }
      if (motion.matches || el.getBoundingClientRect().top < window.innerHeight * .94) {
        el.classList.add('is-visible');
      } else {
        el.setAttribute('data-animate', '');
        observer.observe(el);
      }
    };
    const scan = (root: ParentNode) => root.querySelectorAll<HTMLElement>('[data-reveal]').forEach(prepare);
    scan(document);
    const onMotion = () => {
      if (motion.matches) {
        document.querySelectorAll('[data-animate]').forEach(el => el.classList.add('is-visible'));
        observer.disconnect();
      }
    };
    motion.addEventListener('change', onMotion);
    const mutations = new MutationObserver(records => {
      for (const record of records) record.addedNodes.forEach(node => {
        if (node instanceof HTMLElement) {
          if (node.matches('[data-reveal]')) prepare(node);
          scan(node);
        }
      });
    });
    mutations.observe(document.body, { childList: true, subtree: true });
    return () => { observer.disconnect(); mutations.disconnect(); motion.removeEventListener('change', onMotion); };
  }, [pathname]);

  useEffect(() => {
    const finePointer = window.matchMedia('(hover: hover) and (pointer: fine)');
    const motion = window.matchMedia('(prefers-reduced-motion: reduce)');
    let frame = 0;
    let latest: PointerEvent;
    const update = () => {
      frame = 0;
      const card = (latest.target as Element | null)?.closest?.('.spotlight') as HTMLElement | null;
      if (!card) return;
      const rect = card.getBoundingClientRect();
      card.style.setProperty('--mx', `${latest.clientX - rect.left}px`);
      card.style.setProperty('--my', `${latest.clientY - rect.top}px`);
    };
    const onMove = (event: PointerEvent) => {
      if (!finePointer.matches || motion.matches) return;
      latest = event;
      if (!frame) frame = requestAnimationFrame(update);
    };
    document.addEventListener('pointermove', onMove, { passive: true });
    return () => { document.removeEventListener('pointermove', onMove); cancelAnimationFrame(frame); };
  }, []);

  return <>
    <div className="scroll-progress" ref={bar} aria-hidden="true" />
    <button
      type="button"
      className={'back-to-top' + (showTop ? ' visible' : '')}
      aria-label="Back to top"
      tabIndex={showTop ? 0 : -1}
      onClick={() => window.scrollTo({ top: 0, behavior: window.matchMedia('(prefers-reduced-motion: reduce)').matches ? 'instant' : 'smooth' })}
    ><ArrowUp size={18} /></button>
  </>;
}
