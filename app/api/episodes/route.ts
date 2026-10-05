import { NextResponse } from 'next/server';
import { allEpisodes, shows } from '@/lib/data';

export const dynamic = 'force-dynamic';

/**
 * GET /api/episodes — all episodes, paginated.
 * Query: ?page=1&limit=12&show=<slug>&category=<Category>&q=<search>
 */
export async function GET(req: Request) {
  const url = new URL(req.url);
  const page = Math.max(1, Number(url.searchParams.get('page') ?? '1'));
  const limit = Math.min(100, Math.max(1, Number(url.searchParams.get('limit') ?? '12')));
  const show = url.searchParams.get('show') ?? undefined;
  const category = url.searchParams.get('category') ?? undefined;
  const q = (url.searchParams.get('q') ?? '').toLowerCase();

  const catByShow = new Map(shows.map((s) => [s.slug, s.category]));
  const titleByShow = new Map(shows.map((s) => [s.slug, s.title]));

  const filtered = allEpisodes.filter((e) => {
    if (show && e.showSlug !== show) return false;
    if (category && catByShow.get(e.showSlug) !== category) return false;
    if (q && !(e.title.toLowerCase().includes(q) || (titleByShow.get(e.showSlug) ?? '').toLowerCase().includes(q)))
      return false;
    return true;
  });

  const start = (page - 1) * limit;
  const episodes = filtered.slice(start, start + limit).map((e) => ({
    ...e,
    showTitle: titleByShow.get(e.showSlug),
    showCategory: catByShow.get(e.showSlug),
  }));

  return NextResponse.json({
    episodes,
    page,
    limit,
    total: filtered.length,
    totalPages: Math.ceil(filtered.length / limit),
  });
}
