// v3.1.0 highlights, condensed from docs/release_notes/RELEASE_NOTES_v3.1.0_*.md
// in the software repository (the full notes are in public/docs/release-notes).

// Bug-fix releases since v3.1.0, newest first, condensed from their GitHub release notes.
export const patchReleases = [
  {
    version: '3.1.2', platforms: 'Windows, Linux and macOS', fixes: [
      'About → Check for Updates… is ready for v3.2.0, whose releases also carry e-CALLISTO FITS Analyzer Lite. It ignores Lite’s installers and Lite-only releases and only offers a release with this application’s installer for your operating system.',
      'A downloaded update whose file name cannot be read from its link is saved under the release installer’s name.',
    ],
  },
  {
    version: '3.1.1', platforms: 'Windows and Linux', fixes: [
      'STEREO/WAVES (SWAVES) radio data open again. The installers left out the leap-second table the CDF reader needs to decode SWAVES time stamps, so opening a SWAVES day failed with a missing CDFLeapSeconds.txt error.',
    ],
  },
];

export type Highlight = { id: string; title: string; tone?: 'solar'; items: [string, string][] };

export const highlights: Highlight[] = [
  {
    id: 'radio', title: 'Radio burst analysis', items: [
      ['Automatic ridge tracking', 'Track Ridge follows the burst’s peak frequency column by column, from the brightest point or a chosen start, bridging short dropouts with sub-channel precision.'],
      ['Selectable time origin', 'Fit f = a·(t − t₀)^−b with t₀ at the file start, the burst onset or a custom UT time.'],
      ['Five coronal density models', 'Newkirk, Saito, Leblanc, Baumbach–Allen and Mann with 1–4 fold multipliers, plus a side-by-side comparison of shock speed and height.'],
    ],
  },
  {
    id: 'gcs', title: 'GCS CME and shock fitting', tone: 'solar', items: [
      ['Multi-view reconstruction', 'Fit a shared Graduated Cylindrical Shell to synchronized SOHO/LASCO and STEREO images.'],
      ['Separate shock model', 'Fit the outer shock with a spheroid or ellipsoid alongside the flux rope, each with its own front points and measurements.'],
      ['Staged refinement and exports', 'Refine from two front points upward, then export snapshots, height–time graphs, movies, a PDF fitting report, CSV and JSON.'],
    ],
  },
  {
    id: 'solar', title: 'Solar Image Analysis', tone: 'solar', items: [
      ['PFSS magnetic field modelling', 'Extrapolate the coronal field from GONG, HMI, GONG ADAPT or local synoptic magnetograms and overlay open and closed field lines on the AIA disk.'],
      ['SOHO/EIT imaging', 'Search, download and layer EIT 171/195/284/304 Å images, with a Helioviewer live preview.'],
      ['Sphere-based Circle Fit', 'CME height is recorded as h = 1 R☉ + 2r for an expanding sphere resting on the solar surface.'],
    ],
  },
  {
    id: 'figures', title: 'Publication-ready figures', items: [
      ['One consistent style', 'Every exported graph uses a white page, Arial type, a closed frame with inward ticks and a framed colour scale, whatever the on-screen theme.'],
      ['More formats', 'JPG joins PNG, PDF, EPS, SVG and TIFF.'],
    ],
  },
  {
    id: 'files', title: 'Opening and processing data', items: [
      ['Drag and drop', 'Drop FITS files or an .efaproj project anywhere on the main window.'],
      ['Recent files and projects', 'Reopen the last ten FITS selections or projects from the File menu.'],
      ['ARTEMIS-IV support', 'ARTLOOK files from Thermopylae open like any other FITS file, with the correct time axis and counts-to-dB scale.'],
      ['Cleaner background subtraction', 'Mean, Median or Median (dB), always applied to the raw data so methods never stack.'],
    ],
  },
  {
    id: 'downloader', title: 'e-CALLISTO downloader', items: [
      ['Burst List', 'Browse the Monstein burst catalogue, filter by date, type, station and text, then find, preview and import the matching FITS files.'],
      ['Stations that observed', 'Station lists are read from the archive for the selected UTC day instead of a fixed list.'],
    ],
  },
];

export const fixes = [
  'SDO/AIA level 1.5 now works in the packaged Windows application (aiapy is found).',
  'Solar Image Analysis opens noticeably faster because PFSS loads only when needed.',
  'The Qt runtime is updated from PySide6 6.10.1 to 6.11.2.',
  'GCS snapshots render from the underlying data, fixing blank panels in hardware-accelerated exports.',
];

export const notes = [
  'GCS and shock results depend on front selection, viewing geometry and image timing. Reported fit uncertainties do not include every source of reconstruction uncertainty.',
  'PFSS models use synoptic magnetograms assembled over a full solar rotation, so they describe the global field around an observation rather than the instantaneous field.',
  'ARTEMIS-IV publishes no absolute flux calibration, so its dB values are relative to the per-channel background, not solar flux units.',
];

// v3.2.0 preview, checked against the analyzer source (October 2026).
// The existing `highlights` above describe the published v3.1 series.
export const upcomingHighlights: Highlight[] = [
  { id: 'lite', title: 'Introducing Analyzer Lite', items: [
    ['A lighter CALLISTO workspace', 'A native Rust edition designed for quick startup and responsive spectrum processing, with a familiar interface.'],
    ['Keep your radio analysis', 'Background subtraction, RFI cleaning, ridge tracking, Type II analysis, multi-station comparison and batch processing.'],
    ['Work alongside the full app', 'Separate installation and settings, with .efaproj project exchange between editions.'],
  ] },
  { id: 'context', title: 'Event context on the spectrum', items: [
    ['Catalog markers', 'Place solar-event catalog markers on the spectrum’s time axis and choose which sources to show.'],
    ['Context that travels', 'Save fetched events in your project, reopen them offline and include markers in exported figures and reports.'],
  ] },
  { id: 'composer', title: 'Event Figure Composer', items: [
    ['One figure for the whole event', 'Combine radio spectra, SWAVES, GOES, event catalogs, geomagnetic panels and solar-image thumbnails.'],
    ['Control the layout', 'Reorder panels, adjust their heights and choose a journal column width, with a live preview.'],
    ['Save the setup', 'Keep the figure composition with your project for later refinement.'],
  ] },
  { id: 'geomagnetic', title: 'Geomagnetic response', items: [
    ['Follow the response at Earth', 'View Dst, SYM-H, Kp, IMF, plasma and auroral indices on a shared UTC axis.'],
    ['Solar-wind context', 'Use OMNI data with clearly labelled L1 fallback measurements where recent OMNI data are unavailable.'],
    ['Traceable exports', 'Export figures and CSV measurements with archive or spacecraft provenance.'],
  ] },
  { id: 'archives', title: 'More solar archive options', tone: 'solar', items: [
    ['Direct archive access', 'Search and download Helioviewer JPEG2000 quicklooks and JSOC AIA synoptic FITS through Solar Image Analysis.'],
    ['Download progress', 'Track downloaded bytes and reuse cached data across the imaging workflow.'],
  ] },
  { id: 'projects', title: 'A more complete event project', items: [
    ['Save the wider observation', 'Keep radio, solar imaging, GCS, geomagnetic response, event context and figure composition in one project.'],
    ['Choose your scope', 'Use Lite for CALLISTO work, and the full analyzer for solar imaging, CME reconstruction and space-weather context.'],
  ] },
];
