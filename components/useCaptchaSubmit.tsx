'use client';

import { useCallback, useState } from 'react';
import { useRecaptcha, RecaptchaV2 } from './Recaptcha';

export type SubmitState = 'idle' | 'submitting' | 'success' | 'error' | 'v2';

/**
 * Shared form submission flow with reCAPTCHA v3:
 * 1. execute() gets an invisible v3 token for the action.
 * 2. POST to the endpoint with the token (server verifies).
 * 3. If the server answers { ok:false, fallback:'v2' } (score < 0.5), the
 *    reCAPTCHA v2 checkbox widget is shown; solving it resubmits with the
 *    v2 token.
 */
export function useCaptchaSubmit(endpoint: string, action: string) {
  const { execute } = useRecaptcha();
  const [state, setState] = useState<SubmitState>('idle');
  const [message, setMessage] = useState('');
  const [v2Token, setV2Token] = useState<string | null>(null);
  const [payload, setPayload] = useState<Record<string, unknown> | null>(null);

  const post = useCallback(
    async (data: Record<string, unknown>, token: string | null) => {
      setState('submitting');
      setMessage('');
      try {
        const res = await fetch(endpoint, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ ...data, 'g-recaptcha-response': token, recaptchaVersion: token && token !== 'demo' && v2Token === token ? 'v2' : 'v3' }),
        });
        const json = (await res.json()) as { ok?: boolean; fallback?: string; error?: string; message?: string };
        if (res.ok && json.ok) {
          setState('success');
          setMessage(json.message || 'Thank you — we received that.');
          return true;
        }
        if (json.fallback === 'v2') {
          setState('v2');
          setPayload(data);
          setMessage('Please complete the verification below and submit again.');
          return false;
        }
        setState('error');
        setMessage(json.error || json.message || 'Something went wrong. Please try again.');
        return false;
      } catch {
        setState('error');
        setMessage('Network error — please check your connection and try again.');
        return false;
      }
    },
    [endpoint, v2Token]
  );

  const submit = useCallback(
    async (data: Record<string, unknown>) => {
      const token = await execute(action);
      if (!token) {
        setState('error');
        setMessage('Verification is unavailable right now. Please try again.');
        return false;
      }
      return post(data, token);
    },
    [execute, action, post]
  );

  const submitWithV2 = useCallback(
    async (token: string) => {
      if (!payload) return false;
      setV2Token(token);
      return post(payload, token);
    },
    [payload, post]
  );

  const captchaV2Widget = state === 'v2' ? <RecaptchaV2 onToken={(t) => void submitWithV2(t)} /> : null;

  return { state, message, submit, captchaV2Widget, setState, setMessage };
}

/** Status banner used under every form. */
export function FormStatus({ state, message }: { state: SubmitState; message: string }) {
  if (state === 'idle' || state === 'v2' || !message) return null;
  const tone =
    state === 'success'
      ? 'border-green-600/30 bg-green-50 text-green-800'
      : state === 'submitting'
        ? 'border-line bg-section/30 text-body'
        : 'border-primary/30 bg-red-50 text-red-700';
  return (
    <p role="status" aria-live="polite" className={`mt-4 border rounded-[4px] px-4 py-3 text-[14px] font-light ${tone}`}>
      {state === 'submitting' ? 'Sending…' : message}
    </p>
  );
}
