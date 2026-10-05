import { NextResponse } from 'next/server';
import { verifyCaptcha } from '@/lib/captcha';
import { PRODUCER_WA, sendWhatsApp } from '@/lib/whatsapp';
import { kvSet } from '@/lib/kv';

export const dynamic = 'force-dynamic';

/**
 * POST /api/request — episode request.
 * reCAPTCHA v3 verified server-side; on success sends a WhatsApp notification
 * to the producers (WhatsApp Cloud API when configured, wa.me fallback) and
 * archives the request in Vercel KV.
 */
export async function POST(req: Request) {
  let body: Record<string, string>;
  try {
    body = (await req.json()) as Record<string, string>;
  } catch {
    return NextResponse.json({ ok: false, error: 'Invalid JSON body' }, { status: 400 });
  }

  const { name, email, show, topic, message } = body;
  const token = body['g-recaptcha-response'];

  if (!name || !email || !topic || !message) {
    return NextResponse.json({ ok: false, error: 'Name, email, topic and message are required.' }, { status: 400 });
  }

  const ip = req.headers.get('x-forwarded-for')?.split(',')[0]?.trim() ?? undefined;
  const captcha = await verifyCaptcha(token, ip);
  if (!captcha.ok) {
    return NextResponse.json(captcha, { status: captcha.fallback ? 200 : 403 });
  }

  const text = [
    '🎧 New episode request — EAPN',
    `From: ${name} <${email}>`,
    show ? `Show preference: ${show}` : 'Show preference: any',
    `Topic / guest: ${topic}`,
    `Message: ${message}`,
  ].join('\n');

  const wa = await sendWhatsApp(PRODUCER_WA, text);

  await kvSet(`request:${Date.now()}`, { name, email, show, topic, message, at: new Date().toISOString() });

  return NextResponse.json({
    ok: true,
    message: 'Request received — the producers have it on WhatsApp.',
    demo: wa.demo && !wa.sent,
  });
}
