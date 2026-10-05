'use client';

import { useState, type FormEvent } from 'react';
import { Send } from 'lucide-react';
import { shows } from '@/lib/data';
import { FormStatus, useCaptchaSubmit } from './useCaptchaSubmit';

/**
 * Episode request form — "Have a topic or guest you want us to cover?"
 * Name, Email, Show preference, Topic/guest suggestion, Message.
 * reCAPTCHA v3 → POST /api/request → WhatsApp notification.
 */
export default function EpisodeRequestForm() {
  const [form, setForm] = useState({ name: '', email: '', show: '', topic: '', message: '' });
  const { state, message, submit, captchaV2Widget } = useCaptchaSubmit('/api/request', 'episode_request');

  const set = (k: keyof typeof form) => (e: { target: { value: string } }) =>
    setForm((f) => ({ ...f, [k]: e.target.value }));

  const onSubmit = async (e: FormEvent) => {
    e.preventDefault();
    const ok = await submit(form);
    if (ok) setForm({ name: '', email: '', show: '', topic: '', message: '' });
  };

  return (
    <form onSubmit={onSubmit} className="card-eapn p-6 md:p-8" noValidate>
      <div className="grid sm:grid-cols-2 gap-4">
        <div>
          <label htmlFor="req-name" className="field-label">Name</label>
          <input id="req-name" required value={form.name} onChange={set('name')} className="field" placeholder="Your name" />
        </div>
        <div>
          <label htmlFor="req-email" className="field-label">Email</label>
          <input id="req-email" type="email" required value={form.email} onChange={set('email')} className="field" placeholder="you@example.com" />
        </div>
      </div>
      <div className="mt-4">
        <label htmlFor="req-show" className="field-label">Show preference</label>
        <select id="req-show" value={form.show} onChange={set('show')} className="field">
          <option value="">Any show / Not sure</option>
          {shows.map((s) => (
            <option key={s.slug} value={s.slug}>{s.title}</option>
          ))}
        </select>
      </div>
      <div className="mt-4">
        <label htmlFor="req-topic" className="field-label">Topic or guest suggestion</label>
        <input id="req-topic" required value={form.topic} onChange={set('topic')} className="field" placeholder="e.g. The rise of Kigali’s tech scene" />
      </div>
      <div className="mt-4">
        <label htmlFor="req-message" className="field-label">Message</label>
        <textarea id="req-message" rows={4} required value={form.message} onChange={set('message')} className="field" placeholder="Tell us more — why this story matters to you…" />
      </div>
      {captchaV2Widget}
      <button type="submit" disabled={state === 'submitting'} className="btn-primary-eapn mt-6">
        <Send size={14} /> Send Request
      </button>
      <FormStatus state={state} message={message} />
    </form>
  );
}
