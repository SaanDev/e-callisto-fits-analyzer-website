// Site-wide constants and the base-path helper for GitHub Pages.

export const basePath = process.env.NEXT_PUBLIC_BASE_PATH?.replace(/\/$/, '') ?? '';

// Absolute origin of the deployed site (no trailing slash), used for metadata,
// the sitemap and robots.txt. The deploy workflow sets it from GitHub Pages.
export const siteUrl = (process.env.NEXT_PUBLIC_SITE_URL ?? 'https://saandev.github.io').replace(/\/$/, '');

/** Prefix a root-relative path to a file in public/ with the base path.
 *  Links between pages should use next/link instead, which adds it itself. */
export function asset(path: string): string {
  return path.startsWith('/') ? basePath + path : path;
}

export const version = '3.1.0';
export const releaseDate = 'October 2026';

export const repo = 'https://github.com/SaanDev/e-Callisto_FITS_Analyzer';
export const links = {
  repo,
  releases: repo + '/releases',
  issues: repo + '/issues',
  newIssue: repo + '/issues/new',
  discussions: repo + '/discussions',
  paper: 'https://doi.org/10.1093/rasti/rzag056',
  email: 'sahanslst@gmail.com',
};

export const guidePdf = {
  href: '/docs/e-CALLISTO_FITS_Analyzer_User_Guide_v3.1.0.pdf',
  filename: 'e-CALLISTO_FITS_Analyzer_User_Guide_v3.1.0.pdf',
  pages: 174,
  size: '35.9 MB',
};
