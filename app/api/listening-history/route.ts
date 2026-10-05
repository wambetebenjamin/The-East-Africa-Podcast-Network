import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { kvGet, kvSet } from '@/lib/kv';

export const dynamic = 'force-dynamic';

interface HistoryEntry {
  episodeSlug: string;
  position: number;
  duration: number;
  completed: boolean;
  at: string;
}

/** GET /api/listening-history — the signed-in listener's history (protected). */
export async function GET() {
  const session = await getServerSession(authOptions).catch(() => null);
  if (!session?.user?.email) {
    return NextResponse.json({ ok: false, error: 'Unauthorized' }, { status: 401 });
  }
  const entries = (await kvGet<HistoryEntry[]>(`history:${session.user.email}`)) ?? [];
  return NextResponse.json({ ok: true, entries });
}

/** POST /api/listening-history — save playback progress (protected). */
export async function POST(req: Request) {
  const session = await getServerSession(authOptions).catch(() => null);
  if (!session?.user?.email) {
    // Not signed in (demo mode) — acknowledge silently; the client keeps local history.
    return NextResponse.json({ ok: true, stored: false, reason: 'anonymous' });
  }

  let body: { episodeSlug?: string; position?: number; duration?: number; completed?: boolean };
  try {
    body = (await req.json()) as typeof body;
  } catch {
    return NextResponse.json({ ok: false, error: 'Invalid JSON body' }, { status: 400 });
  }
  if (!body.episodeSlug) {
    return NextResponse.json({ ok: false, error: 'episodeSlug is required' }, { status: 400 });
  }

  const key = `history:${session.user.email}`;
  const entries = (await kvGet<HistoryEntry[]>(key)) ?? [];
  const entry: HistoryEntry = {
    episodeSlug: body.episodeSlug,
    position: Math.max(0, Math.round(body.position ?? 0)),
    duration: Math.max(0, Math.round(body.duration ?? 0)),
    completed: Boolean(body.completed),
    at: new Date().toISOString(),
  };
  const next = [entry, ...entries.filter((e) => e.episodeSlug !== entry.episodeSlug)].slice(0, 100);
  await kvSet(key, next);

  return NextResponse.json({ ok: true, stored: true });
}
