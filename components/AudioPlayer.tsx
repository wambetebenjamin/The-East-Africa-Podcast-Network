'use client';

import Link from 'next/link';
import { useEffect, useRef, useState } from 'react';
import type WaveSurferType from 'wavesurfer.js';
import {
  Bookmark,
  Download,
  PauseCircle,
  PlayCircle,
  Rss,
  Share2,
  SkipBack,
  SkipForward,
  Volume2,
  VolumeX,
  X,
} from 'lucide-react';
import { audioEngine } from '@/lib/audio-engine';
import { PLAYBACK_RATES, usePlayer } from '@/lib/store';
import { formatDuration } from '@/lib/site';

/**
 * Persistent audio player pinned to the bottom of every page.
 * - HTML5 Audio (shared engine element) + wavesurfer.js waveform (≥480px).
 * - Progress bar with scrub, current time / total duration, play/pause,
 *   rewind 15s / skip 15s, volume slider + mute, playback speed (0.75x–2x),
 *   subscribe to current show, Share Episode, Add to Queue.
 * - State persists across navigation (Zustand + localStorage).
 * - Slides up from bottom over 400ms on first play; never overlaps page CTAs
 *   (a spacer reserves the bar height in the layout).
 */
export default function AudioPlayer() {
  const ep = usePlayer((s) => s.episode);
  const playing = usePlayer((s) => s.playing);
  const position = usePlayer((s) => s.position);
  const duration = usePlayer((s) => s.duration);
  const volume = usePlayer((s) => s.volume);
  const muted = usePlayer((s) => s.muted);
  const rate = usePlayer((s) => s.rate);
  const visible = usePlayer((s) => s.hasPlayedOnce && !!s.episode);
  const subscriptions = usePlayer((s) => s.subscriptions);
  const setPlaying = usePlayer((s) => s.setPlaying);
  const togglePlay = usePlayer((s) => s.togglePlay);
  const setPosition = usePlayer((s) => s.setPosition);
  const setDuration = usePlayer((s) => s.setDuration);
  const setVolume = usePlayer((s) => s.setVolume);
  const toggleMute = usePlayer((s) => s.toggleMute);
  const setRate = usePlayer((s) => s.setRate);
  const toggleSubscription = usePlayer((s) => s.toggleSubscription);
  const addToQueue = usePlayer((s) => s.addToQueue);
  const toggleSaved = usePlayer((s) => s.toggleSaved);
  const saved = usePlayer((s) => s.saved);

  const [speedOpen, setSpeedOpen] = useState(false);
  const [shareOpen, setShareOpen] = useState(false);
  const [dismissed, setDismissed] = useState(false);
  const lastSyncRef = useRef(0);

  // Load episode into the engine when the store's episode changes
  useEffect(() => {
    if (!ep) return;
    audioEngine.load(ep);
    const el = audioEngine.element();
    if (!el) return;
    el.volume = volume;
    el.muted = muted;
    el.playbackRate = rate;
    const onResume = () => {
      // restore position after metadata loads (rehydrate / new episode)
      const store = usePlayer.getState();
      if (store.position > 0 && Math.abs(el.currentTime - store.position) > 1.5) {
        audioEngine.seek(store.position);
      }
    };
    el.addEventListener('loadedmetadata', onResume, { once: true });
    return () => el.removeEventListener('loadedmetadata', onResume);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [ep?.slug]);

  // Play/pause sync (store → engine). Engine events update the store, so this
  // effect only acts when the mismatch came from a user action.
  useEffect(() => {
    const el = audioEngine.element();
    if (!el || !ep) return;
    if (playing && !audioEngine.isPlaying) audioEngine.play();
    if (!playing && audioEngine.isPlaying) audioEngine.pause();
  }, [playing, ep]);

  // Engine → store
  useEffect(() => {
    const offs = [
      audioEngine.on('time', (t) => {
        setPosition(t);
        lastSyncRef.current = t;
      }),
      audioEngine.on('duration', (d) => setDuration(d)),
      audioEngine.on('play', () => setPlaying(true)),
      audioEngine.on('pause', () => setPlaying(false)),
      audioEngine.on('ended', () => {
        setPlaying(false);
        setPosition(0);
      }),
    ];
    return () => offs.forEach((off) => off());
  }, [setPlaying, setPosition, setDuration]);

  // Volume / mute / rate
  useEffect(() => {
    const el = audioEngine.element();
    if (!el) return;
    el.volume = volume;
    el.muted = muted;
  }, [volume, muted]);

  useEffect(() => {
    const el = audioEngine.element();
    if (el) el.playbackRate = rate;
  }, [rate]);

  // UI-initiated seeks (scrub, ±15s): apply when the store position jumps
  // away from the engine position (timeupdate drift is <1s and ignored).
  useEffect(() => {
    const el = audioEngine.element();
    if (!el || !ep) return;
    if (Math.abs(el.currentTime - position) > 1.2) {
      audioEngine.seek(position);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [position]);

  // Save listening history (server, when signed in) on pause / unload
  useEffect(() => {
    if (!ep) return;
    const save = () => {
      const s = usePlayer.getState();
      if (!s.episode) return;
      void fetch('/api/listening-history', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          episodeSlug: s.episode.slug,
          position: Math.round(s.position),
          duration: Math.round(s.duration || s.episode.duration),
          completed: s.duration > 0 && s.position / s.duration > 0.9,
        }),
        keepalive: true,
      }).catch(() => undefined);
    };
    const onHide = () => save();
    window.addEventListener('pagehide', onHide);
    return () => {
      window.removeEventListener('pagehide', onHide);
    };
  }, [ep?.slug]); // eslint-disable-line react-hooks/exhaustive-deps

  const isCurrentSaved = ep ? saved.includes(ep.slug) : false;
  const subscribed = ep ? subscriptions.includes(ep.showSlug) : false;

  if (!ep || dismissed) return null;

  const show = ep ? ep.showSlug.replace(/-/g, ' ') : '';
  const pct = duration > 0 ? Math.min(100, (position / duration) * 100) : 0;

  const onScrub = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const frac = (e.clientX - rect.left) / rect.width;
    setPosition(frac * (duration || ep.duration));
  };

  const shareUrl = ep ? `${typeof window !== 'undefined' ? window.location.origin : ''}/episodes/${ep.slug}` : '';

  return (
    <div
      className={`player-panel ${visible ? 'visible' : ''} fixed inset-x-0 bottom-0 z-[55] bg-night text-white border-t border-white/10`}
      role="region"
      aria-label="Audio player"
    >
      {/* Progress (top edge) */}
      <div
        className="h-1 bg-white/10 cursor-pointer group"
        onClick={onScrub}
        role="slider"
        aria-label="Seek"
        aria-valuemin={0}
        aria-valuemax={Math.round(duration)}
        aria-valuenow={Math.round(position)}
      >
        <div className="h-full bg-primary relative" style={{ width: `${pct}%` }}>
          <span className="absolute -right-1.5 -top-1 w-3.5 h-3.5 rounded-full bg-primary opacity-0 group-hover:opacity-100 transition-opacity" />
        </div>
      </div>

      <div className="max-w-container mx-auto px-3 md:px-4">
        <div className="flex items-center gap-3 md:gap-4 h-[68px] md:h-[84px]">
          {/* Artwork + play (compact one-hand row on mobile) */}
          <button
            type="button"
            onClick={togglePlay}
            aria-label={playing ? 'Pause' : 'Play'}
            className="relative shrink-0"
          >
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={ep.artwork} alt="" className="w-11 h-11 md:w-14 md:h-14 rounded-[4px] object-cover" />
            <span className="absolute inset-0 flex items-center justify-center bg-night/40 rounded-[4px] transition-opacity md:opacity-0 md:hover:opacity-100">
              {playing ? <PauseCircle size={24} className="text-white" /> : <PlayCircle size={24} className="text-white" />}
            </span>
          </button>

          {/* Title */}
          <div className="min-w-0 flex-1 md:flex-none md:w-[240px] lg:w-[280px]">
            <Link href={`/episodes/${ep.slug}`} className="block truncate text-[13px] md:text-[14px] text-white hover:text-primary leading-snug">
              {ep.title}
            </Link>
            <span className="block truncate text-[11px] uppercase tracking-[0.08em] text-white/50">
              {show} · S{ep.season}E{ep.number}
            </span>
          </div>

          {/* Transport */}
          <div className="flex items-center gap-1 md:gap-2 shrink-0">
            <button
              type="button"
              aria-label="Rewind 15 seconds"
              onClick={() => usePlayer.getState().seekBy(-15)}
              className="p-2 text-white/70 hover:text-white"
            >
              <SkipBack size={18} />
            </button>
            <button
              type="button"
              aria-label={playing ? 'Pause' : 'Play'}
              onClick={togglePlay}
              className="p-2 text-primary hover:text-primary-dark"
            >
              {playing ? <PauseCircle size={30} /> : <PlayCircle size={30} />}
            </button>
            <button
              type="button"
              aria-label="Skip forward 15 seconds"
              onClick={() => usePlayer.getState().seekBy(15)}
              className="p-2 text-white/70 hover:text-white"
            >
              <SkipForward size={18} />
            </button>
          </div>

          {/* Waveform (desktop / ≥480px) + times */}
          <div className="hidden sm:flex flex-1 items-center gap-3 min-w-0 px-2">
            <span className="text-[11px] text-white/60 tabular-nums w-10 text-right">{formatDuration(position)}</span>
            <div className="flex-1 min-w-0 h-10">
              <MiniWaveform key={ep.slug} url={ep.audio} playing={playing} />
            </div>
            <span className="text-[11px] text-white/60 tabular-nums w-10">{formatDuration(duration || ep.duration)}</span>
          </div>

          {/* Right controls */}
          <div className="hidden md:flex items-center gap-1 shrink-0">
            {/* Volume */}
            <button type="button" aria-label={muted ? 'Unmute' : 'Mute'} onClick={toggleMute} className="p-2 text-white/70 hover:text-white">
              {muted || volume === 0 ? <VolumeX size={18} /> : <Volume2 size={18} />}
            </button>
            <input
              type="range"
              min={0}
              max={1}
              step={0.05}
              value={muted ? 0 : volume}
              onChange={(e) => setVolume(Number(e.target.value))}
              aria-label="Volume"
              className="w-16 accent-[#f23a2e]"
            />

            {/* Speed */}
            <div className="relative">
              <button
                type="button"
                onClick={() => setSpeedOpen((v) => !v)}
                aria-label="Playback speed"
                aria-expanded={speedOpen}
                className="px-2 py-1 text-[11px] font-normal border border-white/25 rounded-btn text-white/80 hover:text-white hover:border-white/50"
              >
                {rate}x
              </button>
              {speedOpen && (
                <div className="absolute bottom-full mb-2 right-0 bg-white text-ink rounded-[4px] shadow-dropdown border border-line py-1 w-16">
                  {PLAYBACK_RATES.map((r) => (
                    <button
                      key={r}
                      type="button"
                      onClick={() => {
                        setRate(r);
                        setSpeedOpen(false);
                      }}
                      className={`block w-full text-left px-3 py-1.5 text-[12px] hover:bg-menuhover ${r === rate ? 'text-primary font-normal' : ''}`}
                    >
                      {r}x
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Subscribe to current show */}
            <button
              type="button"
              onClick={() => toggleSubscription(ep.showSlug)}
              aria-pressed={subscribed}
              title={subscribed ? 'Unsubscribe from this show' : 'Subscribe to this show'}
              className={`p-2 ${subscribed ? 'text-primary' : 'text-white/70 hover:text-white'}`}
            >
              <Rss size={18} />
            </button>

            {/* Save */}
            <button
              type="button"
              onClick={() => toggleSaved(ep.slug)}
              aria-pressed={isCurrentSaved}
              title={isCurrentSaved ? 'Remove from saved episodes' : 'Save episode'}
              className={`p-2 ${isCurrentSaved ? 'text-primary' : 'text-white/70 hover:text-white'}`}
            >
              <Bookmark size={18} className={isCurrentSaved ? 'fill-current' : ''} />
            </button>

            {/* Add to queue */}
            <button
              type="button"
              onClick={() => addToQueue(ep.slug)}
              title="Add to queue"
              className="p-2 text-white/70 hover:text-white"
            >
              <Download size={18} className="rotate-90" />
            </button>

            {/* Share */}
            <div className="relative">
              <button
                type="button"
                onClick={() => setShareOpen((v) => !v)}
                aria-label="Share episode"
                className="p-2 text-white/70 hover:text-white"
              >
                <Share2 size={18} />
              </button>
              {shareOpen && (
                <div className="absolute bottom-full mb-2 right-0 bg-white text-ink rounded-[4px] shadow-dropdown border border-line py-1 w-44">
                  <a
                    href={`https://wa.me/?text=${encodeURIComponent(`${ep.title} — listen on EAPN: ${shareUrl}`)}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="block px-3 py-2 text-[12px] hover:bg-menuhover"
                  >
                    Share on WhatsApp
                  </a>
                  <button
                    type="button"
                    onClick={() => {
                      void navigator.clipboard?.writeText(shareUrl);
                      setShareOpen(false);
                    }}
                    className="block w-full text-left px-3 py-2 text-[12px] hover:bg-menuhover"
                  >
                    Copy link
                  </button>
                  <Link href={`/episodes/${ep.slug}`} className="block px-3 py-2 text-[12px] hover:bg-menuhover">
                    Episode page &amp; embed
                  </Link>
                </div>
              )}
            </div>

            <button
              type="button"
              aria-label="Close player"
              onClick={() => {
                audioEngine.pause();
                setDismissed(true);
              }}
              className="p-2 text-white/40 hover:text-white"
            >
              <X size={16} />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

/** Mini waveform bound to the shared engine element (hidden below 480px via parent). */
function MiniWaveform({ url, playing }: { url: string; playing: boolean }) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = audioEngine.element();
    if (!el || !ref.current) return;
    let ws: WaveSurferType | null = null;
    let cancelled = false;

    void (async () => {
      const WaveSurfer = (await import('wavesurfer.js')).default;
      if (cancelled || !ref.current) return;
      ws = WaveSurfer.create({
        container: ref.current,
        height: 36,
        waveColor: 'rgba(255,255,255,0.35)',
        progressColor: '#f23a2e',
        cursorColor: 'transparent',
        barWidth: 2,
        barGap: 2,
        barRadius: 2,
        media: el,
        url: audioEngine.absoluteUrl(url),
      });
    })();

    return () => {
      cancelled = true;
      ws?.destroy();
    };
  }, [url]);

  // Wavesurfer drives the shared element; nothing to sync on `playing`.
  void playing;

  return <div ref={ref} className="h-full w-full overflow-hidden" aria-hidden />;
}
