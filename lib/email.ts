/**
 * Transactional email via Nodemailer (SMTP) with SendGrid-ready env shape.
 * When SMTP is not configured (demo mode), emails are logged to the server
 * console instead of failing the request.
 */
import nodemailer from 'nodemailer';

export interface MailInput {
  to: string;
  subject: string;
  text: string;
  replyTo?: string;
}

const HOST = process.env.SMTP_HOST;
const PORT = Number(process.env.SMTP_PORT || 587);
const USER = process.env.SMTP_USER;
const PASS = process.env.SMTP_PASS;
const FROM = process.env.EMAIL_FROM || 'The East Africa Podcast Network <hello@eapn.africa>';

export const emailConfigured = Boolean(HOST && USER && PASS);

export async function sendMail(input: MailInput): Promise<{ sent: boolean; demo: boolean }> {
  if (!emailConfigured) {
    console.info(`[email:demo] to=${input.to} subject="${input.subject}"\n${input.text}`);
    return { sent: false, demo: true };
  }
  try {
    const transporter = nodemailer.createTransport({
      host: HOST,
      port: PORT,
      secure: PORT === 465,
      auth: { user: USER as string, pass: PASS as string },
    });
    await transporter.sendMail({
      from: FROM,
      to: input.to,
      subject: input.subject,
      text: input.text,
      replyTo: input.replyTo,
    });
    return { sent: true, demo: false };
  } catch (err) {
    console.error('[email] send failed', err);
    return { sent: false, demo: false };
  }
}
