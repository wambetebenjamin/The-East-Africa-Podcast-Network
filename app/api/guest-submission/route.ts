import { NextResponse } from 'next/server';
import { verifyCaptcha } from '@/lib/captcha';
import { sendMail, emailConfigured } from '@/lib/email';
import { PRODUCER_WA, sendWhatsApp } from '@/lib/whatsapp';
import { kvSet } from '@/lib/kv';

export const dynamic = 'force-dynamic';

const PRODUCER_EMAIL = process.env.PRODUCER_EMAIL || 'producers@eapn.africa';

/**
 * POST /api/guest-submission — guest form.
 * reCAPTCHA v3 verified server-side; sends an email (Nodemailer) and a
 * WhatsApp notification to the producers; archives to Vercel KV.
 */
export async function POST(req: Request) {
  let body: Record<string, string>;
  try {
    body = (await req.json()) as Record<string, string>;
  } catch {
    return NextResponse.json({ ok: false, error: 'Invalid JSON body' }, { status: 400 });
  }

  const { name, email, phone, link, expertise, bio, show } = body;
  const token = body['g-recaptcha-response'];

  if (!name || !email || !phone || !link || !expertise || !bio) {
    return NextResponse.json({ ok: false, error: 'All fields except target show are required.' }, { status: 400 });
  }

  const ip = req.headers.get('x-forwarded-for')?.split(',')[0]?.trim() ?? undefined;
  const captcha = await verifyCaptcha(token, ip);
  if (!captcha.ok) {
    return NextResponse.json(captcha, { status: captcha.fallback ? 200 : 403 });
  }

  const text = [
    '🎙️ New guest submission — EAPN',
    `Name: ${name}`,
    `Email: ${email}`,
    `Phone: ${phone}`,
    `LinkedIn/website: ${link}`,
    `Expertise: ${expertise}`,
    show ? `Target show: ${show}` : 'Target show: any',
    '',
    `Bio: ${bio}`,
  ].join('\n');

  const [mail, wa] = await Promise.all([
    sendMail({
      to: PRODUCER_EMAIL,
      subject: `Guest submission: ${name} — ${expertise}`,
      text,
      replyTo: email,
    }),
    sendWhatsApp(PRODUCER_WA, text),
  ]);

  await kvSet(`guest:${Date.now()}`, { name, email, phone, link, expertise, bio, show, at: new Date().toISOString() });

  return NextResponse.json({
    ok: true,
    message: 'Submission received — producers have been notified by email and WhatsApp.',
    demo: (mail.demo && !emailConfigured) || (wa.demo && !wa.sent),
  });
}
