import { ArrowDown, ArrowUpRight, BookOpen, ChartNoAxesCombined, Download, FileCode2, Layers, Package, Radar, Radio, Terminal } from 'lucide-react';
import PageIntro from '@/components/page-intro';
import CopyButton from '@/components/copy-button';
import { GitHubIcon } from '@/components/icons';
import { pageMetadata } from '@/lib/seo';

export const metadata = pageMetadata({
  title: 'ecallistolib · Python library',
  description: 'Download, read, process and plot e-CALLISTO FITS dynamic spectra in Python. Install ecallistolib and explore practical examples, burst catalogs and notebooks.',
  path: '/ecallistolib/',
});

const repo = 'https://github.com/SaanDev/ecallistolib';
const pypi = 'https://pypi.org/project/ecallistolib/';
const install = 'python -m pip install "ecallistolib[download,plot]"';

const features = [
  { icon: Download, title: 'Find and download', body: 'List FITS files by UTC date, hour and station, then download observations with retries and parallel workers.' },
  { icon: FileCode2, title: 'Read FITS in Python', body: 'Open .fit and .fit.gz files as DynamicSpectrum objects with intensity data, frequency and time axes, and observation metadata.' },
  { icon: Radio, title: 'Process and clean', body: 'Subtract backgrounds, reduce noise, crop time and frequency ranges, and mitigate radio frequency interference.' },
  { icon: Layers, title: 'Combine observations', body: 'Combine frequency bands or time segments, and group files by station and UTC day while retaining provenance.' },
  { icon: ChartNoAxesCombined, title: 'Plot and compare', body: 'Create dynamic spectra and light curves, add official GOES X-ray flux data, and save figures at your chosen DPI.' },
  { icon: Radar, title: 'Explore burst catalogs', body: 'Search published burst reports by date, station and type. Preview candidate FITS files before selecting what to download.' },
];

const examples = [
  {
    id: 'read-and-plot', title: 'Read, process and plot', label: '01 · Local FITS file',
    description: 'Replace the filename with a downloaded e-CALLISTO observation. This example subtracts the background, clips the intensity range and saves the figure.',
    requires: 'plot',
    code: `import ecallistolib as ecl
import matplotlib.pyplot as plt

spectrum = ecl.read_fits("STATION_20230101_120000_01.fit.gz")
print(spectrum.shape)  # (n_freq, n_time)
print(spectrum.freq_range_mhz)

fig, ax, image = ecl.plot_dynamic_spectrum(
    spectrum,
    process="noise_reduced",
    clip_low=-5,
    clip_high=20,
    title="Solar radio observation",
    dpi=180,
    save_path="observation.png",
)
plt.show()`,
  },
  {
    id: 'download-data', title: 'Download observations', label: '02 · Archive access',
    description: 'Choose a UTC day and hour, and replace the station filter with your instrument’s name. Inspect the listing, then download the selected files.',
    requires: 'download',
    code: `from datetime import date
import ecallistolib as ecl

remote_files = ecl.list_remote_fits(
    day=date(2023, 6, 15),
    hour=14,
    station_substring="station-name",
)
for remote_file in remote_files:
    print(remote_file.name)

paths = ecl.download_files(
    remote_files,
    out_dir="./data",
    workers=4,
    retries=2,
    overwrite="skip",
)
print(paths)`,
  },
  {
    id: 'search-bursts', title: 'Search reported bursts', label: '03 · Burst event catalog',
    description: 'Search published Type III reports for a UTC date and station. Check coverage and parsing diagnostics even when the search returns no events.',
    requires: 'download',
    code: `from datetime import date
import ecallistolib as ecl

catalog = ecl.search_bursts(
    date(2026, 9, 1),
    station="BIR",
    burst_type="III",
    cache_dir=".cache/bursts",
)
for event in catalog:
    print(event.start, event.end, event.type_label)

print(catalog.coverage)
print(catalog.diagnostics)

if catalog:
    selection = ecl.list_burst_files(
        catalog[0], stations="BIR", padding_s=120,
    )
    print(selection.by_station)
    print(selection.unresolved_stations)`,
  },
];

function CodeExample({ code, label }: { code: string; label: string }) {
  return <div className="library-code">
    <div className="library-code-bar"><span><Terminal size={15} aria-hidden="true" />{label}</span><CopyButton text={code} label="Copy code" /></div>
    <pre tabIndex={0} aria-label={label}><code>{code}</code></pre>
  </div>;
}

