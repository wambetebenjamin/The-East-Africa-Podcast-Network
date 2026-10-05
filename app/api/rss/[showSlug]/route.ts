import { NextResponse } from 'next/server';
import { getShow } from '@/lib/data';
import { importFeed, RSS_CACHE_TTL, type ImportedEpisode } from '@/lib/rss';

export const revalidate = 900; // RSS cache refreshed every 15 minutes via ISR

/**
 * GET /api/rss/[showSlug] — fetches and caches the external RSS feed for a
 * show (rss-parser), falling back to the network's own episodes when the show
 * has no external feed configured or the fetch fails.
 */
export async function GET(_req: Request, { params }: { params: { showSlug: string } }) {
  const show = getShow(params.showSlug);
  if (!show) {
    return NextResponse.json({ ok: false, error: 'Show not found' }, { status: 404 });
  }

  let items: ImportedEpisode[] = [];
  let source: 'external' | 'network' | 'error' = 'network';

  if (show.rssUrl) {
    try {
      items = await importFeed(show.rssUrl);
      source = 'external';
    } catch {
      // Fetch/parse failure → serve the network's own catalogue
      items = show.episodes.map((e) => ({
        title: e.title,
        publishedAt: e.publishedAt,
        duration: e.duration,
        audio: e.audio,
        link: `/episodes/${e.slug}`,
        summary: e.description,
      }));
      source = 'error';
    }
  } else {
    items = show.episodes.map((e) => ({
      title: e.title,
      publishedAt: e.publishedAt,
      duration: e.duration,
      audio: e.audio,
      link: `/episodes/${e.slug}`,
      summary: e.description,
    }));
  }

  return NextResponse.json(
    {
      ok: true,
      show: { slug: show.slug, title: show.title },
      source,
      cacheTtlSeconds: RSS_CACHE_TTL / 1000,
      count: items.length,
      items,
    },
    { headers: { 'Cache-Control': 'public, s-maxage=900, stale-while-revalidate=60' } }
  );
}
