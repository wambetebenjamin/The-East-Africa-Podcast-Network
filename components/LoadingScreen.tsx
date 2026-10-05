'use client';

import { useEffect, useState } from 'react';

/**
 * Loading screen (spec fallback — not present in zip):
 * wordmark fades in → 5-bar equalizer pulses → progress bar fills left→right
 * → page fades in. Under 2 seconds total, shown once per session.
 */
export default function LoadingScreen() {
  const [done, setDone] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    if (typeof window === 'undefined') return;
    // Show once per session
    if (sessionStorage.getItem('eapn-loaded')) {
      setDone(true);
      document.body.style.overflow = '';
      return;
    }
    document.body.style.overflow = 'hidden';
    const t = setTimeout(() => {
      sessionStorage.setItem('eapn-loaded', '1');
      setDone(true);
      document.body.style.overflow = '';
    }, 1750); // wordmark 0.45s + progress 1.45s (overlap) — under 2s total
    return () => {
      clearTimeout(t);
      document.body.style.overflow = '';
    };
  }, []);

  if (!mounted || done) return null;

  return (
    <div className="loading-screen" role="status" aria-label="Loading The East Africa Podcast Network">
      <div className="loading-wordmark text-center">
        <p className="text-white uppercase tracking-[0.35em] text-[11px] font-light mb-3">The East Africa</p>
        <h1 className="text-white font-black text-2xl md:text-4xl tracking-tight">PODCAST NETWORK</h1>
        <div className="equalizer justify-center mt-6" aria-hidden>
          <span /><span /><span /><span /><span />
        </div>
      </div>
      <div className="loading-progress" aria-hidden>
        <i />
      </div>
    </div>
  );
}
