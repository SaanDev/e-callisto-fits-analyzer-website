'use client';

import { useEffect, useRef, useState } from 'react';
import { createPortal } from 'react-dom';
import { useRouter } from 'next/navigation';
import { X } from 'lucide-react';
import { basePath } from '@/lib/site';

/** Interactive layer for a guide chapter: client-side links, figure zoom and
 *  reading progress. */
export default function GuideReader({ html }: { html: string }) {
  const router = useRouter();
  const article = useRef<HTMLElement>(null);
  const progress = useRef<HTMLSpanElement>(null);
  const [zoom, setZoom] = useState<{ src: string; alt: string; caption: string } | null>(null);
  const closeButton = useRef<HTMLButtonElement>(null);
  const lastFocus = useRef<HTMLElement | null>(null);

  // Reading progress through the chapter body.
  useEffect(() => {
    let raf = 0;
    const update = () => {
      raf = 0;
      const el = article.current;
      if (!el) return;
      const rect = el.getBoundingClientRect();
      const total = rect.height - window.innerHeight * 0.6;
      const value = total > 0 ? Math.min(1, Math.max(0, -rect.top / total)) : 1;
      progress.current?.style.setProperty('--read', value.toFixed(4));
    };
    const onScroll = () => { if (!raf) raf = requestAnimationFrame(update); };
    update();
    window.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('resize', onScroll);
    return () => { window.removeEventListener('scroll', onScroll); window.removeEventListener('resize', onScroll); cancelAnimationFrame(raf); };
  }, [html]);

  // Figures open enlarged on click or with Enter.
  useEffect(() => {
    article.current?.querySelectorAll<HTMLImageElement>('figure img').forEach(img => {
      img.tabIndex = 0;
      img.setAttribute('role', 'button');
      img.setAttribute('aria-label', 'Enlarge figure: ' + img.alt);
    });
  }, [html]);

  function openZoom(image: HTMLImageElement) {
    lastFocus.current = image;
    const caption = image.closest('figure')?.querySelector(':scope > figcaption')?.textContent ?? '';
    setZoom({ src: image.currentSrc || image.src, alt: image.alt, caption });
  }

  useEffect(() => {
    if (!zoom) return;
    closeButton.current?.focus();
    const onKey = (event: KeyboardEvent) => { if (event.key === 'Escape') setZoom(null); };
    window.addEventListener('keydown', onKey);
    document.body.style.overflow = 'hidden';
    return () => { window.removeEventListener('keydown', onKey); document.body.style.overflow = ''; lastFocus.current?.focus(); };
  }, [zoom]);

  function onClick(event: React.MouseEvent) {
    const target = event.target as HTMLElement;
    const image = target.closest('figure img') as HTMLImageElement | null;
    if (image) { openZoom(image); return; }
    const link = target.closest('a');
    if (!link || event.defaultPrevented || event.button !== 0 || event.metaKey || event.ctrlKey || event.shiftKey || event.altKey || link.target) return;
    const url = new URL(link.href, window.location.href);
    if (url.origin !== window.location.origin || !url.pathname.startsWith(basePath + '/')) return;
    if (url.pathname === window.location.pathname) return;   // same chapter: native anchor scroll
    event.preventDefault();
    router.push(url.pathname.slice(basePath.length) + url.hash);
  }

  return <>
    <div className="reading-progress" aria-hidden="true"><span ref={progress} /></div>
    <article ref={article} className="prose handbook-prose" onClick={onClick} onKeyDown={event => {
      const image = (event.target as HTMLElement).closest('figure img') as HTMLImageElement | null;
      if (image && (event.key === 'Enter' || event.key === ' ')) { event.preventDefault(); openZoom(image); }
    }} dangerouslySetInnerHTML={{ __html: html }} />
    {zoom && createPortal(<div className="lightbox" role="dialog" aria-modal="true" aria-label="Enlarged figure" onClick={() => setZoom(null)}>
      <button ref={closeButton} type="button" className="icon-button" aria-label="Close enlarged figure" onClick={() => setZoom(null)}><X size={20} /></button>
      <div>
        <img src={zoom.src} alt={zoom.alt} />
        {zoom.caption && <p>{zoom.caption}</p>}
      </div>
    </div>, document.body)}
  </>;
}
