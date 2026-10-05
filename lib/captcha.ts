/**
 * Google reCAPTCHA verification (server-side only).
 *
 * - reCAPTCHA v3 (invisible) on all forms; token verified before processing.
 * - If the v3 score is under 0.5 the caller must fall back to reCAPTCHA v2
 *   (checkbox) — this module reports `fallback: 'v2'` so the client can render
 *   the v2 widget and resubmit with a v2 token (verified with the v2 secret).
 * - Secrets live only in environment variables. When no secret is configured
 *   (local/demo), tokens are accepted in demo mode and clearly flagged.
 */

const V3_VERIFY = 'https://www.google.com/recaptcha/api/siteverify';
const MIN_SCORE = 0.5;

export interface CaptchaResult {
  ok: boolean;
  fallback?: 'v2';
  score?: number;
  reason?: string;
  demo?: boolean;
}

async function verify(secret: string, token: string, remoteIp?: string): Promise<{ success: boolean; score?: number; 'error-codes'?: string[] }> {
  const body = new URLSearchParams({ secret, response: token });
  if (remoteIp) body.set('remoteip', remoteIp);
  const res = await fetch(V3_VERIFY, { method: 'POST', body });
  if (!res.ok) return { success: false, 'error-codes': ['verify-request-failed'] };
  return res.json();
}

export async function verifyCaptcha(token: string | undefined, remoteIp?: string): Promise<CaptchaResult> {
  const v3Secret = process.env.RECAPTCHA_SECRET_KEY;
  const v2Secret = process.env.RECAPTCHA_SECRET_KEY_V2;

  if (!v3Secret && !v2Secret) {
    // Demo mode — no secrets configured. Accept but flag, so handlers can note it.
    return { ok: true, demo: true, score: 1, reason: 'demo-mode (no RECAPTCHA_SECRET_KEY configured)' };
  }
  if (!token) return { ok: false, reason: 'missing-token' };

  if (v3Secret) {
    try {
      const r = await verify(v3Secret, token, remoteIp);
      if (r.success) {
        const score = typeof r.score === 'number' ? r.score : 1;
        if (score < MIN_SCORE) {
          // Score under 0.5 → reCAPTCHA v2 fallback required
          return { ok: false, fallback: 'v2', score, reason: 'low-score' };
        }
        return { ok: true, score };
      }
      if (v2Secret) {
        // The token may already be a v2 token (client fell back and resubmitted)
        const r2 = await verify(v2Secret, token, remoteIp);
        if (r2.success) return { ok: true, reason: 'verified-v2' };
      }
      return { ok: false, fallback: v2Secret ? 'v2' : undefined, reason: 'verification-failed' };
    } catch {
      return { ok: false, reason: 'verify-error' };
    }
  }

  if (v2Secret) {
    try {
      const r = await verify(v2Secret, token, remoteIp);
      return r.success ? { ok: true } : { ok: false, reason: 'verification-failed' };
    } catch {
      return { ok: false, reason: 'verify-error' };
    }
  }

  return { ok: false, reason: 'not-configured' };
}
