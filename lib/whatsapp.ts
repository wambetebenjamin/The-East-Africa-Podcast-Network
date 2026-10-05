/**
 * WhatsApp notifications.
 *
 * - Primary: WhatsApp Cloud API (WHATSAPP_TOKEN + WHATSAPP_PHONE_NUMBER_ID) when configured.
 * - Fallback: wa.me deep links (no API needed) — the link is returned so it can be
 *   surfaced to producers/the user, and logged server-side in demo mode.
 */

const CLOUD_API = 'https://graph.facebook.com/v19.0';

export const whatsappConfigured = Boolean(process.env.WHATSAPP_TOKEN && process.env.WHATSAPP_PHONE_NUMBER_ID);

export async function sendWhatsApp(to: string, message: string): Promise<{ sent: boolean; demo: boolean; link: string }> {
  const link = `https://wa.me/${to.replace(/[^0-9]/g, '')}?text=${encodeURIComponent(message)}`;
  if (!whatsappConfigured) {
    console.info(`[whatsapp:demo] to=${to}\n${message}`);
    return { sent: false, demo: true, link };
  }
  try {
    const res = await fetch(`${CLOUD_API}/${process.env.WHATSAPP_PHONE_NUMBER_ID}/messages`, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${process.env.WHATSAPP_TOKEN}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        messaging_product: 'whatsapp',
        to: to.replace(/[^0-9]/g, ''),
        type: 'text',
        text: { body: message },
      }),
    });
    if (!res.ok) {
      console.error('[whatsapp] cloud api error', await res.text());
      return { sent: false, demo: false, link };
    }
    return { sent: true, demo: false, link };
  } catch (err) {
    console.error('[whatsapp] send failed', err);
    return { sent: false, demo: false, link };
  }
}

export const PRODUCER_WA = process.env.PRODUCER_WHATSAPP || '254112272061';
