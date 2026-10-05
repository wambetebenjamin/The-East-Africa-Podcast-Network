import { NextResponse } from 'next/server';
import { getShow } from '@/lib/data';

export const dynamic = 'force-dynamic';

/** GET /api/shows/[slug] — single show with its episode list. */
export async function GET(_req: Request, { params }: { params: { slug: string } }) {
  const show = getShow(params.slug);
  if (!show) {
    return NextResponse.json({ ok: false, error: 'Show not found' }, { status: 404 });
  }
  return NextResponse.json({ ok: true, show });
}
