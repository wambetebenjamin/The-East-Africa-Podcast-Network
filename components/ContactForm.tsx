'use client';

import { useState, type FormEvent } from 'react';
import { Send } from 'lucide-react';
import { FormStatus, useCaptchaSubmit } from './useCaptchaSubmit';

/**
 * Contact form — general enquiry, press, technical support.
 * reCAPTCHA v3 → POST /api/contact → Nodemailer.
 */
export default function ContactForm() {
  const [form, setForm] = useState({ name: '', email: '', phone: '', topic: 'general', message: '' });
  const { state, message, submit, captchaV2Widget } = useCaptchaSubmit('/api/contact', 'contact');

  const set = (k: keyof typeof form) => (e: { target: { value: string } }) =>
    setForm((f) => ({ ...f, [k]: e.target.value }));

  const onSubmit = async (e: FormEvent) => {
    e.preventDefault();
    const ok = await submit(form);
    if (ok) setForm({ name: '', email: '', phone: '', topic: 'general', message: '' });
  };

  return (
    <form onSubmit={onSubmit} className="card-eapn p-6 md:p-8" noValidate>
      <div className="grid sm:grid-cols-2 gap-4">
        <div>
          <label htmlFor="c-name" className="field-label">Name</label>
          <input id="c-name" required value={form.name} onChange={set('name')} className="field" placeholder="Your name" />
        </div>
        <div>
          <label htmlFor="c-email" className="field-label">Email</label>
          <input id="c-email" type="email" required value={form.email} onChange={set('email')} className="field" placeholder="you@example.com" />
        </div>
        <div>
          <label htmlFor="c-phone" className="field-label">Phone (optional)</label>
          <input id="c-phone" value={form.phone} onChange={set('phone')} className="field" placeholder="+254 …" />
        </div>
        <div>
          <label htmlFor="c-topic" className="field-label">Topic</label>
          <select id="c-topic" value={form.topic} onChange={set('topic')} className="field">
            <option value="general">General enquiry</option>
            <option value="press">Press</option>
            <option value="support">Technical support</option>
          </select>
        </div>
      </div>
      <div className="mt-4">
        <label htmlFor="c-message" className="field-label">Message</label>
        <textarea id="c-message" rows={6} required value={form.message} onChange={set('message')} className="field" placeholder="How can we help?" />
      </div>
      {captchaV2Widget}
      <button type="submit" disabled={state === 'submitting'} className="btn-primary-eapn mt-6">
        <Send size={14} /> Send Message
      </button>
      <FormStatus state={state} message={message} />
    </form>
  );
}
