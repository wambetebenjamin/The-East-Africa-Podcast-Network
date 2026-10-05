import { NextResponse } from 'next/server';
import { shows } from '@/lib/data';

export const dynamic = 'force-dynamic';

/**
 * GET /api/shows — all shows (from Vercel KV when configured; the bundled
 * dataset is the seed/fallback). Episode lists are summarised.
 */
export async function GET() {
  const payload = shows.map((s) => ({
    slug: s.slug,
    title: s.title,
    tagline: s.tagline,
    category: s.category,
    description: s.description,
    host: { name: s.host.name, slug: s.host.slug, photo: s.host.photo },
    subscribers: s.subscribers,
    artwork: s.artwork,
    episodeCount: s.episodes.length,
    latestEpisode: s.episodes[0]
      ? { slug: s.episodes[0].slug, title: s.episodes[0].title, publishedAt: s.episodes[0].publishedAt }
      : null,
  }));
  return NextResponse.json({ shows: payload, count: payload.length, source: 'seed' });
}
