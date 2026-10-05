'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { Cookie, X } from 'lucide-react';

interface Consent {
  necessary: true;
  functional: boolean;
  analytics: boolean;
  marketing: boolean;
  ts?: string;
}

const KEY = 'eapn-consent';
const VALID = (c: Consent) => typeof c === 'object' && c !== null && typeof c.ts === 'string';

function read(): Consent | null {
  try {
    const raw = localStorage.getItem(KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw) as Consent;
    return VALID(parsed) ? parsed : null;
  } catch {
    return null;
  }
}

/**
 * Cookie consent banner (spec fallback — not present in zip):
 * fixed bottom banner, full width; Accept All / Manage Preferences;
 * modal with toggles (Necessary locked); consent in localStorage;
 * never repeats after acceptance. Links to /legal/cookie-policy.
 */
export default function CookieConsent() {
  const [visible, setVisible] = useState(false);
  const [modalOpen, setModalOpen] = useState(false);
  const [prefs, setPrefs] = useState<Consent>({
    necessary: true,
    functional: true,
    analytics: true,
    marketing: true,
  });

  useEffect(() => {
    const existing = read();
    if (existing) {
      setPrefs(existing);
    } else {
      const t = setTimeout(() => setVisible(true), 600);
      return () => clearTimeout(t);
    }
  }, []);

  const persist = (c: Consent) => {
    const withTs = { ...c, ts: new Date().toISOString() };
    localStorage.setItem(KEY, JSON.stringify(withTs));
    setPrefs(withTs);
    setVisible(false);
    setModalOpen(false);
  };

  if (!visible) return null;

  return (
    <>
      <div
        className="fixed inset-x-0 bottom-0 z-[70] bg-night/95 backdrop-blur text-white border-t border-white/10"
        role="dialog"
        aria-label="Cookie consent"
      >
        <div className="max-w-container mx-auto px-4 py-4 flex flex-col md:flex-row md:items-center gap-4">
          <Cookie size={20} className="text-primary shrink-0 hidden md:block" aria-hidden />
          <p className="text-[13px] leading-relaxed flex-1 font-light">
            We use cookies to track listening preferences, improve recommendations, and measure
            performance. See our{' '}
            <Link href="/legal/cookie-policy" className="text-primary underline underline-offset-2">
              Cookie Policy
            </Link>{' '}
            for details.
          </p>
          <div className="flex items-center gap-3 shrink-0">
            <button
              type="button"
              onClick={() => setModalOpen(true)}
              className="btn-light-eapn !text-ink bg-white/10 text-white border border-white/30"
            >
              Manage Preferences
            </button>
            <button type="button" onClick={() => persist(prefs)} className="btn-primary-eapn">
              Accept All
            </button>
          </div>
        </div>
      </div>

      {modalOpen && (
        <div className="fixed inset-0 z-[80] flex items-center justify-center p-4" role="dialog" aria-modal="true" aria-label="Manage cookie preferences">
          <div className="absolute inset-0 bg-night/70" onClick={() => setModalOpen(false)} />
          <div className="relative bg-white rounded-[4px] shadow-card max-w-lg w-full p-6 md:p-8">
            <button
              type="button"
              aria-label="Close"
              className="absolute top-4 right-4 text-body hover:text-ink"
              onClick={() => setModalOpen(false)}
            >
              <X size={20} />
            </button>
            <h2 className="text-xl font-bold text-ink mb-2">Manage Preferences</h2>
            <p className="text-[13px] text-body mb-6 font-light">
              Choose how we may use cookies on this site. Necessary cookies are required for the
              audio player and cannot be disabled.
            </p>
            <div className="space-y-3">
              <Toggle
                label="Necessary"
                note="Player state, security, session. Always on."
                checked
                disabled
                onChange={() => undefined}
              />
              <Toggle
                label="Functional"
                note="Remembering shows you follow and your queue."
                checked={prefs.functional}
                onChange={(v) => setPrefs((p) => ({ ...p, functional: v }))}
              />
              <Toggle
                label="Analytics"
                note="Understanding which episodes and features listeners use."
                checked={prefs.analytics}
                onChange={(v) => setPrefs((p) => ({ ...p, analytics: v }))}
              />
              <Toggle
                label="Marketing"
                note="Measuring sponsor campaigns and recommendations."
                checked={prefs.marketing}
                onChange={(v) => setPrefs((p) => ({ ...p, marketing: v }))}
              />
            </div>
            <div className="flex gap-3 mt-6">
              <button type="button" className="btn-dark-eapn flex-1" onClick={() => persist(prefs)}>
                Save Preferences
              </button>
              <button
                type="button"
                className="btn-primary-eapn flex-1"
                onClick={() => persist({ necessary: true, functional: true, analytics: true, marketing: true })}
              >
                Accept All
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

function Toggle({
  label,
  note,
  checked,
  disabled,
  onChange,
}: {
  label: string;
  note: string;
  checked: boolean;
  disabled?: boolean;
  onChange: (v: boolean) => void;
}) {
  return (
    <label className={`flex items-start gap-3 p-3 border border-line rounded-[4px] ${disabled ? 'bg-section/40' : ''}`}>
      <button
        type="button"
        role="switch"
        aria-checked={checked}
        aria-label={label}
        disabled={disabled}
        onClick={() => !disabled && onChange(!checked)}
        className={`mt-0.5 w-10 h-6 rounded-full relative transition-colors shrink-0 ${checked ? 'bg-primary' : 'bg-line'} ${disabled ? 'opacity-60 cursor-not-allowed' : 'cursor-pointer'}`}
      >
        <span
          className={`absolute top-0.5 w-5 h-5 bg-white rounded-full shadow transition-all ${checked ? 'left-[18px]' : 'left-0.5'}`}
        />
      </button>
      <span>
        <span className="block text-[14px] text-ink font-normal">
          {label} {disabled && <span className="text-[11px] uppercase tracking-wide text-body/60">(locked)</span>}
        </span>
        <span className="block text-[12px] text-body font-light">{note}</span>
      </span>
    </label>
  );
}
