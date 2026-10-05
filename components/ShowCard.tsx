'use client';

import Link from 'next/link';
import { Headphones, Rss } from 'lucide-react';
import { formatNumber } from '@/lib/site';
import { usePlayer } from '@/lib/store';
import type { Show } from '@/lib/types';

/**
 * Show card for the /shows grid: artwork, title, host, category tag,
 * episode count, subscriber count, Listen + Subscribe buttons.
 * Hover: artwork scale 1.04, shadow lifts (zip card shadows).
 */
export default function ShowCard({ show }: { show: Show }) {
  const playingSlug = usePlayer((s) => s.episode?.slug);
  const playing = usePlayer((s) => s.playing);
  const setEpisode = usePlayer((s) => s.setEpisode);
  const togglePlay = usePlayer((s) => s.togglePlay);
  const subscriptions = usePlayer((s) => s.subscriptions);
  const toggleSubscription = usePlayer((s) => s.toggleSubscription);

  const latest = show.episodes[0];
  const isPlayingThis = playingSlug === latest?.slug && playing;
  const subscribed = subscriptions.includes(show.slug);

  return (
    <article className="card-eapn group transition-shadow duration-300 hover:shadow-card">
      <Link href={`/shows/${show.slug}`} className="block relative overflow-hidden aspect-square">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={show.artwork}
          alt={`${show.title} artwork`}
          className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-[1.04]"
        />
        <span className="absolute top-3 left-3 bg-night/80 text-white text-[11px] uppercase tracking-[0.1em] px-2.5 py-1 rounded-full backdrop-blur">
          {show.category}
        </span>
        {isPlayingThis && (
          <span className="equalizer absolute bottom-3 right-3 !h-8 [&>span]:!bg-white" aria-label="Playing">
            <span /><span /><span /><span /><span />
          </span>
        )}
      </Link>
      <div className="p-5">
        <h3 className="text-[18px] font-normal leading-snug mb-1">
          <Link href={`/shows/${show.slug}`} className="hover:text-primary">
            {show.title}
          </Link>
        </h3>
        <p className="text-[13px] text-body/80 font-light mb-3">
          with <span className="text-ink">{show.host.name}</span>
        </p>
        <p className="text-[11px] uppercase tracking-[0.08em] text-body/60 font-light mb-4">
          {show.episodes.length} episodes · {formatNumber(show.subscribers)} subscribers
        </p>
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => {
              if (!latest) return;
              if (playingSlug === latest.slug) togglePlay();
              else setEpisode(latest, true);
            }}
            className="btn-primary-eapn flex-1 !px-3 !py-2"
            aria-label={`Listen to ${show.title}`}
          >
            <Headphones size={14} /> Listen
          </button>
          <button
            type="button"
            onClick={() => toggleSubscription(show.slug)}
            aria-pressed={subscribed}
            className={`btn-light-eapn flex-1 !px-3 !py-2 ${subscribed ? '!bg-primary !text-white !border-primary' : ''}`}
          >
            <Rss size={14} /> {subscribed ? 'Following' : 'Subscribe'}
          </button>
        </div>
      </div>
    </article>
  );
}
