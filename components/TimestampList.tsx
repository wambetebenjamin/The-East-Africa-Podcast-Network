'use client';

import { audioEngine } from '@/lib/audio-engine';
import { usePlayer } from '@/lib/store';
import { formatDuration } from '@/lib/site';
import type { Episode } from '@/lib/types';

/**
 * Clickable timestamps — clicking loads the episode (if needed) and seeks
 * the persistent player to that moment.
 */
export default function TimestampList({ episode, timestamps }: { episode: Episode; timestamps: { start: number; title: string }[] }) {
  const currentSlug = usePlayer((s) => s.episode?.slug);
  const setEpisode = usePlayer((s) => s.setEpisode);

  const seekTo = (t: number) => {
    if (currentSlug !== episode.slug) {
      setEpisode(episode, false);
      // wait for the element to load before seeking
      const el = audioEngine.element();
      const onMeta = () => {
        audioEngine.seek(t);
        usePlayer.setState({ position: t });
        el?.removeEventListener('loadedmetadata', onMeta);
      };
      el?.addEventListener('loadedmetadata', onMeta);
    } else {
      audioEngine.seek(t);
      usePlayer.setState({ position: t });
    }
  };

  return (
    <ol className="space-y-1">
      {timestamps.map((ts, i) => (
        <li key={i}>
          <button
            type="button"
            onClick={() => seekTo(ts.start)}
            className="w-full flex items-center gap-4 px-3 py-2 rounded-[4px] hover:bg-menuhover text-left group"
          >
            <span className="text-primary text-[13px] tabular-nums font-light w-12 shrink-0 group-hover:underline">
              {formatDuration(ts.start)}
            </span>
            <span className="text-[14px] text-body font-light group-hover:text-ink">{ts.title}</span>
          </button>
        </li>
      ))}
    </ol>
  );
}
