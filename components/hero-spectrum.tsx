'use client';

import { useEffect, useRef } from 'react';

/* Decorative animated dynamic spectrum behind the home hero. It simulates a
   CALLISTO-style spectrogram scrolling like live data: background noise,
   persistent RFI channels, short Type III spikes and slowly drifting Type II
   bursts with a fundamental and harmonic lane. The canvas holds one pixel per
   time-frequency cell and is scaled up by CSS, so each frame is cheap. A
   static frame is drawn for reduced motion; animation pauses off-screen. */

type Stop = [number, number, number, number];
const PALETTES: Record<'light' | 'dark', Stop[]> = {
  light: [[0, 247, 249, 252], [0.42, 206, 224, 250], [0.62, 96, 150, 238], [0.8, 108, 79, 224], [0.92, 234, 93, 28], [1, 246, 165, 28]],
  dark: [[0, 6, 11, 20], [0.36, 14, 38, 96], [0.58, 22, 86, 206], [0.76, 192, 40, 60], [0.9, 255, 122, 32], [1, 255, 214, 74]],
};

type Burst = { type: 2 | 3; t0: number; dur: number; startF: number; drift: number; depth: number; peak: number };

const CELL = 4;       // CSS pixels per cell
const STEP_MS = 55;   // time per column

export default function HeroSpectrum() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas?.getContext('2d', { alpha: false });
    if (!canvas || !ctx) return;
    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    let cols = 0, bins = 0, simTime = 0, dark = false;
    let rowProfile: number[] = [];
    let bursts: Burst[] = [];
    let nextType2 = 1, nextType3 = 0.5;
    let lut = new Uint8ClampedArray(64 * 3);
    let visible = true, raf = 0, last = 0;
    let columnImage: ImageData;

    function buildLut() {
      const palette = PALETTES[dark ? 'dark' : 'light'];
      lut = new Uint8ClampedArray(64 * 3);
      for (let i = 0; i < 64; i++) {
        const v = i / 63;
        let s = 1;
        while (s < palette.length - 1 && v > palette[s][0]) s++;
        const a = palette[s - 1], b = palette[s], t = Math.min(1, Math.max(0, (v - a[0]) / (b[0] - a[0] || 1)));
        for (let k = 1; k <= 3; k++) lut[i * 3 + k - 1] = a[k] + (b[k] - a[k]) * t;
      }
    }

    const gauss = (x: number, c: number, s: number) => Math.exp(-0.5 * ((x - c) / s) ** 2);

    function spawn() {
      if (simTime >= nextType2) {
        bursts.push({ type: 2, t0: simTime, dur: 10 + Math.random() * 6, startF: 0.1 + Math.random() * 0.12, drift: 0.48 + Math.random() * 0.22, depth: 0, peak: 0.7 + Math.random() * 0.3 });
        nextType2 = simTime + 12 + Math.random() * 9;
      }
      if (simTime >= nextType3) {
        bursts.push({ type: 3, t0: simTime, dur: 0.5 + Math.random() * 0.5, startF: 0, drift: 0, depth: 0.5 + Math.random() * 0.45, peak: 0.45 + Math.random() * 0.35 });
        nextType3 = simTime + 2 + Math.random() * 6;
      }
      bursts = bursts.filter(b => simTime - b.t0 < b.dur + 1);
    }

    /** Write one time step (a column of cells) into data at column x. */
    function writeColumn(data: Uint8ClampedArray, stride: number, x: number) {
      for (let row = 0; row < bins; row++) {
        const f = row / bins;
        let v = Math.random() * 0.22 + rowProfile[row];
        for (const b of bursts) {
          const age = simTime - b.t0;
          if (age < 0 || age > b.dur) continue;
          const p = age / b.dur;
          if (b.type === 2) {
            const env = Math.sin(Math.PI * p), center = b.startF + b.drift * p, sigma = 0.03 + 0.025 * p;
            const patch = 0.65 + 0.35 * Math.sin(age * 9 + f * 40);   // fragmented lane
            v += b.peak * env * patch * (gauss(f, center, sigma) + 0.6 * gauss(f, center - 0.17, sigma * 0.9));
          } else if (f < b.depth) {
            v += b.peak * gauss(p, 0.35, 0.22) * (1 - (f / b.depth) * 0.4);
          }
        }
        const i = Math.max(0, Math.min(63, Math.round(v * 63))) * 3;
        const o = (row * stride + x) * 4;
        data[o] = lut[i]; data[o + 1] = lut[i + 1]; data[o + 2] = lut[i + 2]; data[o + 3] = 255;
      }
    }

    function step() { simTime += STEP_MS / 1000; spawn(); }

    function fill() {
      const image = ctx!.createImageData(cols, bins);
      for (let x = 0; x < cols; x++) { step(); writeColumn(image.data, cols, x); }
      ctx!.putImageData(image, 0, 0);
    }

    function resize() {
      const width = canvas!.offsetWidth, height = canvas!.offsetHeight;
      if (!width || !height) return;
      cols = Math.ceil(width / CELL); bins = Math.ceil(height / CELL);
      canvas!.width = cols; canvas!.height = bins;
      columnImage = ctx!.createImageData(1, bins);
      rowProfile = Array.from({ length: bins }, () => Math.random() < 0.06 ? 0.14 + Math.random() * 0.24 : 0);
      buildLut(); fill();
    }

    function tick(now: number) {
      raf = requestAnimationFrame(tick);
      if (!visible || now - last < STEP_MS) return;
      last = now;
      ctx!.drawImage(canvas!, -1, 0);
      step(); writeColumn(columnImage.data, 1, 0);
      ctx!.putImageData(columnImage, cols - 1, 0);
    }

    dark = document.documentElement.classList.contains('dark');
    resize();
    let timer = 0;
    const onResize = () => { clearTimeout(timer); timer = window.setTimeout(resize, 200); };
    window.addEventListener('resize', onResize);
    const themeWatch = new MutationObserver(() => {
      const now = document.documentElement.classList.contains('dark');
      if (now !== dark) { dark = now; buildLut(); fill(); }
    });
    themeWatch.observe(document.documentElement, { attributes: true, attributeFilter: ['class'] });
    const io = new IntersectionObserver(([entry]) => { visible = entry.isIntersecting; });
    io.observe(canvas);
    if (!reduce) raf = requestAnimationFrame(tick);
    return () => { cancelAnimationFrame(raf); clearTimeout(timer); window.removeEventListener('resize', onResize); themeWatch.disconnect(); io.disconnect(); };
  }, []);

  return <div className="hero-canvas-wrap" aria-hidden="true"><canvas ref={canvasRef} className="hero-canvas" /></div>;
}
