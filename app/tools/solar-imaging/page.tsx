import Link from 'next/link';
import { Download, ArrowRight, BookOpen } from 'lucide-react';
import ExampleMovie from '@/components/example-movie';
import PageIntro from '@/components/page-intro';
import { asset } from '@/lib/site';
import { pageMetadata } from '@/lib/seo';

export const metadata = pageMetadata({ title: 'Solar Image Analyzer for SDO, SOHO and STEREO', description: 'Analyze SDO, SOHO and STEREO images: CME tracking, height–time fits, PFSS magnetic-field modelling, differences, composites and movie exports.', path: '/tools/solar-imaging/' });

export default function SolarImaging() {
  return <>
    <PageIntro label="Solar Image Analyzer · SDO, SOHO & STEREO" title="From images to measurements." crumbs={[['Solar Image Analyzer']]}>
      Explore SDO, SOHO and STEREO data, track an eruption and connect it with the magnetic structure of the Sun.
    </PageIntro>
    <section className="wrap content-section">
      <a className="tool-image" href={asset('/showcase/solar.webp')} target="_blank" rel="noreferrer" style={{ marginBottom: 56 }} data-reveal="scale">
        <div className="image-frame"><img src={asset('/showcase/solar.webp')} alt="Solar Image Analyzer with PFSS overlay and CME height–time measurements" width={1800} height={1050} /></div>
        <span>Solar Image Analysis with a PFSS overlay and CME height–time measurements</span>
      </a>
      <div className="prose">
        <h2 style={{ marginTop: 0 }}>A connected imaging workflow</h2>
        <p>Open <strong>Analysis → Solar Image Analysis</strong> in the desktop analyzer. Search instrument archives or load local FITS images. Available sources include SDO/AIA and HMI, SOHO/EIT and LASCO, and STEREO/SECCHI EUVI, COR1, COR2 and HI.</p>
        <ol>
          <li><strong>Load and inspect.</strong> Select an instrument and time range, then browse the frame sequence. Adjust the display, crop a region and compare running or base differences.</li>
          <li><strong>Measure the event.</strong> Use a ruler, intensity profile or region statistics. In Track CME mode, select the same leading-edge feature in successive frames to build a height–time table.</li>
          <li><strong>Fit the evolution.</strong> Compare linear, quadratic or cubic fits and their covariance-based uncertainties. Check the selected feature and frame times before interpreting the result.</li>
          <li><strong>Save your work.</strong> Export measurements as CSV, create figures and GIF/MP4 movies, or save an <code>.ecsolar</code> session to retain your measurements and fitting state.</li>
        </ol>
        <h2>See an exported image sequence</h2>
        <ExampleMovie kind="solar" />
        <h2>Magnetic context with PFSS</h2>
        <p>New in v3.1.0, the Potential Field Source Surface workflow extrapolates the coronal field from a GONG, HMI, GONG ADAPT or local synoptic magnetogram. Overlay open and closed field lines and coronal-hole boundaries on the AIA disk, and inspect the input map, source-surface field and neutral line under <strong>Diagnostics…</strong>. Solves run in the background and downloads are cached.</p>
        <p>Synoptic maps represent global magnetic context assembled over time. PFSS is a model of that field, and a visual overlay should be interpreted with its assumptions and observation times in mind.</p>
        <h2>Image layers and CME geometry</h2>
        <p>Reproject compatible layers, adjust opacity and build contextual composites, now including SOHO/EIT 171, 195, 284 and 304 Å. Leading-edge tracking gives projected heights; Circle Fit models the CME as an expanding sphere resting on the solar surface (h = 1 R☉ + 2r). For a shared three-dimensional model across coronagraph viewpoints, continue to GCS fitting.</p>
        <p>Every window and option is described in <Link href="/guide/solar-window/">Part V of the user guide</Link>.</p>
        <div className="actions" style={{ marginTop: 30 }}>
          <Link className="button primary" href="/tools/gcs-fitting/">Explore GCS CME fitting<ArrowRight className="arrow" size={16} /></Link>
          <Link className="button" href="/download/"><Download size={16} />Get the analyzer</Link>
          <Link className="button ghost" href="/guide/solar-window/"><BookOpen size={16} />Read Part V</Link>
        </div>
      </div>
    </section>
  </>;
}
