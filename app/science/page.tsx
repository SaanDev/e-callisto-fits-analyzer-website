import Link from 'next/link';
import PageIntro from '@/components/page-intro';
import { asset } from '@/lib/site';
import { pageMetadata } from '@/lib/seo';

export const metadata = pageMetadata({ title: 'Solar radio bursts and dynamic spectra explained', description: 'What dynamic spectra show, plasma emission, frequency drift and coronal density models, and the limits of interpretation.', path: '/science/' });

const sections = [['spectrum', 'Dynamic spectra'], ['emission', 'Plasma emission'], ['drift', 'Drift & density models'], ['imaging', 'Imaging & CME geometry'], ['limits', 'Interpretation limits'], ['sources', 'Read further']];

export default function Science() {
  return <>
    <PageIntro label="Solar radio bursts and dynamic spectra" title="Read the Sun in radio." crumbs={[['Science']]}>
      A starting point for understanding what dynamic spectra show, and what a scientific interpretation requires.
    </PageIntro>
    <section className="wrap content-section doc-layout">
      <aside className="doc-nav" aria-label="On this page">
        <span className="eyebrow plain">Explore</span>
        {sections.map(([id, label]) => <a key={id} href={'#' + id}>{label}</a>)}
      </aside>
      <article className="prose">
        <h2 id="spectrum" style={{ marginTop: 0 }}>A spectrum that changes with time</h2>
        <p>A dynamic spectrum displays radio intensity as a function of time and frequency. In a CALLISTO observation, time runs along the horizontal axis, frequency along the vertical axis, and colour represents intensity. The instrument’s native frequency range is 45–870 MHz; an individual observation’s coverage depends on station configuration and any converters.</p>
        <p>The e-CALLISTO network brings together distributed solar radio spectrometers around the world. Its observations support research, education and radio-frequency interference monitoring. <a href="https://www.e-callisto.org/" target="_blank" rel="noreferrer">Explore the e-CALLISTO network</a>.</p>
        <img src={asset('/screenshots/noise_reduction.webp')} alt="Dynamic spectrum showing drifting radio emission; the colour scale represents intensity" loading="lazy" width={1800} height={1125} data-reveal />

        <h2 id="emission">From plasma to radio emission</h2>
        <p>Solar radio bursts can carry signatures of energetic electrons and shocks. Under a plasma-emission interpretation, radiation occurs near the local electron plasma frequency or its harmonic. The plasma frequency is approximately:</p>
        <span className="formula">f<sub>p</sub> [kHz] ≈ 8.98 √(n<sub>e</sub> [cm⁻³])</span>
        <p>The emission mode matters: assigning the same observed frequency to fundamental or harmonic emission produces different inferred electron densities. A spectrum alone does not always resolve that ambiguity. <a href="https://science.nasa.gov/wp-content/uploads/2023/05/GapAnalysisReport_full_final1.pdf" target="_blank" rel="noreferrer">Background: NASA-hosted solar radio emission overview (§5.1.3)</a>.</p>

        <h2 id="drift">Frequency drift and the corona</h2>
        <p>A drifting emission lane traces a change in observed frequency over time. Converting that drift to a radial height or speed requires an emission assumption and a coronal electron-density model. Version 3.1.0 provides the Newkirk, Saito, Leblanc, Baumbach–Allen and Mann models with 1–4 fold multipliers, and compares the resulting shock speeds and heights side by side.</p>
        <p>For a chosen monotonic density model, a frequency can be mapped to a model height. The resulting height–time curve gives a model-dependent speed. Compare plausible models and document the frequency range, time origin and fitting choices. The formulas used by the analyzer are collected in <Link href="/guide/formulas/">Appendix D of the user guide</Link>.</p>

        <h2 id="imaging">Imaging and CME geometry</h2>
        <p>Coronagraph images show a CME projected onto the plane of the sky, so a leading-edge height measured in one view is a projected height. Fitting a Graduated Cylindrical Shell to images from several viewpoints, such as STEREO and SOHO, constrains a three-dimensional model of the flux rope and gives deprojected heights within that model. A Potential Field Source Surface extrapolation adds the global magnetic context around the event.</p>

        <h2 id="limits">Keep measurement and interpretation distinct</h2>
        <ul>
          <li>Radio-frequency interference can resemble or obscure solar features. Inspect raw data and compare independent stations.</li>
          <li>Thresholds change display contrast; they do not establish detection significance.</li>
          <li>Shock and magnetic-field estimates rely on physical assumptions, emission-lane identification and the selected model.</li>
          <li>GCS reconstruction depends on viewing geometry, front identification and image timing. Small residuals do not establish accuracy.</li>
          <li>PFSS models use synoptic magnetograms assembled over a full solar rotation, so they describe the global field rather than the instantaneous one.</li>
        </ul>

        <h2 id="sources">Read further</h2>
        <ul>
          <li><Link href="/citation/">The e-CALLISTO FITS Analyzer software paper and citation</Link></li>
          <li><a href="https://www.e-callisto.org/" target="_blank" rel="noreferrer">Official CALLISTO instrument and network overview</a></li>
          <li><a href="https://www.pythea.org/en/docs/geometrical_models.html" target="_blank" rel="noreferrer">PyThea: geometrical models for CME reconstruction</a></li>
          <li><Link href="/guide/">The complete user guide, including model behaviour and limits</Link></li>
        </ul>
      </article>
    </section>
  </>;
}
