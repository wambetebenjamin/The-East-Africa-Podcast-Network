import { NextResponse } from 'next/server';
import { getShow } from '@/lib/data';
import { kvGet, kvSet } from '@/lib/kv';

export const dynamic = 'force-dynamic';

/**
 * GET  /api/subscribe/[showSlug] — current subscriber count.
 * POST /api/subscribe/[showSlug] — subscribe (saved to Vercel KV; falls back
 * to in-process counters in demo mode).
 */
export async function GET(_req: Request, { params }: { params: { showSlug: string } }) {
  const show = getShow(params.showSlug);
  if (!show) return NextResponse.json({ ok: false, error: 'Show not found' }, { status: 404 });
  const stored = await kvGet<number>(`subs:${show.slug}`);
  return NextResponse.json({ ok: true, subscribers: stored ?? show.subscribers });
}

export async function POST(_req: Request, { params }: { params: { showSlug: string } }) {
  const show = getShow(params.showSlug);
  if (!show) return NextResponse.json({ ok: false, error: 'Show not found' }, { status: 404 });

  const current = (await kvGet<number>(`subs:${show.slug}`)) ?? show.subscribers;
  const next = current + 1;
  await kvSet(`subs:${show.slug}`, next);

  return NextResponse.json({ ok: true, subscribers: next });
}
