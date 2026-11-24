'use client';

import { useRef, useState } from 'react';
import Link from 'next/link';
import { Radio, Orbit, Box, ArrowUpRight, Maximize2, X } from 'lucide-react';
import { asset } from '@/lib/site';

const views = [
  { id: 'radio', name: 'Radio spectra', image: 'radio.webp', height: 1120, caption: 'Process spectra. Measure solar radio bursts.', alt: 'e-CALLISTO FITS Analyzer displaying a background-subtracted solar radio dynamic spectrum with frequency, time and intensity axes', link: '/guide/processing-tools/', icon: Radio },
  { id: 'imaging', name: 'Solar imaging', image: 'solar.webp', height: 1172, caption: 'Track eruptions. Explore magnetic context.', alt: 'Solar Image Analyzer showing solar imagery, PFSS magnetic field lines and a CME height–time plot', link: '/tools/solar-imaging/', icon: Orbit },
  { id: 'gcs', name: '3D CME fitting', image: 'gcs.webp', height: 1249, caption: 'Reconstruct a CME from multiple viewpoints.', alt: 'GCS CME fitting workspace with a red wireframe fitted to three coronagraph viewpoints', link: '/tools/gcs-fitting/', icon: Box },
];

export default function WorkspacePreview() {
  const [active, setActive] = useState(0);
  const tabs = useRef<(HTMLButtonElement | null)[]>([]);
  const lightbox = useRef<HTMLDialogElement>(null);

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
    <div className="workspace-heading"><span className="workspace-kicker">Inside the analyzer</span><span className="workspace-status"><span aria-hidden="true" />Actual software screenshots</span></div>
    <div className="app-showcase">
      <div className="showcase-stage">
        {views.map((v, i) => <div key={v.id} id={`workspace-panel-${v.id}`} role="tabpanel" tabIndex={0} aria-labelledby={`workspace-tab-${v.id}`} hidden={i !== active} className="workspace-panel">
          <img src={asset(`/showcase/${v.image}`)} alt={v.alt} width={1800} height={v.height} loading={i === 0 ? 'eager' : 'lazy'} fetchPriority={i === 0 ? 'high' : 'low'} decoding="async" />
        </div>)}
        <button className="workspace-enlarge" type="button" onClick={() => lightbox.current?.showModal()} aria-label={`Enlarge ${view.name} screenshot`} title="View full screenshot"><Maximize2 size={16} /></button>
      </div>
      <div className="workspace-tabs" role="tablist" aria-label="Explore analysis workspaces" onKeyDown={onKeyDown}>
        {views.map((v, i) => <button key={v.id} ref={el => { tabs.current[i] = el; }} type="button" role="tab" id={`workspace-tab-${v.id}`} aria-selected={i === active} aria-controls={`workspace-panel-${v.id}`} tabIndex={i === active ? 0 : -1} onClick={() => setActive(i)}><v.icon size={16} />{v.name}</button>)}
      </div>
    </div>
    <div className="workspace-caption"><p>{view.caption}</p><Link href={view.link}>Explore<ArrowUpRight size={14} /></Link></div>
    <dialog className="workspace-lightbox" ref={lightbox} aria-labelledby="workspace-lightbox-title" onClick={event => { if (event.target === event.currentTarget) lightbox.current?.close(); }}>
      <div className="lightbox-content"><div className="lightbox-heading"><h2 id="workspace-lightbox-title">{view.name}</h2><form method="dialog"><button type="submit" className="icon-button" aria-label="Close screenshot"><X size={20} /></button></form></div><img src={asset(`/showcase/${view.image}`)} alt={view.alt} width={1800} height={view.height} /></div>
    </dialog>
  </div>;
}
