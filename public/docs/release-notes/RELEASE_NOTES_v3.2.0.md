# e-CALLISTO FITS Analyzer v3.2.0 — preview

Status checked: 25 October 2026. These notes describe the v3.2.0 source in the analyzer repository. Public v3.2.0 and Lite installers have not yet been published; the website continues to offer the verified v3.1.2 full-edition downloads.

## Introducing Analyzer Lite (3.2.0-lite)

A native Rust edition designed for lightweight, responsive CALLISTO radio analysis, with a familiar interface. It keeps FITS loading and combining, archive downloads, background subtraction, RFI cleaning, light curves, ridge tracking, density-model comparisons, Type II band splitting, batch processing, multi-station comparison, figures and reports.

Lite installs alongside the full analyzer, with its own settings and cache. Both editions exchange `.efaproj` projects. Solar imaging, PFSS, GCS CME fitting, SWAVES, GOES, event context and geomagnetic tools belong to the full edition. Performance depends on the dataset and hardware; these notes make no fixed speedup claim.

## Event context on the spectrum — full edition

Choose catalog sources and display their event markers on the spectrum's time axis. Fetched events and source choices are saved with the project for offline reopening. Markers also travel into figure exports and project reports.

## Event Figure Composer — full edition

Assemble a publication figure from the radio spectrum, SWAVES, GOES, catalog events, geomagnetic response and solar-image thumbnails. Switch panels on or off, reorder them, adjust height ratios and select journal column widths. The preview updates with layout changes, and composition settings are saved in the project.

## Geomagnetic response and solar wind — full edition

View Dst, SYM-H, Kp, IMF, plasma and auroral indices on a shared UTC axis around an event. OMNI provides historical solar-wind context; recent fallback measurements at L1 are explicitly labelled because they are not shifted to Earth's bow shock. Export figures and CSV values with archive or spacecraft provenance.

## Solar archive options — full edition

Solar Image Analysis adds direct access to Helioviewer JPEG2000 quicklooks and JSOC AIA synoptic FITS, including download-byte progress and caching.

## A more complete event project — full edition

Project state includes radio analysis, solar imaging, GCS, geomagnetic response, event context and the figure composer.

## Documentation

The illustrated web guide and PDF remain the v3.1.0 edition. Use these preview notes for the additions above.

Source: https://github.com/SaanDev/e-Callisto_FITS_Analyzer (`lite/README.md`, `lite/PLAN.md`, event-context, event-figure, geomagnetic, direct-archive and project-session modules).
