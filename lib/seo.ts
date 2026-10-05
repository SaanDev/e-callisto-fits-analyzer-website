// Page metadata (canonical URL, link previews) and schema.org structured data.
import type { Metadata } from 'next';
import { basePath, siteUrl, version, links, guidePdf } from '@/lib/site';
import { citation } from '@/lib/citation';

export const siteName = 'e-CALLISTO FITS Analyzer';
export const defaultDescription = 'Free, open-source analysis of e-CALLISTO solar radio spectra and solar images, with CME tracking, PFSS and GCS fitting, for Windows, Linux and macOS. Download v3.1.0, read the complete user guide and join the community.';

/** Absolute URL of a site path such as "/download/". */
export function absoluteUrl(path: string): string {
  return siteUrl + basePath + path;
}

/** Metadata for one page. `path` is the page's own address, e.g. "/download/";
 *  it becomes the canonical URL and the link-preview URL. */
export function pageMetadata({ title, description, path, absoluteTitle = false }: {
  title: string;
  description: string;
  path: string;
  absoluteTitle?: boolean;
}): Metadata {
  const fullTitle = absoluteTitle ? title : `${title} · ${siteName}`;
  // Absolute URLs: Next resolves relative ones against the current route, not the site root.
  const url = absoluteUrl(path);
  const image = { url: absoluteUrl('/og-image.jpg'), width: 1200, height: 630, alt: 'e-CALLISTO FITS Analyzer showing a solar radio burst spectrum' };
  return {
    title: absoluteTitle ? { absolute: title } : title,
    description,
    alternates: { canonical: url },
    openGraph: { type: 'website', siteName, locale: 'en_US', title: fullTitle, description, url, images: [image] },
    twitter: { card: 'summary_large_image', title: fullTitle, description, images: [image] },
  };
}

// ---------------------------------------------------------------- JSON-LD

type Thing = Record<string, unknown>;

const author: Thing = {
  '@type': 'Person',
  name: 'Sahan S Liyanage',
  affiliation: { '@type': 'Organization', name: 'Astronomical and Space Science Unit, University of Colombo', address: { '@type': 'PostalAddress', addressCountry: 'LK' } },
};

export const softwarePaper: Thing = {
  '@type': 'ScholarlyArticle',
  '@id': links.paper,
  headline: 'e-CALLISTO FITS analyzer: a software framework for CALLISTO solar radio data',
  author: ['G. L. S. S. Liyanage', 'J. Adassuriya', 'K. P. S. C. Jayaratne', 'C. Monstein', 'P. K. Manoharan'].map(name => ({ '@type': 'Person', name })),
  datePublished: '2026',
  isPartOf: { '@type': 'PublicationVolume', volumeNumber: '5', isPartOf: { '@type': 'Periodical', name: 'RAS Techniques and Instruments' } },
  identifier: { '@type': 'PropertyValue', propertyID: 'DOI', value: '10.1093/rasti/rzag056' },
  url: links.paper,
  description: citation,
};

export function websiteData(): Thing {
  return { '@context': 'https://schema.org', '@type': 'WebSite', name: siteName, url: absoluteUrl('/'), inLanguage: 'en' };
}

export function softwareData(): Thing {
  return {
    '@context': 'https://schema.org',
    '@type': 'SoftwareApplication',
    name: siteName,
    description: defaultDescription,
    url: absoluteUrl('/'),
    image: absoluteUrl('/og-image.jpg'),
    screenshot: [absoluteUrl('/showcase/radio.webp'), absoluteUrl('/showcase/solar.webp'), absoluteUrl('/showcase/gcs.webp')],
    applicationCategory: 'EducationalApplication',
    applicationSubCategory: 'Solar radio astronomy and solar physics',
    operatingSystem: 'Windows 10, Windows 11, macOS 13 or later (Apple silicon), Debian, Ubuntu',
    softwareVersion: version,
    downloadUrl: absoluteUrl('/download/'),
    releaseNotes: absoluteUrl('/download/#whats-new'),
    softwareHelp: { '@type': 'CreativeWork', name: 'e-CALLISTO FITS Analyzer User Guide', url: absoluteUrl('/guide/') },
    license: 'https://opensource.org/licenses/MIT',
    isAccessibleForFree: true,
    offers: { '@type': 'Offer', price: '0', priceCurrency: 'USD' },
    author,
    sameAs: [links.repo],
    citation: softwarePaper,
  };
}

export function userGuideData(): Thing {
  return {
    '@context': 'https://schema.org',
    '@type': 'Book',
    name: 'e-CALLISTO FITS Analyzer User Guide',
    bookEdition: `Version ${version}, first edition`,
    numberOfPages: guidePdf.pages,
    inLanguage: 'en',
    author,
    url: absoluteUrl('/guide/'),
    image: absoluteUrl('/guide/cover.webp'),
    datePublished: '2026-10',
    about: { '@type': 'SoftwareApplication', name: siteName },
    encoding: { '@type': 'MediaObject', encodingFormat: 'application/pdf', contentUrl: absoluteUrl(guidePdf.href) },
  };
}

export function chapterData({ title, description, path, image }: { title: string; description: string; path: string; image?: string }): Thing {
  return {
    '@context': 'https://schema.org',
    '@type': 'TechArticle',
    headline: title,
    description,
    url: absoluteUrl(path),
    ...(image ? { image: absoluteUrl(image) } : {}),
    inLanguage: 'en',
    author,
    isPartOf: { '@type': 'Book', name: 'e-CALLISTO FITS Analyzer User Guide', bookEdition: `Version ${version}`, url: absoluteUrl('/guide/') },
    about: { '@type': 'SoftwareApplication', name: siteName },
  };
}

/** Breadcrumb trail from the home page; the last crumb (the current page) may omit its path. */
export function breadcrumbData(crumbs: [name: string, path?: string][]): Thing {
  const items: [string, string?][] = [['Home', '/'], ...crumbs];
  return {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: items.map(([name, path], i) => ({ '@type': 'ListItem', position: i + 1, name, ...(path ? { item: absoluteUrl(path) } : {}) })),
  };
}
