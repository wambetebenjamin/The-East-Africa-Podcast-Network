import { NextResponse } from 'next/server';
import { getEpisode, getShow } from '@/lib/data';

export const revalidate = 300;

/** GET /api/episodes/[slug] — single episode with full metadata. */
export async function GET(_req: Request, { params }: { params: { slug: string } }) {
  const episode = getEpisode(params.slug);
  if (!episode) {
    return NextResponse.json({ ok: false, error: 'Episode not found' }, { status: 404 });
  }
  const show = getShow(episode.showSlug);
  return NextResponse.json({
    ok: true,
    episode,
    show: show
      ? {
          slug: show.slug,
          title: show.title,
          category: show.category,
          host: show.host.name,
          spotifyUrl: show.spotifyUrl,
          appleUrl: show.appleUrl,
        }
      : null,
    jsonLd: {
      '@context': 'https://schema.org',
      '@type': 'PodcastEpisode',
      name: episode.title,
      episodeNumber: episode.number,
      datePublished: episode.publishedAt,
      description: episode.description,
    },
  });
}
