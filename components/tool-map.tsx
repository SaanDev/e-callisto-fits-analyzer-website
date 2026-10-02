import { Radio, Orbit, ScanLine, Box } from 'lucide-react';

export default function ToolMap() {
  return <section className="wrap toolkit-map" aria-labelledby="toolkit-title">
    <div className="section-heading"><div><span className="eyebrow">TWO TOOLS. ONE CONNECTED PICTURE.</span><h2 id="toolkit-title">Choose your view of the Sun.</h2></div><p>Start with a radio observation or an image sequence. Both tools come in the same software package.</p></div>
    <div className="toolkit-branches">
      <article className="toolkit-branch"><div className="branch-label"><Radio size={23}/><span>01 · RADIO</span></div><h3>e-CALLISTO FITS Analyzer</h3><p>Process and analyze e-CALLISTO dynamic spectra, isolate radio bursts, and measure their evolution.</p><a href="#radio-tool" className="text-link">Explore radio analysis</a></article>
      <article className="toolkit-branch"><div className="branch-label"><Orbit size={23}/><span>02 · IMAGING</span></div><h3>Solar Image Analyzer</h3><p>Process and analyze solar imaging data from SDO, SOHO, and STEREO through two complementary sections.</p><div className="toolkit-children"><a href="#image-analysis"><ScanLine size={18}/><span><strong>Solar Image Analysis</strong><small>CME tracking · height–time plots · PFSS</small></span></a><a href="#gcs-fitting"><Box size={18}/><span><strong>GCS CME Fitting</strong><small>3D geometry · evolution · propagation</small></span></a></div></article>
    </div>
  </section>;
}
