import { NextResponse } from 'next/server';
import { verifyCaptcha } from '@/lib/captcha';

export const dynamic = 'force-dynamic';

/**
 * POST /api/captcha — standalone reCAPTCHA token verification.
 * Body: { token: string }
 * Returns ok + score, or { ok:false, fallback:'v2' } when score < 0.5.
 */
export async function POST(req: Request) {
  let token: string | undefined;
  try {
    const body = (await req.json()) as { token?: string };
    token = body.token;
  } catch {
    return NextResponse.json({ ok: false, error: 'Invalid JSON body' }, { status: 400 });
  }
  const ip =
    req.headers.get('x-forwarded-for')?.split(',')[0]?.trim() ??
    req.headers.get('x-real-ip') ??
    undefined;

  const result = await verifyCaptcha(token, ip);
  if (!result.ok) {
    return NextResponse.json(result, { status: result.fallback ? 200 : 403 });
  }
  return NextResponse.json(result);
}
