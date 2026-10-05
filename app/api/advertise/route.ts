import { NextResponse } from 'next/server';
import { verifyCaptcha } from '@/lib/captcha';
import { sendMail } from '@/lib/email';
import { sendWhatsApp } from '@/lib/whatsapp';
import { site } from '@/lib/site';
import { kvSet } from '@/lib/kv';

export const dynamic = 'force-dynamic';

/** POST /api/advertise — sponsorship enquiry handler (reCAPTCHA v3). */
export async function POST(req: Request) {
  let body: Record<string, string>;
  try {
    body = (await req.json()) as Record<string, string>;
  } catch {
    return NextResponse.json({ ok: false, error: 'Invalid JSON body' }, { status: 400 });
  }

  const { company, name, email, phone, package: pkg, budget, message } = body;
  const token = body['g-recaptcha-response'];

  if (!company || !name || !email || !phone || !message) {
    return NextResponse.json({ ok: false, error: 'Company, name, email, phone and campaign goals are required.' }, { status: 400 });
  }

  const ip = req.headers.get('x-forwarded-for')?.split(',')[0]?.trim() ?? undefined;
  const captcha = await verifyCaptcha(token, ip);
  if (!captcha.ok) {
    return NextResponse.json(captcha, { status: captcha.fallback ? 200 : 403 });
  }

  const text = [
    '📊 New sponsorship enquiry — EAPN',
    `Company: ${company}`,
    `Contact: ${name} <${email}> · ${phone}`,
    pkg ? `Package: ${pkg}` : 'Package: undecided',
    budget ? `Monthly budget: KES ${budget}` : 'Budget: not specified',
    '',
    `Goals: ${message}`,
  ].join('\n');

  const [mail, wa] = await Promise.all([
    sendMail({
      to: site.advertiseEmail,
      subject: `Sponsorship enquiry: ${company}`,
      text,
      replyTo: email,
    }),
    sendWhatsApp(
      site.whatsappNumber,
      `📊 Sponsorship enquiry: ${company} (${name}, ${phone}) — ${pkg || 'undecided'} package.`
    ),
  ]);

  await kvSet(`advertise:${Date.now()}`, { company, name, email, phone, package: pkg, budget, message, at: new Date().toISOString() });

  return NextResponse.json({
    ok: true,
    message: 'Thank you — our partnerships team will send a proposal within two working days.',
    demo: mail.demo && wa.demo,
  });
}
