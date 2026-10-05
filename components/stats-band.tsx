'use client';

import { useEffect, useRef, useState, useSyncExternalStore } from 'react';

const CACHE_KEY = 'callisto-download-total';
const CACHE_MS = 30 * 60 * 1000;
const API = 'https://api.github.com/repos/SaanDev/e-Callisto_FITS_Analyzer/releases?per_page=100';

// Total installer downloads across all GitHub releases: a tiny external store
// filled from a 30-minute localStorage cache or the public API.
let downloadTotal: number | null = null;
let requested = false;
const listeners = new Set<() => void>();

function subscribeDownloads(listener: () => void) {
  listeners.add(listener);
  if (!requested) {
    requested = true;
    try {
      const cached = JSON.parse(localStorage.getItem(CACHE_KEY) ?? 'null');
      if (cached && Date.now() - cached.at < CACHE_MS) downloadTotal = cached.total;
    } catch { /* storage unavailable */ }
    if (downloadTotal === null) {
      fetch(API, { headers: { Accept: 'application/vnd.github+json' } })
        .then(r => r.ok ? r.json() : Promise.reject(new Error(String(r.status))))
        .then((data: { assets: { download_count: number }[] }[]) => {
          downloadTotal = data.reduce((n, r) => n + r.assets.reduce((m, a) => m + a.download_count, 0), 0);
          try { localStorage.setItem(CACHE_KEY, JSON.stringify({ total: downloadTotal, at: Date.now() })); } catch { /* ignore */ }
          listeners.forEach(l => l());
        })
        .catch(() => { /* keep the static fallback */ });
    }
  }
  return () => { listeners.delete(listener); };
}

function useDownloadTotal() {
  return useSyncExternalStore(subscribeDownloads, () => downloadTotal, () => null);
}

function CountUp({ value, suffix = '' }: { value: number; suffix?: string }) {
  const ref = useRef<HTMLSpanElement>(null);
  const [shown, setShown] = useState(0);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    let raf = 0;
    const io = new IntersectionObserver(([entry]) => {
      if (!entry.isIntersecting) return;
      io.disconnect();
      if (reduce) { setShown(value); return; }
      const start = performance.now(), duration = 1600;
      const frame = (now: number) => {
        const t = Math.min(1, (now - start) / duration);
        setShown(Math.round(value * (1 - Math.pow(1 - t, 4))));
        if (t < 1) raf = requestAnimationFrame(frame);
      };
      raf = requestAnimationFrame(frame);
    }, { threshold: 0.4 });
    io.observe(el);
    return () => { io.disconnect(); cancelAnimationFrame(raf); };
  }, [value]);
  return <span ref={ref}>{shown.toLocaleString('en-US')}{suffix}</span>;
}

export default function StatsBand() {
  const downloads = useDownloadTotal();
  return <section className="stats-band" aria-label="The project in numbers">
    <div className="wrap stats-grid">
      <div className="stat" data-reveal style={{ '--delay': '0ms' } as React.CSSProperties}>
        <span className="stat-value">v3.1<span className="unit">.0</span></span>
        <span className="stat-label">Latest release · October 2026</span>
      </div>
      <div className="stat" data-reveal style={{ '--delay': '80ms' } as React.CSSProperties}>
        <span className="stat-value"><CountUp value={174} /></span>
        <span className="stat-label">Pages in the user guide</span>
      </div>
      <div className="stat" data-reveal style={{ '--delay': '160ms' } as React.CSSProperties}>
        <span className="stat-value"><CountUp value={21} /><span className="unit">+5</span></span>
        <span className="stat-label">Chapters and appendices</span>
      </div>
      <div className="stat" data-reveal style={{ '--delay': '240ms' } as React.CSSProperties}>
        <span className="stat-value">3</span>
        <span className="stat-label">Platforms · Windows, Linux, macOS</span>
      </div>
      <div className="stat" data-reveal style={{ '--delay': '320ms' } as React.CSSProperties}>
        <span className="stat-value">{downloads === null ? 'Free' : <CountUp value={downloads} suffix="+" />}</span>
        <span className="stat-label">{downloads === null ? 'Open source · MIT License' : <>Installer downloads<span className="live">LIVE</span></>}</span>
      </div>
    </div>
  </section>;
}
