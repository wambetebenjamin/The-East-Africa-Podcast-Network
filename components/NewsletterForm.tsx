'use client';

import { useState, type FormEvent } from 'react';
import { Mail } from 'lucide-react';
import { shows } from '@/lib/data';
import { FormStatus, useCaptchaSubmit } from './useCaptchaSubmit';

/**
 * Newsletter signup — "New episodes delivered to your inbox every week."
 * reCAPTCHA v3 with v2 fallback. POST /api/newsletter (Vercel KV).
 */
export default function NewsletterForm({ compact = false }: { compact?: boolean }) {
  const [email, setEmail] = useState('');
  const [prefs, setPrefs] = useState<string[]>([]);
  const { state, message, submit, captchaV2Widget } = useCaptchaSubmit('/api/newsletter', 'newsletter');

  const onSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (!email) return;
    const ok = await submit({ email, showPreferences: prefs });
    if (ok) setEmail('');
  };

  if (compact) {
    return (
      <form onSubmit={onSubmit} className="space-y-2" noValidate>
        <label htmlFor="footer-email" className="sr-only">
          Email address
        </label>
        <div className="flex">
          <input
            id="footer-email"
            type="email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Enter Email"
            className="flex-1 min-w-0 bg-transparent border border-white/40 rounded-l-btn h-[43px] px-3 text-white text-[14px] placeholder:text-white/40 outline-none focus:border-primary"
          />
          <button type="submit" disabled={state === 'submitting'} className="btn-primary-eapn !rounded-l-none h-[43px] !px-5">
            <Mail size={14} /> Send
          </button>
        </div>
        {captchaV2Widget}
        <FormStatus state={state} message={message} />
      </form>
    );
  }

  return (
    <form onSubmit={onSubmit} className="max-w-xl mx-auto text-left" noValidate>
      <label htmlFor="nl-email" className="field-label">
        Email address
      </label>
      <input
        id="nl-email"
        type="email"
        required
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        placeholder="you@example.com"
        className="field"
      />
      <fieldset className="mt-5">
        <legend className="field-label">Show preferences (optional)</legend>
        <div className="grid sm:grid-cols-2 gap-2">
          {shows.map((s) => (
            <label key={s.slug} className="flex items-center gap-2.5 text-[14px] font-light text-body cursor-pointer">
              <input
                type="checkbox"
                checked={prefs.includes(s.slug)}
                onChange={(e) =>
                  setPrefs((p) => (e.target.checked ? [...p, s.slug] : p.filter((x) => x !== s.slug)))
                }
                className="accent-[#f23a2e] w-4 h-4"
              />
              {s.title}
            </label>
          ))}
        </div>
      </fieldset>
      {captchaV2Widget}
      <button type="submit" disabled={state === 'submitting'} className="btn-primary-eapn mt-6 w-full sm:w-auto">
        Subscribe
      </button>
      <FormStatus state={state} message={message} />
    </form>
  );
}
