'use client';

import Link from 'next/link';
import { useState } from 'react';
import { Calendar, Clock, Download, PlayCircle, Share2 } from 'lucide-react';
import PlayEpisodeButton from './PlayEpisodeButton';
import { formatDate, formatDuration } from '@/lib/site';
import type { Episode } from '@/lib/types';

/**
 * Episode list on the show page: rows with episode number, title, duration,
 * published date, play, download, share. Load-more at bottom.
 */
export default function ShowEpisodeList({ episodes }: { episodes: Episode[] }) {
  const [limit, setLimit] = useState(6);

  return (
    <div>
      <ul className="divide-y divide-line border border-line rounded-[4px] bg-white">
        {episodes.slice(0, limit).map((ep) => (
          <li key={ep.slug} className="flex items-center gap-4 p-4 hover:bg-menuhover/60 transition-colors">
            <span className="text-[13px] text-body/50 tabular-nums w-14 shrink-0 font-light">
              S{ep.season}E{ep.number}
            </span>
            <PlayEpisodeButton episode={ep} size={30} />
            <div className="flex-1 min-w-0">
              <Link href={`/episodes/${ep.slug}`} className="text-[15px] text-ink hover:text-primary font-normal block truncate">
                {ep.title}
              </Link>
              <p className="text-[12px] text-body/60 font-light flex items-center gap-3 flex-wrap">
                <span className="inline-flex items-center gap-1">
                  <Calendar size={11} className="text-primary" /> {formatDate(ep.publishedAt)}
                </span>
                <span className="inline-flex items-center gap-1">
                  <Clock size={11} className="text-primary" /> {formatDuration(ep.duration)}
                </span>
              </p>
            </div>
            <div className="flex items-center gap-1 shrink-0">
              <a
                href={ep.audio}
                download
                aria-label={`Download ${ep.title}`}
                className="p-2 text-body/60 hover:text-primary"
              >
                <Download size={17} />
              </a>
              <a
                href={`https://wa.me/?text=${encodeURIComponent(`${ep.title} — listen on EAPN: /episodes/${ep.slug}`)}`}
                target="_blank"
                rel="noopener noreferrer"
                aria-label={`Share ${ep.title} on WhatsApp`}
                className="p-2 text-body/60 hover:text-primary"
              >
                <Share2 size={17} />
              </a>
            </div>
          </li>
        ))}
      </ul>
      {limit < episodes.length && (
        <div className="text-center mt-6">
          <button type="button" onClick={() => setLimit(limit + 6)} className="btn-dark-eapn">
            Load more episodes
          </button>
        </div>
      )}
    </div>
  );
}
