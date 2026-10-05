'use client';

import { createContext, useCallback, useContext, useEffect, useMemo, useRef, useState, type ReactNode } from 'react';

/**
 * Google reCAPTCHA v3 (invisible) client.
 * - Loads the v3 script when NEXT_PUBLIC_RECAPTCHA_SITE_KEY is set.
 * - execute() returns a token to submit with each form.
 * - If the server reports score < 0.5 it responds with fallback:'v2';
 *   the <RecaptchaV2> widget then renders the v2 checkbox and the form is
 *   resubmitted with the v2 token (server verifies with the v2 secret).
 * - Demo mode (no site key): execute() resolves a 'demo' token which the
 *   server accepts only when no secret is configured.
 */

const SITE_KEY = process.env.NEXT_PUBLIC_RECAPTCHA_SITE_KEY;
const V2_SITE_KEY = process.env.NEXT_PUBLIC_RECAPTCHA_V2_SITE_KEY;

type Grecaptcha = {
  ready: (cb: () => void) => void;
  execute: (siteKey: string, opts: { action: string }) => Promise<string>;
  render?: (el: HTMLElement, opts: Record<string, unknown>) => number;
};

declare global {
  interface Window {
    grecaptcha?: Grecaptcha;
    onRecaptchaV2Load?: () => void;
  }
}

const RecaptchaContext = createContext<{ execute: (action: string) => Promise<string | null> }>({
  execute: async () => null,
});

export function RecaptchaProvider({ children }: { children: ReactNode }) {
  useEffect(() => {
    if (!SITE_KEY || document.getElementById('eapn-recaptcha-v3')) return;
    const s = document.createElement('script');
    s.id = 'eapn-recaptcha-v3';
    s.src = `https://www.google.com/recaptcha/api.js?render=${SITE_KEY}`;
    s.async = true;
    s.defer = true;
    document.head.appendChild(s);
  }, []);

  const execute = useCallback(async (action: string) => {
    if (!SITE_KEY) return 'demo'; // demo mode — server also unconfigured
    await new Promise<void>((resolve) => {
      if (window.grecaptcha) return resolve();
      const iv = setInterval(() => {
        if (window.grecaptcha) {
          clearInterval(iv);
          resolve();
        }
      }, 120);
      setTimeout(() => {
        clearInterval(iv);
        resolve();
      }, 3000);
    });
    if (!window.grecaptcha) return null;
    try {
      return await window.grecaptcha.execute(SITE_KEY, { action });
    } catch {
      return null;
    }
  }, []);

  const value = useMemo(() => ({ execute }), [execute]);
  return <RecaptchaContext.Provider value={value}>{children}</RecaptchaContext.Provider>;
}

export function useRecaptcha() {
  return useContext(RecaptchaContext);
}

/** reCAPTCHA v2 checkbox fallback widget (rendered when server says score < 0.5). */
export function RecaptchaV2({ onToken }: { onToken: (token: string) => void }) {
  const [loaded, setLoaded] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!V2_SITE_KEY) return;
    window.onRecaptchaV2Load = () => setLoaded(true);
    if (!document.getElementById('eapn-recaptcha-v2')) {
      const s = document.createElement('script');
      s.id = 'eapn-recaptcha-v2';
      s.src = 'https://www.google.com/recaptcha/api.js?onload=onRecaptchaV2Load&render=explicit';
      s.async = true;
      s.defer = true;
      document.head.appendChild(s);
    } else {
      setLoaded(true);
    }
  }, []);

  useEffect(() => {
    if (!loaded || !V2_SITE_KEY || !ref.current || ref.current.childElementCount > 0) return;
    window.grecaptcha?.render?.(ref.current, {
      sitekey: V2_SITE_KEY,
      callback: onToken,
    });
  }, [loaded, onToken]);

  if (!V2_SITE_KEY) {
    return (
      <p className="text-[12px] text-primary font-light">
        Verification failed and v2 fallback is not configured. Please try again later.
      </p>
    );
  }
  return <div ref={ref} className="my-2" />;
}
