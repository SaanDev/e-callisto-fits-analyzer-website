'use client';

import { useState, useSyncExternalStore } from 'react';
import Link from 'next/link';
import { Download, BookOpen, ExternalLink, FileText } from 'lucide-react';
import { asset, guidePdf } from '@/lib/site';

/** Download and read actions for the PDF edition. With `reader`, the PDF can
 *  also be opened inline (it is only fetched once the reader is opened). */
export default function GuidePdf({ reader = false }: { reader?: boolean }) {
  const [open, setOpen] = useState(false);
  const inline = useSyncExternalStore(() => () => {}, () => navigator.pdfViewerEnabled !== false, () => true);
  const href = asset(guidePdf.href);

  return <div className="guide-pdf">
    <div className="actions">
      <a className="button primary" href={href} download={guidePdf.filename}><Download size={17} />Download the PDF</a>
      {reader
        ? inline && !open && <button type="button" className="button" onClick={() => setOpen(true)}><BookOpen size={17} />Read it here</button>
        : <Link className="button" href="/guide/pdf/"><BookOpen size={17} />PDF edition</Link>}
      {reader && <a className="button ghost" href={href} target="_blank" rel="noreferrer"><ExternalLink size={16} />Open in a new tab</a>}
    </div>
    <p className="small"><FileText size={14} />{guidePdf.pages} pages · PDF · {guidePdf.size} · First edition, October 2026</p>
    {reader && open && <iframe className="guide-pdf-frame" src={href} title="e-CALLISTO FITS Analyzer User Guide v3.1.0" />}
  </div>;
}
