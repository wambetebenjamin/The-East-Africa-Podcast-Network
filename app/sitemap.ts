import type { MetadataRoute } from 'next';
import { allEpisodes, shows } from '@/lib/data';
import { postMetas } from '@/lib/blog';
import { site } from '@/lib/site';

/** Dynamic sitemap from show and episode slugs. */
export default function sitemap(): MetadataRoute.Sitemap {
  const now = new Date();

  const staticRoutes: MetadataRoute.Sitemap = [
    { url: site.url, lastModified: now, changeFrequency: 'daily', priority: 1 },
    { url: `${site.url}/shows`, lastModified: now, changeFrequency: 'daily', priority: 0.9 },
    { url: `${site.url}/episodes`, lastModified: now, changeFrequency: 'daily', priority: 0.9 },
    { url: `${site.url}/blog`, lastModified: now, changeFrequency: 'weekly', priority: 0.7 },
    { url: `${site.url}/advertise`, lastModified: now, changeFrequency: 'weekly', priority: 0.8 },
    { url: `${site.url}/about`, lastModified: now, changeFrequency: 'monthly', priority: 0.6 },
    { url: `${site.url}/contact`, lastModified: now, changeFrequency: 'monthly', priority: 0.6 },
    { url: `${site.url}/request`, lastModified: now, changeFrequency: 'monthly', priority: 0.5 },
    { url: `${site.url}/guest`, lastModified: now, changeFrequency: 'monthly', priority: 0.5 },
    { url: `${site.url}/legal/privacy-policy`, lastModified: now, changeFrequency: 'yearly', priority: 0.3 },
    { url: `${site.url}/legal/terms`, lastModified: now, changeFrequency: 'yearly', priority: 0.3 },
    { url: `${site.url}/legal/cookie-policy`, lastModified: now, changeFrequency: 'yearly', priority: 0.3 },
  ];

  const showRoutes: MetadataRoute.Sitemap = shows.map((s) => ({
    url: `${site.url}/shows/${s.slug}`,
    lastModified: now,
    changeFrequency: 'weekly',
    priority: 0.8,
  }));

  const episodeRoutes: MetadataRoute.Sitemap = allEpisodes.map((e) => ({
    url: `${site.url}/episodes/${e.slug}`,
    lastModified: new Date(e.publishedAt),
    changeFrequency: 'weekly',
    priority: 0.7,
  }));

  const blogRoutes: MetadataRoute.Sitemap = postMetas.map((p) => ({
    url: `${site.url}/blog/${p.slug}`,
    lastModified: new Date(p.date),
    changeFrequency: 'monthly',
    priority: 0.6,
  }));

  return [...staticRoutes, ...showRoutes, ...episodeRoutes, ...blogRoutes];
}
