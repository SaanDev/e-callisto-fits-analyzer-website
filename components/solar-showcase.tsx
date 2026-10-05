import Link from 'next/link';
import ExampleMovie from '@/components/example-movie';
import { Orbit, Route, Layers, Crosshair, Maximize2, ChevronRight } from 'lucide-react';
import { asset } from '@/lib/site';

export default function SolarShowcase() {
  return <section className="section band" id="solar-tools">
    <div className="wrap">
      <div className="section-heading" data-reveal>
        <div><span className="eyebrow">Tool 02 · Solar Image Analyzer</span><h2>Follow the eruption.<br />Explore its geometry.</h2></div>
        <p>Two connected workspaces bring solar images, measurements and three-dimensional CME fitting into your analysis. <span className="tag solar" style={{ marginTop: 12 }}>PFSS &amp; GCS new in v3.1.0</span></p>
      </div>

      <article className="solar-tool" id="image-analysis">
        <div className="tool-copy" data-reveal>
          <span className="tool-number">01 / IMAGE ANALYSIS</span>
          <h3>The Sun, frame by frame.</h3>
          <p>Process and analyze SDO, SOHO and STEREO observations. Connect image sequences with CME measurements and magnetic-field context.</p>
          <ul className="capability-list">
            <li><Route size={18} />CME tracking &amp; height–time plots</li>
            <li><Orbit size={18} />PFSS magnetic-field overlays</li>
            <li><Layers size={18} />Running / base differences &amp; composites</li>
            <li><Crosshair size={18} />Crop, measure, export images &amp; movies</li>
          </ul>
          <Link className="text-link" href="/tools/solar-imaging/">Explore solar image analysis <ChevronRight size={16} /></Link>
        </div>
        <a className="tool-image" href={asset('/showcase/solar.webp')} target="_blank" rel="noreferrer" data-reveal="scale" style={{ '--delay': '120ms' } as React.CSSProperties}>
          <div className="image-frame"><img src={asset('/showcase/solar.webp')} alt="Solar Image Analyzer with SDO imagery, PFSS field lines and a CME height–time plot" loading="lazy" width={1800} height={1050} /></div>
          <span><Maximize2 size={14} />Actual software workspace · Open full screenshot</span>
        </a>
      </article>

      <article className="solar-tool reverse" id="gcs-fitting">
        <div className="tool-copy" data-reveal>
          <span className="tool-number">02 / GCS CME FITTING</span>
          <h3>One CME.<br />Multiple perspectives.</h3>
          <p>Fit a Graduated Cylindrical Shell to coronagraph images from multiple viewpoints. Evaluate CME geometry and propagation with a shared three-dimensional model.</p>
          <div className="parameter-pills"><span>Longitude &amp; latitude</span><span>Tilt</span><span>Height</span><span>Half-angle</span><span>Thickness</span></div>
          <p>Record fits, fit the shock separately, compare height–time evolution and export your fitting results.</p>
          <Link className="text-link" href="/tools/gcs-fitting/">Explore GCS fitting <ChevronRight size={16} /></Link>
        </div>
        <a className="tool-image" href={asset('/showcase/gcs.webp')} target="_blank" rel="noreferrer" data-reveal="scale" style={{ '--delay': '120ms' } as React.CSSProperties}>
          <div className="image-frame"><img src={asset('/showcase/gcs.webp')} alt="Red GCS wireframe fitted across STEREO B COR2, SOHO LASCO C2 and STEREO A COR2 views" loading="lazy" width={1800} height={1100} /></div>
          <span><Maximize2 size={14} />STEREO B · SOHO · STEREO A — one shared model</span>
        </a>
      </article>

      <div className="movie-heading" data-reveal>
        <span className="eyebrow">Generated with the analyzer</span>
        <h3>See the science in motion.</h3>
        <p>Play examples exported from the Solar Image Analyzer and GCS tools.</p>
      </div>
      <div className="movie-grid">
        <div data-reveal><ExampleMovie kind="solar" /></div>
        <div data-reveal style={{ '--delay': '100ms' } as React.CSSProperties}><ExampleMovie kind="gcs" /></div>
      </div>
    </div>
  </section>;
}