export default function EcallistoLibrary() {
  return <>
    <PageIntro
      label="Python library for solar radio astronomy"
      labelInHeading={false}
      title="ecallistolib"
      crumbs={[['ecallistolib']]}
      actions={<>
        <a className="button primary lg" href="#installation"><Terminal size={18} />Install the library<ArrowDown size={16} /></a>
        <a className="button lg" href={pypi} target="_blank" rel="noreferrer"><Package size={18} />View on PyPI<ArrowUpRight size={16} /></a>
        <a className="button lg" href={repo} target="_blank" rel="noreferrer"><GitHubIcon size={18} />Source on GitHub<ArrowUpRight size={16} /></a>
      </>}
    >
      Bring e-CALLISTO observations into your Python workflow. Find, download, read, process and plot solar radio dynamic spectra in scripts and notebooks.
    </PageIntro>

    <div className="wrap library-meta" aria-label="Library details">
      <span className="tag">v1.5.0</span><span className="tag">Python 3.10–3.14</span><span className="tag">MIT License</span><span className="small">Open source · Python API and CLI</span>
    </div>

    <nav className="wrap library-jump" aria-label="On this page">
      <a href="#overview">Overview</a><a href="#installation">Installation</a><a href="#examples">Usage examples</a><a href="#resources">Documentation &amp; notebooks</a>
    </nav>

    <section className="section tight wrap" id="overview" aria-labelledby="overview-heading">
      <div className="section-heading" data-reveal>
        <div><span className="eyebrow">From archive to figure</span><h2 id="overview-heading">Build your own analysis workflow.</h2></div>
        <p>Use the library directly in Python for repeatable analysis, batch processing and notebook exploration.</p>
      </div>
      <div className="cards">
        {features.map(feature => <article className="card spotlight" key={feature.title} data-reveal>
          <span className="card-icon"><feature.icon size={21} aria-hidden="true" /></span>
          <h3>{feature.title}</h3><p>{feature.body}</p>
        </article>)}
      </div>
    </section>

    <section className="section tight band" id="installation" aria-labelledby="install-heading">
      <div className="wrap">
        <div className="section-heading" data-reveal>
          <div><span className="eyebrow">Installation</span><h2 id="install-heading">Start with the tools you need.</h2></div>
          <p>Use Python 3.10–3.14. Install the download and plotting extras to follow all the examples below.</p>
        </div>
        <CodeExample code={install} label="Terminal · recommended for these examples" />
        <p className="small" style={{ marginTop: 16 }}>Package details, published releases and distribution files are available on <a className="text-link" href={pypi} target="_blank" rel="noreferrer">ecallistolib on PyPI<ArrowUpRight size={15} /></a>.</p>
        <div className="library-install-grid">
          <div className="card">
            <h3>Core library</h3>
            <p>Read FITS files, process arrays and crop spectra. NumPy and Astropy are included as dependencies.</p>
            <CodeExample code="python -m pip install ecallistolib" label="Terminal · core install" />
          </div>
          <div className="card">
            <h3>Optional extras</h3>
            <dl className="library-extras">
              <div><dt><code>download</code></dt><dd>Archive downloads and burst catalog search</dd></div>
              <div><dt><code>plot</code></dt><dd>Matplotlib spectra and light curves</dd></div>
              <div><dt><code>rfi</code></dt><dd>SciPy-based RFI mitigation</dd></div>
              <div><dt><code>goes</code></dt><dd>Official GOES XRS retrieval and netCDF support</dd></div>
            </dl>
            <CodeExample code={'python -m pip install "ecallistolib[all]"'} label="Terminal · all extras" />
          </div>
        </div>
      </div>
    </section>

    <section className="section wrap" id="examples" aria-labelledby="examples-heading">
      <div className="section-heading" data-reveal>
        <div><span className="eyebrow">Usage examples</span><h2 id="examples-heading">A few lines to get started.</h2></div>
        <p>Run these examples in your own Python environment. Archive access and catalog searches require an internet connection.</p>
      </div>
      <div className="library-examples">
        {examples.map(example => <article className="library-example" key={example.id} id={example.id} aria-labelledby={`${example.id}-heading`}>
          <div className="library-example-copy">
            <span className="eyebrow">{example.label}</span>
            <h3 id={`${example.id}-heading`}>{example.title}</h3>
            <p>{example.description}</p>
            <span className="small">Requires the <code>{example.requires}</code> extra.</span>
            {example.id === 'search-bursts' && <div className="notice"><strong>Published reports, with source context.</strong><p>Catalog search finds reported events; it does not detect or classify bursts in FITS data. Missing reports do not imply zero solar activity.</p></div>}
          </div>
          <CodeExample code={example.code} label={`${example.title} · Python`} />
        </article>)}
      </div>
    </section>

    <section className="section tight band" id="resources" aria-labelledby="resources-heading">
      <div className="wrap">
        <div className="section-heading" data-reveal>
          <div><span className="eyebrow">Keep exploring</span><h2 id="resources-heading">Go further with the library.</h2></div>
          <p>Detailed function signatures, complete workflows and runnable notebooks live with the library source.</p>
        </div>
        <div className="cards">
          <a className="card spotlight" href={`${repo}#api-reference`} target="_blank" rel="noreferrer">
            <span className="card-icon"><BookOpen size={21} aria-hidden="true" /></span><h3>Usage &amp; API reference</h3>
            <p>Explore processing, combining, RFI mitigation, GOES data, plotting and the ecallisto command-line tool.</p><span className="more">Read the documentation<ArrowUpRight size={15} /></span>
          </a>
          <a className="card spotlight" href={`${repo}/blob/main/notebooks/complete_tutorial.ipynb`} target="_blank" rel="noreferrer">
            <span className="card-icon"><FileCode2 size={21} aria-hidden="true" /></span><h3>Complete tutorial</h3>
            <p>Follow a notebook covering downloads, multi-band spectra, grouped workflows, light curves and GOES comparisons.</p><span className="more">Open the notebook<ArrowUpRight size={15} /></span>
          </a>
          <a className="card spotlight" href={`${repo}/blob/main/notebooks/burst_events.ipynb`} target="_blank" rel="noreferrer">
            <span className="card-icon"><Radar size={21} aria-hidden="true" /></span><h3>Burst event walkthrough</h3>
            <p>Search events, resolve station names, select files, check temporal coverage and plot event windows.</p><span className="more">Explore burst events<ArrowUpRight size={15} /></span>
          </a>
        </div>
        <div className="actions library-resource-links">
          <a className="text-link" href={`${repo}/blob/main/CHANGELOG.md`} target="_blank" rel="noreferrer">Release history<ArrowUpRight size={15} /></a>
          <a className="text-link" href={`${repo}/issues`} target="_blank" rel="noreferrer">Report a library issue<ArrowUpRight size={15} /></a>
          <a className="text-link" href={`${repo}/blob/main/LICENSE`} target="_blank" rel="noreferrer">MIT License<ArrowUpRight size={15} /></a>
        </div>
      </div>
    </section>
  </>;
}
