'use client';

import { RotateCcw } from 'lucide-react';

/**
 * Branded 500 — “Audio temporarily unavailable. We are fixing it.”
 * with a Try Again button (reloads the route).
 */
export default function GlobalError({ reset }: { error: Error & { digest?: string }; reset: () => void }) {
  return (
    <section className="relative min-h-[80vh] flex items-center bg-night overflow-hidden">
      <div className="absolute inset-0 bg-cover bg-center opacity-25" style={{ backgroundImage: "url('/images/about-mix.jpg')" }} aria-hidden />
      <div className="absolute inset-0 bg-gradient-to-t from-night via-night/80 to-night/60" aria-hidden />
      <div className="relative max-w-container mx-auto px-4 py-24 text-center">
        <p className="text-primary font-black text-[64px] md:text-[90px] leading-none tracking-tight">500</p>
        <h1 className="text-white font-black text-[26px] md:text-[36px] mt-4">
          Audio temporarily unavailable. We are fixing it.
        </h1>
        <p className="text-white/60 font-light mt-3 max-w-md mx-auto">
          Something broke on our side — our engineers have been notified. Give it another try.
        </p>
        <div className="flex justify-center gap-4 mt-8">
          <button type="button" onClick={reset} className="btn-primary-eapn">
            <RotateCcw size={15} /> Try Again
          </button>
        </div>
      </div>
    </section>
  );
}
