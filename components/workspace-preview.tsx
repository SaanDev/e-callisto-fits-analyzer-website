'use client';

import { useEffect, useLayoutEffect, useRef, useState } from 'react';
import { Radio, Orbit } from 'lucide-react';
import { asset } from '@/lib/site';

const views = [
  { id: 'radio', name: 'Radio spectra', image: 'radio.webp', caption: 'e-CALLISTO FITS Analyzer · Process and analyze dynamic spectra', detail: 'GREENLAND · 23 APR 2024', icon: Radio },
  { id: 'imaging', name: 'Solar imaging', image: 'solar.webp', caption: 'Solar Image Analyzer · Imaging, CME tracking and magnetic context', detail: 'SDO / AIA · IMAGING WORKSPACE', icon: Orbit },
];

export default function WorkspacePreview() {
  const [active, setActive] = useState(0);
  const tabs = useRef<(HTMLButtonElement | null)[]>([]);
  const [indicator, setIndicator] = useState({ x: 0, w: 0 });
  const frame = useRef<HTMLElement>(null);

  useLayoutEffect(() => {
    const tab = tabs.current[active];
    if (tab) setIndicator({ x: tab.offsetLeft, w: tab.offsetWidth });
  }, [active]);

  // Tilt the window back slightly and let it settle flat as it scrolls into view.
  useEffect(() => {
    const el = frame.current;
    if (!el || window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    let raf = 0;
    const update = () => {
      raf = 0;
      const rect = el.getBoundingClientRect();
      const t = Math.max(0, Math.min(1, (rect.top - window.innerHeight * 0.15) / (window.innerHeight * 0.6)));
      el.style.setProperty('--tilt', `${(t * 9).toFixed(2)}deg`);
    };
    const onScroll = () => { if (!raf) raf = requestAnimationFrame(update); };
    update();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => { window.removeEventListener('scroll', onScroll); cancelAnimationFrame(raf); };
  }, []);

  function onKeyDown(event: React.KeyboardEvent) {
    if (event.key !== 'ArrowRight' && event.key !== 'ArrowLeft') return;
    const next = (active + (event.key === 'ArrowRight' ? 1 : views.length - 1)) % views.length;
    setActive(next);
    tabs.current[next]?.focus();
  }

  const view = views[active];
  return <div className="workspace-preview">
    <div className="workspace-tabs" role="tablist" aria-label="Explore the two analysis tools" onKeyDown={onKeyDown}>
      <span className="indicator" style={{ transform: `translateX(${indicator.x}px)`, width: indicator.w }} aria-hidden="true" />
      {views.map((v, i) => <button
        key={v.id}
        ref={el => { tabs.current[i] = el; }}
        type="button"
        role="tab"
        id={`workspace-tab-${v.id}`}
        aria-selected={i === active}
        aria-controls="workspace-panel"
        tabIndex={i === active ? 0 : -1}
        onClick={() => setActive(i)}
      ><v.icon size={17} />{v.name}</button>)}
    </div>
    <div className="app-showcase-wrap">
      <figure className="app-showcase" ref={frame} id="workspace-panel" role="tabpanel" aria-labelledby={`workspace-tab-${view.id}`}>
        <div className="window-bar">
          <div className="window-dots"><i /><i /><i /></div>
          <span className="window-title">e-CALLISTO FITS Analyzer 3.1.0</span>
          <span className="window-label">ONE PACKAGE · TWO TOOLS</span>
        </div>
        <div className="showcase-stage">
          {views.map((v, i) => <img
            key={v.id}
            className={i === active ? 'active' : undefined}
            src={asset(`/showcase/${v.image}`)}
            alt={i === active ? v.caption : ''}
            aria-hidden={i !== active}
            width={1800}
            height={1172}
            fetchPriority={i === 0 ? 'high' : 'low'}
          />)}
        </div>
        <figcaption><view.icon size={15} />{view.caption}<span>{view.detail}</span></figcaption>
      </figure>
    </div>
  </div>;
}
