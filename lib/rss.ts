/**
 * RSS feed import for external show feeds.
 * /api/rss/[showSlug] fetches and caches each show's external RSS feed
 * (15-minute cache, refreshed via ISR revalidate = 900).
 */
import Parser from 'rss-parser';

const parser = new Parser({
  timeout: 10_000,
  headers: { 'User-Agent': 'EAPN-RSS-Importer/1.0 (+https://eapn.africa)' },
});

export interface ImportedEpisode {
  title: string;
  publishedAt: string;
  duration: number;
  audio: string;
  link?: string;
  summary?: string;
}

const cache = new Map<string, { at: number; items: ImportedEpisode[] }>();
export const RSS_CACHE_TTL = 15 * 60 * 1000; // 15 minutes

function parseDuration(d?: string): number {
  if (!d) return 0;
  if (/^\d+$/.test(d)) return Number(d); // seconds (iTunes style)
  const parts = d.split(':').map(Number).reverse();
  return (parts[0] || 0) + (parts[1] || 0) * 60 + (parts[2] || 0) * 3600;
}

export async function importFeed(feedUrl: string, force = false): Promise<ImportedEpisode[]> {
  const hit = cache.get(feedUrl);
  if (!force && hit && Date.now() - hit.at < RSS_CACHE_TTL) return hit.items;

  const feed = await parser.parseURL(feedUrl);
  const enclosure = (item: { enclosure?: { url?: string } }) => item.enclosure?.url ?? '';

  const items: ImportedEpisode[] = (feed.items || []).slice(0, 50).map((item) => ({
    title: item.title ?? 'Untitled episode',
    publishedAt: item.isoDate ?? new Date().toISOString(),
    duration: parseDuration((item as { itunes?: { duration?: string } }).itunes?.duration),
    audio: enclosure(item as never),
    link: item.link,
    summary: (item as { itunes?: { summary?: string } }).itunes?.summary ?? item.contentSnippet,
  }));

  cache.set(feedUrl, { at: Date.now(), items });
  return items;
}
