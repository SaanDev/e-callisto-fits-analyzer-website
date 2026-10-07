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
| v3.1.0 highlights and notes | `lib/release-notes.ts`, full notes in `public/docs/release-notes/` |
| Site constants (version, links, PDF name) | `lib/site.ts` |
| Tutorials | `lib/tutorials.ts` |
| Citation and BibTeX | `lib/citation.ts` |
| Public sponsors (generated at deploy time) | `content/sponsors.json` |
| User guide PDF | `public/docs/e-CALLISTO_FITS_Analyzer_User_Guide_v3.1.0.pdf` |
| User guide LaTeX source | `content/guide-source/` |
| Web edition of the guide | `content/handbook.json` (generated) |
| Guide figures (WebP) | `public/guide/figures/` (generated) |
| Screenshots and example movies | `public/showcase/`, `public/screenshots/` |

The download links point to the GitHub release tags `v3.1.0(Windows)`, `v3.1.0(MacOS)` and `v3.1.0(Linux)`. They work once those releases are published.

### Updating the user guide

The web edition is generated from the LaTeX source with [Pandoc](https://pandoc.org) 3.x. Pillow (`pip install pillow`) is needed only when converting figures.

1. Copy the updated `.tex`/`.bib` files into `content/guide-source/` (same layout as the LaTeX project).
2. Rebuild the web edition. `--figures` converts the book's PNG screenshots to WebP; leave it out if the figures have not changed.

   ```sh
   python scripts/build-handbook.py --pandoc /path/to/pandoc --figures /path/to/LaTeX_source/figures
   python scripts/verify-handbook.py
   ```

3. Replace the PDF in `public/docs/` and update `PDF_SHA256` in `scripts/verify-handbook.py` and `guidePdf` in `lib/site.ts` if the file name, page count or size changed.

`verify-handbook.py` checks every chapter, cross-reference, anchor and figure, and that the PDF matches the published original. The deploy workflow runs it before building.

### Publishing a new release

```sh
python scripts/prepare-release.py "<folder with the installers and PDF>" <new version> <previous version>
```

This records the installer sizes and checksums in `releases-verified.json` and copies the guide PDF. Then update `version` in `lib/site.ts`, the platform tags in `components/download-cards.tsx`, and the highlights in `lib/release-notes.ts`.

## License

MIT. See `public/LICENSE.txt`.
