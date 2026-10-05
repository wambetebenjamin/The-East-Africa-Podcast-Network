import { NextResponse } from 'next/server';
import { verifyCaptcha } from '@/lib/captcha';
import { kvSet } from '@/lib/kv';

export const dynamic = 'force-dynamic';

/**
 * POST /api/newsletter — newsletter signup.
 * reCAPTCHA v3 verified; stored in Vercel KV (email → preferences).
 */
export async function POST(req: Request) {
  let body: { email?: string; showPreferences?: string[] };
  try {
    body = (await req.json()) as typeof body;
  } catch {
    return NextResponse.json({ ok: false, error: 'Invalid JSON body' }, { status: 400 });
  }

  const token = (body as Record<string, string | string[] | undefined>)['g-recaptcha-response'] as string | undefined;
  const email = body.email?.trim().toLowerCase();

  if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    return NextResponse.json({ ok: false, error: 'A valid email address is required.' }, { status: 400 });
  }

  const ip = req.headers.get('x-forwarded-for')?.split(',')[0]?.trim() ?? undefined;
  const captcha = await verifyCaptcha(token, ip);
  if (!captcha.ok) {
    return NextResponse.json(captcha, { status: captcha.fallback ? 200 : 403 });
  }

  await kvSet(`newsletter:${email}`, {
    email,
    showPreferences: body.showPreferences ?? [],
    at: new Date().toISOString(),
  });

  return NextResponse.json({
    ok: true,
    message: 'You are in — new episodes will land in your inbox every week.',
  });
}
