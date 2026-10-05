'use client';

import { useState, type FormEvent } from 'react';
import { BarChart2, Send } from 'lucide-react';
import { sponsorPackages } from '@/lib/data';
import { FormStatus, useCaptchaSubmit } from './useCaptchaSubmit';

/**
 * Sponsorship enquiry form — POST /api/advertise.
 * Each package card's "Request a Proposal" CTA links here with ?package= pre-selected,
 * and WhatsApp CTAs pre-fill the show/package name.
 */
export default function AdvertiseForm({ initialPackage = '' }: { initialPackage?: string }) {
  const [form, setForm] = useState({
    company: '',
    name: '',
    email: '',
    phone: '',
    package: initialPackage,
    budget: '',
    message: '',
  });
  const { state, message, submit, captchaV2Widget } = useCaptchaSubmit('/api/advertise', 'advertise');

  const set = (k: keyof typeof form) => (e: { target: { value: string } }) =>
    setForm((f) => ({ ...f, [k]: e.target.value }));

  const onSubmit = async (e: FormEvent) => {
    e.preventDefault();
    const ok = await submit(form);
    if (ok) setForm({ company: '', name: '', email: '', phone: '', package: '', budget: '', message: '' });
  };

  return (
    <form onSubmit={onSubmit} className="card-eapn p-6 md:p-8" id="enquiry" noValidate>
      <h3 className="text-[22px] font-bold text-ink mb-1 flex items-center gap-2">
        <BarChart2 size={20} className="text-primary" /> Request a Proposal
      </h3>
      <p className="text-[14px] font-light text-body mb-6">
        Tell us about your brand and we will send a tailored proposal within two working days.
      </p>
      <div className="grid sm:grid-cols-2 gap-4">
        <div>
          <label htmlFor="a-company" className="field-label">Company / brand</label>
          <input id="a-company" required value={form.company} onChange={set('company')} className="field" placeholder="Acme Ltd" />
        </div>
        <div>
          <label htmlFor="a-name" className="field-label">Your name</label>
          <input id="a-name" required value={form.name} onChange={set('name')} className="field" placeholder="Full name" />
        </div>
        <div>
          <label htmlFor="a-email" className="field-label">Work email</label>
          <input id="a-email" type="email" required value={form.email} onChange={set('email')} className="field" placeholder="you@company.com" />
        </div>
        <div>
          <label htmlFor="a-phone" className="field-label">Phone / WhatsApp</label>
          <input id="a-phone" required value={form.phone} onChange={set('phone')} className="field" placeholder="+254 …" />
        </div>
        <div>
          <label htmlFor="a-package" className="field-label">Package of interest</label>
          <select id="a-package" value={form.package} onChange={set('package')} className="field">
            <option value="">Not sure yet — advise me</option>
            {sponsorPackages.map((p) => (
              <option key={p.name} value={p.name}>{p.name}</option>
            ))}
          </select>
        </div>
        <div>
          <label htmlFor="a-budget" className="field-label">Monthly budget (KES, optional)</label>
          <input id="a-budget" value={form.budget} onChange={set('budget')} className="field" placeholder="e.g. 150,000" />
        </div>
      </div>
      <div className="mt-4">
        <label htmlFor="a-message" className="field-label">Campaign goals</label>
        <textarea id="a-message" rows={4} required value={form.message} onChange={set('message')} className="field" placeholder="What are you promoting? Who are you trying to reach?" />
      </div>
      {captchaV2Widget}
      <button type="submit" disabled={state === 'submitting'} className="btn-primary-eapn mt-6">
        <Send size={14} /> Request Proposal
      </button>
      <FormStatus state={state} message={message} />
    </form>
  );
}
