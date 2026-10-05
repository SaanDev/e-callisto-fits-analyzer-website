import Link from 'next/link';
import { Radio, Orbit, ScanLine, Box, ChevronRight } from 'lucide-react';

export default function ToolMap() {
  return <section className="wrap section" aria-labelledby="toolkit-title" id="tools">
    <div className="section-heading" data-reveal>
      <div><span className="eyebrow">Two tools. One connected picture.</span><h2 id="toolkit-title">Choose your view of the Sun.</h2></div>
      <p>Start with a radio observation or an image sequence. Both tools come in the same free software package.</p>
    </div>
    <div className="toolkit-branches">
      <article className="toolkit-branch spotlight" data-reveal>
        <div className="branch-label"><span className="card-icon"><Radio size={21} /></span><span>01 · RADIO</span></div>
        <h3>e-CALLISTO FITS Analyzer</h3>
        <p>Process and analyze e-CALLISTO dynamic spectra, isolate radio bursts, track their drift and estimate shock speeds and coronal magnetic fields.</p>
        <Link href="#radio-tool" className="text-link">Explore radio analysis <ChevronRight size={16} /></Link>
      </article>
      <article className="toolkit-branch solar spotlight" data-reveal style={{ '--delay': '100ms' } as React.CSSProperties}>
        <div className="branch-label"><span className="card-icon"><Orbit size={21} /></span><span>02 · IMAGING</span></div>
        <h3>Solar Image Analyzer</h3>
        <p>Process and analyze solar imaging data from SDO, SOHO and STEREO through two complementary workspaces.</p>
        <div className="toolkit-children">
          <Link href="/tools/solar-imaging/"><ScanLine size={20} /><span><strong>Solar Image Analysis</strong><small>CME tracking · height–time plots · PFSS</small></span><ChevronRight className="chev" size={18} /></Link>
          <Link href="/tools/gcs-fitting/"><Box size={20} /><span><strong>GCS CME Fitting</strong><small>3D geometry · shock fitting · kinematics</small></span><ChevronRight className="chev" size={18} /></Link>
        </div>
      </article>
    </div>
  </section>;
}
