import { NextResponse } from 'next/server';
import { verifyCaptcha } from '@/lib/captcha';
import { sendMail } from '@/lib/email';
import { site } from '@/lib/site';
import { kvSet } from '@/lib/kv';

export const dynamic = 'force-dynamic';

const TOPIC_EMAILS: Record<string, string> = {
  general: site.email,
  press: site.pressEmail,
  support: site.supportEmail,
};

/** POST /api/contact — general enquiry / press / support (Nodemailer + reCAPTCHA v3). */
export async function POST(req: Request) {
  let body: Record<string, string>;
  try {
    body = (await req.json()) as Record<string, string>;
  } catch {
    return NextResponse.json({ ok: false, error: 'Invalid JSON body' }, { status: 400 });
  }

  const { name, email, phone, topic, message } = body;
  const token = body['g-recaptcha-response'];

  if (!name || !email || !message) {
    return NextResponse.json({ ok: false, error: 'Name, email and message are required.' }, { status: 400 });
  }

  const ip = req.headers.get('x-forwarded-for')?.split(',')[0]?.trim() ?? undefined;
  const captcha = await verifyCaptcha(token, ip);
  if (!captcha.ok) {
    return NextResponse.json(captcha, { status: captcha.fallback ? 200 : 403 });
  }

  const to = TOPIC_EMAILS[topic ?? 'general'] ?? site.email;
  const text = [
    `✉️ New ${topic ?? 'general'} enquiry — EAPN`,
    `From: ${name} <${email}>${phone ? ` · ${phone}` : ''}`,
    '',
    message,
  ].join('\n');

  const mail = await sendMail({ to, subject: `[${topic ?? 'general'}] ${name}`, text, replyTo: email });
  await kvSet(`contact:${Date.now()}`, { name, email, phone, topic, message, at: new Date().toISOString() });

  return NextResponse.json({
    ok: true,
    message: 'Message sent — we reply within two working days.',
    demo: mail.demo,
  });
}
