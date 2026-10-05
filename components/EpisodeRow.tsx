'use client';

import Link from 'next/link';
import { Calendar, Clock, PlayCircle } from 'lucide-react';
import PlayEpisodeButton from './PlayEpisodeButton';
import { formatDate, formatDuration } from '@/lib/site';
import type { Episode } from '@/lib/types';

/**
 * Episode row — reverse-chronological feed item (zip .podcast-entry proportions).
 * Fades in from left on scroll with 50ms stagger (handled by parent Reveal).
 */
export default function EpisodeRow({ episode, showTitle }: { episode: Episode; showTitle: string }) {
  return (
    <article className="podcast-entry group w-full">
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <Link
        href={`/episodes/${episode.slug}`}
        className="block md:w-[220px] shrink-0 aspect-square md:aspect-auto overflow-hidden relative"
      >
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={episode.artwork}
          alt={`${showTitle} artwork`}
          className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
        />
      </Link>
      <div className="flex-1 p-6 md:p-8 min-w-0">
        <h3 className="font-light text-[20px] md:text-[22px] leading-snug mb-2">
          <Link href={`/episodes/${episode.slug}`} className="hover:text-primary">
            {episode.title}
          </Link>
        </h3>
        <div className="meta-line mb-3">
          <small>
            <Link href={`/shows/${episode.showSlug}`} className="hover:text-primary capitalize">
              {showTitle}
            </Link>
            <span className="sep">/</span>
            <span className="inline-flex items-center gap-1">
              <Calendar size={12} className="text-primary" aria-hidden /> {formatDate(episode.publishedAt)}
            </span>
            <span className="sep">/</span>
            <span className="inline-flex items-center gap-1">
              <Clock size={12} className="text-primary" aria-hidden /> {formatDuration(episode.duration)}
            </span>
          </small>
        </div>
        <p className="text-[15px] font-light text-body mb-4 line-clamp-2">{episode.description}</p>
        <div className="flex items-center gap-3">
          <PlayEpisodeButton episode={episode} size={36} />
          <Link
            href={`/episodes/${episode.slug}`}
            className="inline-flex items-center gap-1.5 text-[12px] uppercase tracking-[0.1em] text-ink hover:text-primary font-normal"
          >
            <PlayCircle size={14} /> Episode notes
          </Link>
        </div>
      </div>
    </article>
  );
}
