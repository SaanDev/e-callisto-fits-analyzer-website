import Link from 'next/link';
import { Download, ArrowLeft, BookOpen } from 'lucide-react';
import ExampleMovie from '@/components/example-movie';
import PageIntro from '@/components/page-intro';
import { asset } from '@/lib/site';

export const metadata = { title: 'GCS CME Fitting', description: 'Fit a Graduated Cylindrical Shell and a separate shock model to multi-viewpoint coronagraph images and record CME kinematics.' };

export default function GCSFitting() {
  return <>
    <PageIntro label="Solar Image Analyzer · GCS · New in v3.1.0" title="Fit an eruption in three dimensions." crumbs={[['Solar Image Analyzer', '/tools/solar-imaging/'], ['GCS CME fitting']]}>
      Evaluate CME geometry and propagation with a Graduated Cylindrical Shell model viewed through multiple coronagraphs.
    </PageIntro>
    <section className="wrap content-section">
      <a className="tool-image" href={asset('/showcase/gcs.webp')} target="_blank" rel="noreferrer" style={{ marginBottom: 56 }} data-reveal="scale">
        <div className="image-frame"><img src={asset('/showcase/gcs.webp')} alt="GCS CME fit with STEREO B, SOHO and STEREO A coronagraph views" width={1800} height={1100} /></div>
        <span>STEREO B · SOHO · STEREO A — one shared model</span>
      </a>
      <div className="prose">
        <h2 style={{ marginTop: 0 }}>One model, several viewpoints</h2>
        <p>Open <strong>Analysis → GCS CME Fitting…</strong> from the main analyzer or the Solar Image Analysis window. The default setup combines STEREO B/COR2, SOHO/LASCO C2 and STEREO A/COR2 images, with running or base differences, playback and focus layouts.</p>
        <ol>
          <li><strong>Choose the event.</strong> Load observations for a time range. Inspect each view’s actual UTC time and synchronization offset, and exclude frames outside your chosen maximum time offset.</li>
          <li><strong>Match the geometry.</strong> Adjust longitude, latitude, tilt, apex height, half-angle and thickness. Compare the projected wireframe with the same CME front in each viewpoint.</li>
          <li><strong>Refine and record.</strong> Pick front points and press <strong>Refine fit</strong> (<kbd>Ctrl</kbd>+<kbd>R</kbd>, <kbd>⌘</kbd><kbd>R</kbd> on macOS). Two points refine the height; more points and good viewpoint separation progressively unlock direction and shape. Commit the measurement and advance through the event.</li>
          <li><strong>Evaluate propagation.</strong> Examine height–time evolution with linear, quadratic or cubic fits. Export snapshots, graphs, GIF/MP4 movies, a PDF fitting report, CSV measurements and JSON parameters with provenance.</li>
        </ol>
        <h2>Watch the fit evolve</h2>
        <ExampleMovie kind="gcs" />
        <h2>Flux rope and shock fitting</h2>
        <p>The GCS flux-rope geometry and the separate spheroid or ellipsoid shock model describe different structures. Each model keeps its own front points, recorded fits and height–time measurements, so choose the observed front deliberately when refining or recording each one.</p>
        <h2>Keep the interpretation reproducible</h2>
        <p>GCS apex heights are deprojected within the selected model geometry. Derived speeds and accelerations depend on viewpoint coverage, feature selection, timing and fitting assumptions, and reported fit uncertainties do not include every source of reconstruction uncertainty. Keep source frames, parameters and point provenance with your exported results.</p>
        <p>The complete workflow is described in <Link href="/guide/gcs-window/">Part VI of the user guide</Link>.</p>
        <div className="actions" style={{ marginTop: 30 }}>
          <Link className="button primary" href="/download/"><Download size={16} />Download the toolkit</Link>
          <Link className="button" href="/tools/solar-imaging/"><ArrowLeft size={16} />Solar imaging</Link>
          <Link className="button ghost" href="/guide/gcs-window/"><BookOpen size={16} />Read Part VI</Link>
        </div>
      </div>
    </section>
  </>;
}
