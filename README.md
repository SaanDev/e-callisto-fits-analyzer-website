# e-CALLISTO FITS Analyzer website

The website for [e-CALLISTO FITS Analyzer](https://github.com/SaanDev/e-Callisto_FITS_Analyzer): downloads for Windows, Linux and macOS, the complete illustrated user guide (web edition and PDF), tutorials, scientific background, citation and community links. Light and dark themes, built as a static site for GitHub Pages.

## Stack

- [Next.js](https://nextjs.org) 16 (App Router) with `output: "export"`: every page is pre-rendered to plain HTML in `out/`. There is no server.
- Hand-written CSS in `app/globals.css` (design tokens for both themes, motion, layout). Tailwind is used only for its CSS reset.
- Fonts (Inter, JetBrains Mono) are self-hosted through `next/font`.

## Run locally

Requires Node.js 20.9 or newer.

```sh
npm ci
npm run dev          # http://localhost:3000
```

```sh
npm run build        # writes the static site to out/
npm start            # serves out/ at http://localhost:3000
```

Run `npm run typecheck` and `npm run lint` before publishing.

## Deploy to GitHub Pages

`.github/workflows/deploy.yml` builds and publishes the site on every push to `main`.

1. Push this folder to a GitHub repository, for example `SaanDev/e-callisto-website`.
2. In the repository, open **Settings → Pages** and set **Source** to **GitHub Actions**.
3. Push to `main` (or run the workflow manually from the **Actions** tab).

The site is served from `https://saandev.github.io/<repository>/`. The workflow passes that path to the build in `NEXT_PUBLIC_BASE_PATH`, so links and assets work under it. With a custom domain (**Settings → Pages → Custom domain**) the path is empty and nothing needs to change.

Inside the code, links between pages use `next/link`, which adds the base path automatically. Files from `public/` (images, video, the PDF) are referenced through `asset()` from `lib/site.ts`.

## Search engines

Each page declares a canonical URL, its own title, description and link preview (`pageMetadata()` in `lib/seo.ts`), and schema.org structured data: the software, the user guide, each guide chapter, the software paper and breadcrumbs. `sitemap.xml` lists every page.

The site is served from the custom domain `https://ecallistoanalyzer.org/`; the old `saandev.github.io` address redirects there. To get it indexed:

1. In [Google Search Console](https://search.google.com/search-console), use the **Domain** property for `ecallistoanalyzer.org`, verified by the `google-site-verification` TXT record at the domain's DNS provider. (Alternatively, a **URL prefix** property can be verified with the **HTML tag** method: paste the `content` value into `searchVerification.google` in `lib/site.ts` and push.)
2. Submit `https://ecallistoanalyzer.org/sitemap.xml` under **Sitemaps**, then use **URL Inspection → Request indexing** for the home, download and user guide pages.
3. In [Bing Webmaster Tools](https://www.bing.com/webmasters), import the site from Search Console, or verify with `searchVerification.bing`. Bing's index also serves DuckDuckGo, Yahoo and Ecosia.

`robots.txt` at the domain root allows all crawlers and points to the sitemap.

Search engines ignore the `keywords` meta tag. What they read is each page's `<title>`, its `<h1>` (in `PageIntro` the small label above the title is part of the h1, so make it descriptive) and the body text. Links from other sites (the software repository, e-callisto.org, publications) matter most for a new domain.

## Analytics

Visits are counted with [Cloudflare Web Analytics](https://dash.cloudflare.com/?to=/:account/web-analytics), which sets no cookies and needs no consent banner. Page views, visitors, referrers and countries are under **Analytics & Logs → Web Analytics → ecallistoanalyzer.org**. The site is set to **JS Snippet installation** (the domain's DNS records are not proxied, so automatic setup would record nothing), and the root layout loads the beacon with the token in `cloudflareAnalyticsToken` in `lib/site.ts`. Production builds only; set the token to `''` to turn it off.

[Google Analytics 4](https://analytics.google.com) adds engagement, outbound link and download clicks, and Search Console queries (link them under **Admin → Product links → Search Console links**). It sets cookies, so it runs only after a visitor accepts the banner from `components/analytics-consent.tsx`. Until then no request is made to Google. The answer is kept in `localStorage`, and **Cookie settings** in the footer asks again. Declining after accepting turns tracking off and deletes the `_ga` cookies. The measurement ID is `googleAnalyticsId` in `lib/site.ts`. Production builds only; set it to `''` to remove the banner and Google Analytics. Set **Admin → Data collection and modification → Data retention** to 14 months, which `/privacy/` states, and update that page whenever what is collected changes.

## Community

The Community page links to [GitHub Discussions](https://github.com/SaanDev/e-Callisto_FITS_Analyzer/discussions) on the software repository. Enable it once under the software repository's **Settings → General → Features → Discussions**. The page links to the default `Q&A`, `Ideas` and `Show and tell` categories.

## Sponsors

The Sponsor page (`/sponsor/`) links to [GitHub Sponsors](https://github.com/sponsors/SaanDev) and lists the maintainer's public sponsors. `scripts/fetch-sponsors.py` writes them to `content/sponsors.json` before each build, and the deploy workflow also runs once a day so new sponsors appear without a push. Private sponsors and amounts are never fetched. The committed `content/sponsors.json` is an empty list, which the page shows as "Be the first to sponsor".

To turn the list on, create a [personal access token (classic)](https://github.com/settings/tokens/new) with the `read:user` and `read:org` scopes, then add it to this repository under **Settings → Secrets and variables → Actions** as a secret named `SPONSORS_TOKEN`. When the token expires, the daily run fails with a message saying so (the site stays online with the last list) and pushes still deploy, without the list, until the secret is renewed.

GitHub pauses scheduled workflows in a public repository after 60 days without activity. Re-enable it from the **Actions** tab if that happens.

## Content

| What | Where |
|---|---|
| Release downloads, sizes and SHA-256 checksums | `releases-verified.json` |
| v3.2.0 highlights, v3.1.0 highlights, v3.1.2 and v3.1.1 fixes and notes | `lib/release-notes.ts`, full notes in `public/docs/release-notes/` |
| Site constants (version, full/Lite tags, links, PDF name) | `lib/site.ts` |
| Tutorials | `lib/tutorials.ts` |
| ecallistolib library overview, installation and Python examples | `app/ecallistolib/page.tsx` (based on the library’s v1.5.0 README and package metadata) |
| Citation and BibTeX | `lib/citation.ts` |
| Public sponsors (generated at deploy time) | `content/sponsors.json` |
| User guide PDF | `public/docs/e-CALLISTO_FITS_Analyzer_User_Guide_v3.2.0.pdf` |
| User guide LaTeX source | `content/guide-source/` |
| Web edition of the guide | `content/handbook.json` (generated) |
| Guide figures (WebP) | `public/guide/figures/` (generated) |
| Screenshots and example movies | `public/showcase/`, `public/screenshots/` |

The showcase movies use VP9 WebM and play inline, muted and looping, without native player controls. `components/example-movie.tsx` pauses them outside the viewport or in hidden tabs, respects reduced-motion preferences, and provides a small play/pause button. To convert a replacement export while preserving its dimensions and frame rate:

```sh
ffmpeg -i example.mp4 -an -c:v libvpx-vp9 -crf 32 -b:v 0 -deadline good -cpu-used 2 -pix_fmt yuv420p public/showcase/example.webm
```

The download links for both editions point to the shared GitHub release tag `v3.2.0`. `currentReleases` and `currentLiteReleases` in `lib/site.ts` identify that tag for Windows, Linux and macOS. `releases-verified.json` contains all six installers in one record, with their exact names, download URLs, byte sizes and SHA-256 digests from the GitHub release assets API (checked 2026-10-29). Both macOS editions support macOS 13 Ventura or later on Apple silicon; the rebuilt Mac installers have updated sizes and SHA-256 digests. The illustrated user guide is the v3.2.0 second edition: 196 pages, 22 chapters and 71 figures (`guidePdf` in `lib/site.ts`). Its web edition includes the Event Context and Geomagnetic Response chapter and the updated macOS 13 minimum requirement. The published PDF is preserved as supplied. The earlier v3.1.0 PDF is retained for existing download links.

### v3.2.0 and Analyzer Lite

The home and download pages present the published v3.2.0 release and the Rust-based Analyzer Lite edition. `components/edition-comparison.tsx` compares the CALLISTO workflow with the full edition's solar imaging, CME and space-weather tools. `releaseHighlights` in `lib/release-notes.ts` supplies the highlights; `public/docs/release-notes/RELEASE_NOTES_v3.2.0.md` contains the published release notes.

`lib/downloads.ts` selects installers by operating system, architecture and edition, regardless of asset order. It supports legacy per-platform tags and shared tags, excludes prereleases, and shows an unavailable state if a matching installer is missing. Lite's installer names contain `-lite`; the full installers do not.

The download page explains the project compatibility change: v3.1 radio projects open in v3.2.0, but projects saved in v3.2.0 cannot open in v3.1. The two v3.2.0 editions exchange projects and install side by side.

### Updating the user guide

The web edition is generated from the LaTeX source with [Pandoc](https://pandoc.org) 3.x. Pillow (`pip install pillow`) is needed only when converting figures.

1. Copy the updated `.tex`/`.bib`/`.sty` files into `content/guide-source/` (same layout as the LaTeX project), removing any superseded chapter files after renumbering. The converter reads the software version from `ecallisto-handbook.sty`.
2. Rebuild the web edition. `--figures` converts the book's PNG screenshots to WebP; leave it out if the figures have not changed.

   ```sh
   python scripts/build-handbook.py --pandoc /path/to/pandoc --figures /path/to/LaTeX_source/figures
   python scripts/verify-handbook.py
   ```

3. Replace the PDF in `public/docs/` and update `PDF_SHA256` in `scripts/verify-handbook.py` and `guidePdf` in `lib/site.ts` if the file name, edition, page count, chapter/figure totals or size changed. Render the PDF cover to `public/guide/cover.webp` (637 × 900) and refresh the expected chapter/reference page count in `verify-handbook.py`.

`verify-handbook.py` checks every chapter, cross-reference, anchor and figure, and that the PDF matches the published original. The deploy workflow runs it before building.

The supplied v3.2.0 PDF and source contain one screenshot placeholder: the Geomagnetic Response sidebar card (`event-context/geomagnetic_card.png`). The web edition preserves that figure's caption and displays a text note. This is the only allowed missing screenshot in the converter and verifier; when the screenshot becomes available, convert it and remove the placeholder exceptions from both scripts.

### Publishing a new release

For shared tags such as `v3.2.0`, retrieve the published release from `https://api.github.com/repos/SaanDev/e-Callisto_FITS_Analyzer/releases/tags/<tag>`. Confirm it is neither a draft nor a prerelease, then record the six published installers in one `releases-verified.json` entry using their exact asset metadata. Keep earlier records for the release history.

Update `version`, `liteVersion` and both platform tag maps in `lib/site.ts`, the package version, the highlights and the downloadable release notes. Keep the user guide version independent until a new guide is published. Run `npm run typecheck`, `npm run lint`, `python3 scripts/verify-handbook.py` and `npm run build`.

`scripts/prepare-release.py` is the legacy local-installer helper for per-platform tags. Do not use it unchanged for a shared six-installer release.

## License

MIT. See `public/LICENSE.txt`.
