# e-CALLISTO FITS Analyzer website

A responsive software website for researchers and students, with light/dark themes, verified Windows/Linux/macOS downloads, documentation, tutorials, scientific background, citation tools, and a persistent forum.

## Run locally

Requires Node.js 22.13 or newer.

```sh
npm ci
npm run dev
```

The portable preview is served at http://127.0.0.1:5173. On Windows, if the npm launcher fails, run `node scripts/run-framework.mjs dev` directly after dependency installation. Build with `node scripts/run-framework.mjs build`.

## Forum database

The database schema is in `db/schema.ts`. Queries are prepared server-side; generated migrations live in `drizzle/`. The logical D1 binding is `DB` in `.openai/hosting.json`. Production migrations are applied by Sites publication.

For a fresh local database, build first and apply the migration once:

```sh
node --import ./scripts/sites-env.mjs ./node_modules/wrangler/bin/wrangler.js d1 execute DB --local --config dist/server/wrangler.json --persist-to .wrangler/state --file drizzle/0000_regular_vulture.sql
```

Sign-in is provided by ChatGPT on hosted Sites. The portable development server uses a loopback-only test identity; it strips forged authentication headers and does not ship its mock sign-in in production. The production Worker must run behind the Sites identity dispatcher; do not expose that Worker directly while trusting incoming identity headers.

Visitors choose a public display name. Profiles, discussions, replies, and posting limits live in D1. Account emails and identity IDs are not returned in public discussion responses. Authors may remove their own posts. Deleting a discussion cascades to its replies. Posts are plain text, validated server-side, and protected by origin and identity checks. Accounts use ChatGPT rather than a separate email/password system.

## Content and releases

- `releases-verified.json`: public GitHub release metadata checked 2 October 2026. Downloads are direct links to the real release assets; installers are not copied into this website.
- Windows and Linux v3.0.0: x64/amd64. macOS v3.0.0: Apple silicon arm64. Windows v3.1.0 beta is labeled separately.
- `public/logo.png` and `public/screenshots/`: assets copied from the software project.
- `public/showcase/`: optimized copies of the supplied radio, solar imaging, and GCS screenshots and example movies. The 4096px AIA movie is served at 1080px (4.7 MB); the GCS movie is 1.4 MB. Original media in the parent `assets/` folder is preserved. Videos load on demand and include download links.
- The homepage distinguishes the two main tools and nests image analysis and GCS fitting within Solar Image Analyzer. `/tools/solar-imaging` and `/tools/gcs-fitting` provide dedicated workflow guides. PFSS and GCS examples are labeled for v3.1.0 beta.
- `public/docs/`: full guide, architecture notes, and release notes copied from the software project. The website guide summarizes v3.1.0 beta documentation and distinguishes beta functions.
- `lib/tutorials.ts`: three original written walkthroughs based on that documentation.
- `lib/citation.ts`: recommended paper citation and BibTeX from the project documentation.

Release metadata is a verified snapshot. Update it when publishing new installers. No automated refresh is configured.

## Checks

```sh
node node_modules/typescript/bin/tsc --noEmit
node scripts/verify-community.mjs
node scripts/run-framework.mjs build
```

The forum integration check targets the loopback development server only, creates a temporary discussion and reply, tests validation and rate limiting, then removes its discussion. It uses the local test identity and leaves that identity's display name as `Local test researcher`.

Browser checks cover desktop and 390px mobile layouts, light/dark theme persistence, mobile navigation, BibTeX copying, sign-in, profile creation, discussion creation, and the read-only WebMCP tool (including invalid input). API checks cover authentication, spoofed-header rejection, cross-origin rejection, profile and category validation, persisted replies, rate limiting, public identity privacy, and owner-only removal.

## Hosting

The Site identity is saved in `.openai/hosting.json`; preserve it when republishing. Sites provides the Cloudflare Worker, database, and ChatGPT sign-in. New Sites start private. Public availability and a custom domain are separate hosting settings. Do not commit credentials or local `.wrangler` state.

The software project in the adjacent folder is read-only source material for this website and has not been modified.
