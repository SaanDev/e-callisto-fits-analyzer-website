import type { MetadataRoute } from 'next';
import handbook from '@/content/handbook.json';
import { tutorials } from '@/lib/tutorials';
import { basePath, siteUrl } from '@/lib/site';

export const dynamic = 'force-static';

export default function sitemap(): MetadataRoute.Sitemap {
  const pages = ['', 'download/', 'guide/', 'guide/pdf/', 'docs/', 'tutorials/', 'science/', 'tools/solar-imaging/', 'tools/gcs-fitting/', 'community/', 'citation/', 'sponsor/', 'privacy/',
    ...handbook.map(c => `guide/${c.slug}/`), ...tutorials.map(t => `tutorials/${t.slug}/`)];
  return pages.map(path => ({ url: `${siteUrl}${basePath}/${path}`, changeFrequency: 'monthly', priority: path === '' ? 1 : path.split('/').length > 2 ? 0.5 : 0.8 }));
}
