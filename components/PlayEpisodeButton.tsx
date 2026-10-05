'use client';

import { PauseCircle, PlayCircle } from 'lucide-react';
import { audioEngine } from '@/lib/audio-engine';
import { usePlayer } from '@/lib/store';
import type { Episode } from '@/lib/types';

/** Play/pause trigger used on episode rows, cards and hero. */
export default function PlayEpisodeButton({
  episode,
  size = 34,
  className = '',
  label,
}: {
  episode: Episode;
  size?: number;
  className?: string;
  label?: string;
}) {
  const currentSlug = usePlayer((s) => s.episode?.slug);
  const playing = usePlayer((s) => s.playing);
  const setEpisode = usePlayer((s) => s.setEpisode);
  const togglePlay = usePlayer((s) => s.togglePlay);

  const isCurrent = currentSlug === episode.slug;
  const isPlaying = isCurrent && playing;

  return (
    <button
      type="button"
      aria-label={label ?? (isPlaying ? `Pause ${episode.title}` : `Play ${episode.title}`)}
      onClick={(e) => {
        e.preventDefault();
        e.stopPropagation();
        if (!isCurrent) {
          audioEngine.load(episode);
          setEpisode(episode, true);
        } else {
          togglePlay();
        }
      }}
      className={`text-primary hover:text-primary-dark transition-colors ${className}`}
    >
      {isPlaying ? <PauseCircle size={size} /> : <PlayCircle size={size} />}
    </button>
  );
}
