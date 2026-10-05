'use client';

import Link from 'next/link';
import { Calendar, Clock, Headphones } from 'lucide-react';
import ThreeSphere from './ThreeSphere';
import { usePlayer } from '@/lib/store';
import { formatDate, formatDuration } from '@/lib/site';
import type { Episode } from '@/lib/types';

/**
 * Full-screen immersive hero on the zip's cover style:
 * photo background + rgba(0,0,0,.4) overlay, 100vh, h1 weight 900 (30→50px).
 * Headline enters word by word (0.1s per word, ease-in-out); subtext fades in;
 * equalizer animates while the audio player is active.
 */
export default function Hero({ featured }: { featured: Episode }) {
  const words = ['Stories', 'Worth', 'Listening', 'To.'];
  const playingSlug = usePlayer((s) => s.episode?.slug);
  const isPlaying = usePlayer((s) => s.playing);
  const setEpisode = usePlayer((s) => s.setEpisode);
  const togglePlay = usePlayer((s) => s.togglePlay);
  const heroActive = playingSlug === featured.slug && isPlaying;

  return (
    <section className="relative min-h-[600px] h-screen flex items-center overflow-hidden">
      {/* Background */}
      <div
        className="absolute inset-0 bg-cover bg-center"
        style={{ backgroundImage: "url('/images/hero-studio.jpg')" }}
        aria-hidden
      />
      <div className="absolute inset-0 bg-black/40" aria-hidden /> {/* zip .overlay rgba(0,0,0,.4) */}
      <div className="absolute inset-x-0 bottom-0 h-40 bg-gradient-to-t from-night/80 to-transparent" aria-hidden />

      {/* Three.js waveform sphere — right side, desktop only, pauses offscreen */}
      <ThreeSphere />

      <div className="relative max-w-container mx-auto px-4 w-full pt-16 pb-28">
        <div className="max-w-2xl">
          <p
            className="text-white/70 uppercase tracking-[0.3em] text-[12px] font-light opacity-0"
            style={{ animation: 'eapn-word 0.45s ease-in-out 0s forwards' }}
          >
            The East Africa Podcast Network
          </p>

          {/* Word-by-word headline (0.1s per word) */}
          <h1 className="word-in text-white font-black text-[34px] md:text-[50px] leading-[1.15] mt-4 mb-6">
            {words.map((w, i) => (
              <span key={i} className="w" style={{ animationDelay: `${200 + i * 100}ms` }}>
                {w}
                {i < words.length - 1 ? '\u00A0' : ''}
              </span>
            ))}
          </h1>

          {/* Subtext fades in after the headline */}
          <p
            className="text-white/85 text-[16px] md:text-[19px] font-light leading-relaxed max-w-xl opacity-0"
            style={{ animation: 'eapn-word 0.5s ease-in-out 700ms forwards' }}
          >
            East Africa’s home for podcasts that inform, inspire, and entertain.
          </p>

          {/* CTAs */}
          <div
            className="flex flex-wrap items-center gap-4 mt-8 opacity-0"
            style={{ animation: 'eapn-word 0.5s ease-in-out 900ms forwards' }}
          >
            <button
              type="button"
              onClick={() => {
                if (playingSlug === featured.slug) togglePlay();
                else setEpisode(featured, true);
              }}
              className="btn-primary-eapn"
              aria-label="Listen to the latest episode"
            >
              <Headphones size={16} /> Listen Now
            </button>
            <Link href="/shows" className="btn-outline-eapn">
              Browse Shows
            </Link>
          </div>

          {/* Live equalizer when the player is active with the featured episode */}
          {heroActive && (
            <div className="flex items-center gap-3 mt-8" aria-label="Now playing">
              <span className="equalizer" aria-hidden>
                <span /><span /><span /><span /><span />
              </span>
              <span className="text-[12px] uppercase tracking-[0.15em] text-white/80">
                Now playing · {featured.title}
              </span>
            </div>
          )}

          {/* Featured episode meta */}
          <div
            className="mt-10 flex flex-wrap items-center gap-x-5 gap-y-2 text-white/60 text-[13px] font-light opacity-0"
            style={{ animation: 'eapn-word 0.5s ease-in-out 1100ms forwards' }}
          >
            <Link href={`/episodes/${featured.slug}`} className="text-white hover:text-primary underline-offset-4 hover:underline">
              Latest: {featured.title}
            </Link>
            <span className="inline-flex items-center gap-1.5">
              <Calendar size={13} className="text-primary" /> {formatDate(featured.publishedAt)}
            </span>
            <span className="inline-flex items-center gap-1.5">
              <Clock size={13} className="text-primary" /> {formatDuration(featured.duration)}
            </span>
          </div>
        </div>
      </div>

      {/* Scroll hint */}
      <div className="absolute bottom-24 md:bottom-6 left-1/2 -translate-x-1/2 text-white/40 text-[11px] uppercase tracking-[0.3em] hidden md:block">
        Scroll
      </div>
    </section>
  );
}
