import Link from 'next/link';
import { ArrowRight, Layers, Zap } from 'lucide-react';
import { liteVersion, version } from '@/lib/site';

export default function EditionComparison({ detailed = false }: { detailed?: boolean }) {
  return <div className="edition-comparison">
    <div className="cards two edition-grid">
      <article className="card spotlight" data-reveal>
        <div className="edition-heading"><span className="card-icon"><Zap size={22} /></span><span className="tag">New · v{liteVersion} available</span></div>
        <h3>Analyzer Lite</h3>
        <p className="edition-lead">Your CALLISTO data. A lighter, faster workspace.</p>
        <p>A native Rust app designed for lightweight, responsive CALLISTO analysis. Open and combine spectra, clean interference, measure bursts and export your results in a familiar interface.</p>
        <ul className="edition-points"><li>Ridge tracking, density models and Type II band splitting</li><li>Archive downloads, batch processing and station comparison</li><li>Projects, reports and publication-ready figures</li></ul>
        <Link className="text-link" href="/download/#lite">Explore Lite <ArrowRight size={15} /></Link>
      </article>
      <article className="card spotlight" data-reveal>
        <div className="edition-heading"><span className="card-icon"><Layers size={22} /></span><span className="tag">Full edition · v{version} available</span></div>
        <h3>The full analyzer</h3>
        <p className="edition-lead">Connect your radio observation to the wider Sun.</p>
        <p>Choose the complete toolkit when your work also needs solar imaging, three-dimensional CME reconstruction, space-based radio or space-weather context.</p>
        <ul className="edition-points"><li>Solar Image Analysis, PFSS and GCS CME fitting</li><li>STEREO/WAVES, GOES and geomagnetic tools</li><li>Event context and multi-panel event figures</li></ul>
        <Link className="text-link" href="/download/#installers">Download the full analyzer <ArrowRight size={15} /></Link>
      </article>
    </div>
    {detailed && <>
      <div className="table-scroll edition-table" data-reveal>
        <table className="release-table">
          <caption>Choose an edition for your workflow</caption>
          <thead><tr><th scope="col">Workflow</th><th scope="col">Analyzer Lite · v{liteVersion}</th><th scope="col">Full analyzer · v{version}</th></tr></thead>
          <tbody>
            <tr><th scope="row">CALLISTO spectra, processing and Type II analysis</th><td>Included</td><td>Included</td></tr>
            <tr><th scope="row">Archive downloads, batch and multi-station tools</th><td>Included</td><td>Included</td></tr>
            <tr><th scope="row">Radio figures, reports and .efaproj projects</th><td>Included</td><td>Included</td></tr>
            <tr><th scope="row">Solar imaging, PFSS and GCS CME fitting</th><td>Full edition required</td><td>Included</td></tr>
            <tr><th scope="row">SWAVES, GOES and space-weather context</th><td>Full edition required</td><td>Included</td></tr>
            <tr><th scope="row">Event context and Event Figure Composer</th><td>Full edition required</td><td>Included</td></tr>
          </tbody>
        </table>
      </div>
      <p className="small edition-note">The table describes the v{version} editions. Lite is focused on the CALLISTO radio workflow. Both editions install side by side with separate settings and exchange .efaproj projects. Performance depends on your dataset and hardware.</p>
    </>}
  </div>;
}
