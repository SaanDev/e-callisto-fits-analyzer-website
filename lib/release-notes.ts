// v3.1.0 highlights, condensed from docs/release_notes/RELEASE_NOTES_v3.1.0_*.md
// in the software repository (the full notes are in public/docs/release-notes).

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
