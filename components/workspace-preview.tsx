'use client';

import { useRef, useState } from 'react';
import Link from 'next/link';
import { Radio, Orbit, Box, ArrowUpRight, Check } from 'lucide-react';
import { asset } from '@/lib/site';

const views = [
  { id: 'radio', name: 'Radio spectra', image: 'radio.webp', caption: 'Process and analyze dynamic spectra', link: '/guide/processing-tools/', icon: Radio },
  { id: 'imaging', name: 'Solar imaging', image: 'solar.webp', caption: 'Imaging, CME tracking and magnetic context', link: '/tools/solar-imaging/', icon: Orbit },
  { id: 'gcs', name: '3D CME fitting', image: 'gcs.webp', caption: 'Reconstruct an eruption from multiple viewpoints', link: '/tools/gcs-fitting/', icon: Box },
];

export default function WorkspacePreview() {
  const [active, setActive] = useState(0);
  const tabs = useRef<(HTMLButtonElement | null)[]>([]);

  function onKeyDown(event: React.KeyboardEvent) {
    let next: number;
    if (event.key === 'Home') next = 0;
    else if (event.key === 'End') next = views.length - 1;
    else if (event.key === 'ArrowRight') next = (active + 1) % views.length;
    else if (event.key === 'ArrowLeft') next = (active + views.length - 1) % views.length;
    else return;
    event.preventDefault();
    setActive(next);
    tabs.current[next]?.focus();
  }

  const view = views[active];
  return <div className="workspace-preview">
    <div className="workspace-heading">
      <span className="workspace-kicker">Your observation. Every perspective.</span>
      <span className="workspace-status"><span aria-hidden="true" />Actual software workspaces</span>
    </div>
    <div className="app-showcase-wrap">
      <div className="app-showcase">
        <div className="window-bar" aria-hidden="true">
          <div className="window-dots"><i /><i /><i /></div>
          <span className="window-title">e-CALLISTO FITS Analyzer</span>
          <span className="window-label">V3.1.1</span>
        </div>
        <div className="workspace-tabs" role="tablist" aria-label="Explore analysis workspaces" onKeyDown={onKeyDown}>
          {views.map((v, i) => <button
            key={v.id}
            ref={el => { tabs.current[i] = el; }}
            type="button"
            role="tab"
            id={`workspace-tab-${v.id}`}
            aria-selected={i === active}
            aria-controls={`workspace-panel-${v.id}`}
            tabIndex={i === active ? 0 : -1}
            onClick={() => setActive(i)}
          ><v.icon size={16} />{v.name}</button>)}
          <span className="workspace-included"><Check size={13} />All included</span>
        </div>
        <div className="showcase-stage">
          {views.map((v, i) => <div
            key={v.id}
            id={`workspace-panel-${v.id}`}
            role="tabpanel"
            tabIndex={0}
            aria-labelledby={`workspace-tab-${v.id}`}
            hidden={i !== active}
            className="workspace-panel"
          >
            <img
              src={asset(`/showcase/${v.image}`)}
              alt={`${v.name} workspace: ${v.caption}`}
              width={1800}
              height={1172}
              loading={i === 0 ? 'eager' : 'lazy'}
              fetchPriority={i === 0 ? 'high' : 'low'}
              decoding="async"
            />
          </div>)}
        </div>
        <div className="workspace-caption">
          <p><view.icon size={15} /><span>{view.caption}</span></p>
          <Link href={view.link}>Explore workspace <ArrowUpRight size={15} /></Link>
        </div>
      </div>
    </div>
    <div className="workspace-footnote"><Check size={14} aria-hidden="true" />No separate Python installation needed. Just install and explore.</div>
  </div>;
}
