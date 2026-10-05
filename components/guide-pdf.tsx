'use client';
import { useEffect, useRef, useState } from 'react';
import { Download, BookOpen } from 'lucide-react';
import manifest from '@/content/guide-pdf.json';
export default function GuidePdf({ reader = false }: { reader?: boolean }) {
  const [url, setUrl] = useState('');
  const [progress, setProgress] = useState<number | null>(null);
  const [error, setError] = useState('');
  const [inlineSupported, setInlineSupported] = useState(false);
  const abort = useRef<AbortController | null>(null);
  const objectUrl = useRef('');
  useEffect(() => () => { abort.current?.abort(); if (objectUrl.current) URL.revokeObjectURL(objectUrl.current); }, []);
  useEffect(() => { setInlineSupported(navigator.pdfViewerEnabled === true); }, []);
  async function load(download: boolean) {
    if (progress !== null) return;
    setError(''); setProgress(0);
    try {
      let readyUrl = objectUrl.current;
      if (!readyUrl) {
        const controller = new AbortController(); abort.current = controller;
        const data = new Uint8Array(manifest.size); let offset = 0;
        for (const part of manifest.parts) {
          const response = await fetch(part.url, { signal: controller.signal });
          if (!response.ok) throw new Error('Download unavailable');
          const bytes = new Uint8Array(await response.arrayBuffer());
          if (bytes.byteLength !== part.size) throw new Error('Incomplete download');
          data.set(bytes, offset); offset += bytes.byteLength; setProgress(Math.round(offset / manifest.size * 100));
        }
        const digest = await crypto.subtle.digest('SHA-256', data);
        const hash = Array.from(new Uint8Array(digest), b => b.toString(16).padStart(2, '0')).join('');
        if (hash !== manifest.sha256) throw new Error('Download verification failed');
        readyUrl = URL.createObjectURL(new Blob([data], { type: 'application/pdf' }));
        objectUrl.current = readyUrl; setUrl(readyUrl);
      }
      if (download) { const anchor = document.createElement('a'); anchor.href = readyUrl; anchor.download = manifest.filename; document.body.appendChild(anchor); anchor.click(); anchor.remove(); }
    } catch (err) { if (!(err instanceof DOMException && err.name === 'AbortError')) setError('The PDF could not be loaded. Please try again.'); }
    finally { setProgress(null); }
  }
  return <div className="guide-pdf"><div className="actions">
    {reader && <button className="button primary" onClick={() => load(false)} disabled={progress !== null || !!url}><BookOpen size={17}/>{url ? 'PDF ready' : 'Read the PDF'}</button>}
    <button className={'button ' + (reader ? 'secondary' : 'primary')} onClick={() => load(true)} disabled={progress !== null}><Download size={17}/>{progress !== null ? `Preparing PDF · ${progress}%` : 'Download the PDF'}</button>
    {!reader && <a className="button secondary" href="/guide/pdf">Read PDF edition</a>}
    </div><p className="small" aria-live="polite">{error || (progress !== null ? 'Loading your copy of the handbook…' : '174 pages · PDF · 35.9 MB · First edition, October 2026')}</p>
    {reader && url && <><p className="small"><a href={url} target="_blank" rel="noreferrer">Open PDF in a new tab</a>{inlineSupported ? ' if your browser cannot display it below.' : ', or download a copy to read in your preferred PDF viewer.'}</p>{inlineSupported && <iframe className="guide-pdf-frame" src={url} title="e-CALLISTO FITS Analyzer User Guide v3.1.0"/>}</>}
  </div>;
}
