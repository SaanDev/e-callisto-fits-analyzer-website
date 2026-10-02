'use client';

import { Radio, Orbit } from 'lucide-react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

const views = [
  { id: 'radio', name: 'Radio spectra', image: 'radio.webp', caption: 'e-CALLISTO FITS Analyzer · Process and analyze dynamic spectra', detail: 'GREENLAND · 23 APR 2024', icon: Radio },
  { id: 'imaging', name: 'Solar imaging', image: 'solar.webp', caption: 'Solar Image Analyzer · Imaging, CME tracking and magnetic context', detail: 'SDO / AIA · IMAGING WORKSPACE', icon: Orbit },
];

export default function WorkspacePreview() {
  return <Tabs defaultValue="radio" className="workspace-preview">
    <TabsList className="workspace-tabs" aria-label="Explore the two analysis tools">
      {views.map(view => <TabsTrigger key={view.id} value={view.id}><view.icon size={18}/>{view.name}</TabsTrigger>)}
    </TabsList>
    {views.map(view => <TabsContent value={view.id} key={view.id}>
      <figure className="app-showcase">
        <div className="window-bar"><div className="window-dots"><i/><i/><i/></div><span>e-CALLISTO FITS Analyzer</span><span className="window-label">ONE PACKAGE · TWO TOOLS</span></div>
        <img src={`/showcase/${view.image}`} alt={view.caption} width="1800" height="1172"/>
        <figcaption><view.icon size={15}/>{view.caption}<span>{view.detail}</span></figcaption>
      </figure>
    </TabsContent>)}
  </Tabs>;
}
