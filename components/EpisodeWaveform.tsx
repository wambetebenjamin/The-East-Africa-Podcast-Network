'use client';

import { useEffect, useRef, useState } from 'react';
import type WaveSurferType from 'wavesurfer.js';
import { PauseCircle, PlayCircle } from 'lucide-react';
import { audioEngine } from '@/lib/audio-engine';
import { usePlayer } from '@/lib/store';
import { formatDuration } from '@/lib/site';
import type { Episode } from '@/lib/types';

/**
 * Large waveform player for the episode detail page.
 * - Wavesurfer.js renderer bound to the shared engine element (draws in from
 *   left on load via .waveform-draw).
 * - If the shared element is not currently on this episode, a preview state
 *   with a play button loads it first (store.setEpisode), then binds.
 */
export default function EpisodeWaveform({ episode }: { episode: Episode }) {
  const currentSlug = usePlayer((s) => s.episode?.slug);
  const playing = usePlayer((s) => s.playing);
  const position = usePlayer((s) => s.position);
  const duration = usePlayer((s) => s.duration);
  const setEpisode = usePlayer((s) => s.setEpisode);
  const togglePlay = usePlayer((s) => s.togglePlay);

  const isCurrent = currentSlug === episode.slug;
  const ref = useRef<HTMLDivElement>(null);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    if (!isCurrent || !ref.current) return;
    const el = audioEngine.element();
    if (!el) return;
    let ws: WaveSurferType | null = null;
    let cancelled = false;

    void (async () => {
      const WaveSurfer = (await import('wavesurfer.js')).default;
      if (cancelled || !ref.current) return;
      ws = WaveSurfer.create({
        container: ref.current,
        height: 96,
        waveColor: 'rgba(37,38,42,0.25)',
        progressColor: '#f23a2e',
        cursorColor: '#25262a',
        cursorWidth: 1,
        barWidth: 3,
        barGap: 2,
        barRadius: 3,
        media: el,
        url: audioEngine.absoluteUrl(episode.audio),
      });
      ws.on('ready', () => setReady(true));
      // draw-in from left on load
      ref.current?.classList.add('waveform-draw');
    })();

    return () => {
      cancelled = true;
      setReady(false);
      ws?.destroy();
    };
  }, [isCurrent, episode.audio]);

  const dur = isCurrent && duration ? duration : episode.duration;
  const pos = isCurrent ? position : 0;

  return (
    <div className="card-eapn p-5 md:p-6">
      <div className="flex items-center gap-4 md:gap-6">
        <button
          type="button"
          aria-label={isCurrent && playing ? 'Pause' : 'Play'}
          onClick={() => {
            if (!isCurrent) setEpisode(episode, true);
            else togglePlay();
          }}
          className="text-primary hover:text-primary-dark shrink-0"
        >
          {isCurrent && playing ? <PauseCircle size={56} /> : <PlayCircle size={56} />}
        </button>
        <div className="flex-1 min-w-0">
          <div ref={ref} className={`h-24 ${ready || !isCurrent ? '' : 'opacity-40'}`} aria-hidden>
            {!isCurrent && <StaticWave />}
          </div>
          <div className="flex justify-between text-[12px] text-body font-light tabular-nums mt-2">
            <span>{formatDuration(pos)}</span>
            <span>{formatDuration(dur)}</span>
          </div>
        </div>
      </div>
      {!isCurrent && (
        <p className="text-[12px] text-body/70 font-light mt-1">
          Press play to load this episode into the network player — it keeps playing as you browse.
        </p>
      )}
    </div>
  );
}

/** Decorative static waveform preview before the episode is loaded. */
function StaticWave() {
  const bars = useRef<number[]>([]);
  if (bars.current.length === 0) {
    // deterministic pseudo-waveform
    const seedBar = (i: number) => 20 + Math.round(28 * Math.abs(Math.sin(i * 1.7) * Math.cos(i * 0.6)));
    for (let i = 0; i < 64; i++) bars.current.push(seedBar(i));
  }
  return (
    <div className="flex items-center gap-[3px] h-24" aria-hidden>
      {bars.current.map((h, i) => (
        <span key={i} className="w-[3px] rounded-sm bg-ink/15" style={{ height: `${h}%` }} />
      ))}
    </div>
  );
}
