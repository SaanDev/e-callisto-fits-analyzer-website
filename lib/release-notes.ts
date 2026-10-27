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

// v3.2.0 highlights condensed from the published GitHub release notes.
// Full notes: public/docs/release-notes/RELEASE_NOTES_v3.2.0.md.
export const releaseHighlights: Highlight[] = [
  { id: 'lite', title: 'Introducing Analyzer Lite', items: [
    ['A lighter CALLISTO workspace', 'A native Rust edition for fast, lightweight radio analysis, with the same familiar interface as the full app.'],
    ['Keep your radio analysis', 'FITS combining, background subtraction, RFI cleaning, ridge tracking, Type II analysis, batch processing and station comparison.'],
    ['Install side by side', 'Separate installation and settings, with .efaproj project exchange between the v3.2.0 editions.'],
  ] },
  { id: 'projects', title: 'One project for every window', items: [
    ['Save the whole observation', 'One .efaproj file holds radio analysis, Solar Image Analysis and GCS CME fitting; open and save it from any of those windows.'],
    ['Link or embed image data', 'Choose small linked projects or portable projects with embedded solar and GCS frames.'],
    ['Bring older work forward', 'Open v3.1 radio projects and import .ecsolar sessions. Keep an original copy: projects saved in v3.2.0 do not open in v3.1.'],
  ] },
  { id: 'geomagnetic', title: 'Geomagnetic response', items: [
    ['Follow the event to Earth', 'View Dst, SYM-H, Kp, IMF, plasma and auroral indices together, with shock arrivals and storm markers.'],
    ['Solar-wind context', 'Use OMNI data shifted to the bow shock, with explicitly labelled L1 fallback measurements for recent observations.'],
    ['Summary and exports', 'See storm statistics in the sidebar and export figures or CSV measurements with source provenance.'],
  ] },
  { id: 'context', title: 'Event context on the spectrum', items: [
    ['Catalog lanes', 'Align GOES flares, LASCO CMEs, DONKI events and CALLISTO bursts with your spectrum; hover markers for details.'],
    ['Choose your sources', 'Select which lanes to show and control automatic catalog and geomagnetic downloads.'],
    ['Context that travels', 'Save fetched events in projects and include markers in exported figures and reports.'],
  ] },
  { id: 'composer', title: 'Event Figure Composer', items: [
    ['One figure for the event', 'Combine image thumbnails, spectra, SWAVES, GOES, catalog lanes and a geomagnetic block.'],
    ['Control the layout', 'Reorder panels, adjust heights and select a journal column width, with a live preview.'],
    ['Fetch missing data', 'Download the observations needed for your chosen panels and save the composition in your project.'],
  ] },
  { id: 'reports', title: 'Reports with an Event Story', items: [
    ['Connect the milestones', 'An event chain, timeline, key measurements and overview figures relate the flare, radio burst, CME, shock and storm.'],
    ['Keep the scientific context', 'Reports name their sources and caveats, including mismatched event timing.'],
    ['Beyond the radio spectrum', 'Solar Image Analysis and GCS sections are included; projects without radio data can generate reports too.'],
  ] },
  { id: 'archives', title: 'More solar download products', tone: 'solar', items: [
    ['Choose a product', 'Full-resolution FITS, reduced-size SDO FITS or Helioviewer JP2 quicklooks for AIA, HMI, EIT, LASCO and STEREO.'],
    ['Know what you downloaded', 'JP2 quicklooks are display images rather than calibrated measurements; photometry and related analysis are disabled for them.'],
    ['Real transfer progress', 'See bytes, speed, time remaining and per-file details, with cancellation of JSOC export waits.'],
  ] },
  { id: 'imaging', title: 'Solar composites and movies', tone: 'solar', items: [
    ['AIA inside LASCO’s occulter', 'Fill the occulted centre of C2 or C3 frames with a matching AIA 193 Å Sun at true scale.'],
    ['Live composite controls', 'Adjust colormap, contrast, filtering and image differences while viewing the composite.'],
    ['North-up movies', 'Export movies with optional instrument, UTC time and difference-mode labels.'],
  ] },
  { id: 'reset', title: 'A clean start when you need it', items: [
    ['Reset All', 'Return to the application’s startup state, with Save, Discard or Cancel when work is unsaved.'],
    ['One release, two editions', 'Full and Lite installers for Windows, Linux and macOS are published together under v3.2.0; each edition’s update checker selects its own installer.'],
  ] },
];
