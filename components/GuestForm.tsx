'use client';

import { useState, type FormEvent } from 'react';
import { Mic, Send } from 'lucide-react';
import { shows } from '@/lib/data';
import { FormStatus, useCaptchaSubmit } from './useCaptchaSubmit';

/**
 * Guest submission form — "Want to be a guest on a show?"
 * Name, Email, Phone, LinkedIn/website, Area of expertise, Brief bio,
 * Target show. reCAPTCHA v3 → POST /api/guest-submission → email + WhatsApp
 * to producers.
 */
export default function GuestForm() {
  const [form, setForm] = useState({
    name: '',
    email: '',
    phone: '',
    link: '',
    expertise: '',
    bio: '',
    show: '',
  });
  const { state, message, submit, captchaV2Widget } = useCaptchaSubmit('/api/guest-submission', 'guest_submission');

  const set = (k: keyof typeof form) => (e: { target: { value: string } }) =>
    setForm((f) => ({ ...f, [k]: e.target.value }));

  const onSubmit = async (e: FormEvent) => {
    e.preventDefault();
    const ok = await submit(form);
    if (ok) setForm({ name: '', email: '', phone: '', link: '', expertise: '', bio: '', show: '' });
  };

  return (
    <form onSubmit={onSubmit} className="card-eapn p-6 md:p-8" noValidate>
      <div className="grid sm:grid-cols-2 gap-4">
        <div>
          <label htmlFor="g-name" className="field-label">Name</label>
          <input id="g-name" required value={form.name} onChange={set('name')} className="field" placeholder="Your full name" />
        </div>
        <div>
          <label htmlFor="g-email" className="field-label">Email</label>
          <input id="g-email" type="email" required value={form.email} onChange={set('email')} className="field" placeholder="you@example.com" />
        </div>
        <div>
          <label htmlFor="g-phone" className="field-label">Phone (WhatsApp preferred)</label>
          <input id="g-phone" required value={form.phone} onChange={set('phone')} className="field" placeholder="+254 7xx xxx xxx" />
        </div>
        <div>
          <label htmlFor="g-link" className="field-label">LinkedIn or website</label>
          <input id="g-link" required value={form.link} onChange={set('link')} className="field" placeholder="linkedin.com/in/…" />
        </div>
        <div>
          <label htmlFor="g-exp" className="field-label">Area of expertise</label>
          <input id="g-exp" required value={form.expertise} onChange={set('expertise')} className="field" placeholder="e.g. Fintech regulation in East Africa" />
        </div>
        <div>
          <label htmlFor="g-show" className="field-label">Target show</label>
          <select id="g-show" value={form.show} onChange={set('show')} className="field">
            <option value="">Any show / Not sure</option>
            {shows.map((s) => (
              <option key={s.slug} value={s.slug}>{s.title}</option>
            ))}
          </select>
        </div>
      </div>
      <div className="mt-4">
        <label htmlFor="g-bio" className="field-label">Brief bio</label>
        <textarea id="g-bio" rows={5} required value={form.bio} onChange={set('bio')} className="field" placeholder="Two or three sentences about you and why listeners would enjoy your story…" />
      </div>
      {captchaV2Widget}
      <button type="submit" disabled={state === 'submitting'} className="btn-primary-eapn mt-6">
        <Mic size={14} /> Submit as Guest
      </button>
      <FormStatus state={state} message={message} />
    </form>
  );
}
