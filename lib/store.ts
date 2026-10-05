'use client';

import { create } from 'zustand';
import { createJSONStorage, persist } from 'zustand/middleware';
import type { Episode } from './types';

/**
 * Persistent audio-player state (survives page navigation via Zustand + localStorage).
 * The HTMLAudioElement itself lives in the AudioPlayer component / audio engine.
 */
interface PlayerState {
  episode: Episode | null;
  playing: boolean;
  position: number;
  duration: number;
  volume: number;
  muted: boolean;
  rate: number; // 0.75 | 1 | 1.25 | 1.5 | 2
  queue: string[]; // episode slugs
  subscriptions: string[]; // show slugs
  saved: string[]; // bookmarked episode slugs
  hasPlayedOnce: boolean; // player slide-up on first play

  setEpisode: (ep: Episode, autoplay?: boolean) => void;
  setPlaying: (playing: boolean) => void;
  togglePlay: () => void;
  setPosition: (position: number) => void;
  setDuration: (duration: number) => void;
  seekBy: (delta: number) => void;
  setVolume: (volume: number) => void;
  toggleMute: () => void;
  setRate: (rate: number) => void;
  playNext: () => void;
  addToQueue: (slug: string) => void;
  removeFromQueue: (slug: string) => void;
  toggleSubscription: (showSlug: string) => void;
  toggleSaved: (slug: string) => void;
}

interface PlayerActionsExtra {
  _autoplay?: boolean;
}

export const usePlayer = create<PlayerState & PlayerActionsExtra>()(
  persist(
    (set, get) => ({
      episode: null,
      playing: false,
      position: 0,
      duration: 0,
      volume: 0.9,
      muted: false,
      rate: 1,
      queue: [],
      subscriptions: [],
      saved: [],
      hasPlayedOnce: false,
      _autoplay: false,

      setEpisode: (ep, autoplay = true) => {
        set({ episode: ep, position: 0, duration: ep?.duration ?? 0, playing: autoplay, _autoplay: autoplay, hasPlayedOnce: true });
      },
      setPlaying: (playing) => set({ playing }),
      togglePlay: () => {
        const { episode, playing } = get();
        if (episode) set({ playing: !playing, hasPlayedOnce: true });
      },
      setPosition: (position) => set({ position }),
      setDuration: (duration) => set({ duration }),
      seekBy: (delta) => {
        const { position, duration } = get();
        set({ position: Math.min(Math.max(0, position + delta), duration || Infinity) });
      },
      setVolume: (volume) => set({ volume, muted: volume === 0 }),
      toggleMute: () => set((s) => ({ muted: !s.muted })),
      setRate: (rate) => set({ rate }),
      playNext: () => {
        const { queue, episode } = get();
        if (queue.length === 0) {
          set({ playing: false });
          return;
        }
        const [next, ...rest] = queue;
        // queue items are slugs; resolved by the AudioPlayer via a registry callback
        set({ queue: rest, _pendingQueueSlug: next } as never);
        void episode;
      },
      addToQueue: (slug) => {
        const { queue } = get();
        if (!queue.includes(slug)) set({ queue: [...queue, slug] });
      },
      removeFromQueue: (slug) => set((s) => ({ queue: s.queue.filter((q) => q !== slug) })),
      toggleSubscription: (showSlug) => {
        const { subscriptions } = get();
        set({
          subscriptions: subscriptions.includes(showSlug)
            ? subscriptions.filter((s) => s !== showSlug)
            : [...subscriptions, showSlug],
        });
      },
      toggleSaved: (slug) => {
        const { saved } = get();
        set({ saved: saved.includes(slug) ? saved.filter((s) => s !== slug) : [...saved, slug] });
      },
    }),
    {
      name: 'eapn-player',
      storage: createJSONStorage(() => localStorage),
      partialize: (s) => ({
        episode: s.episode,
        volume: s.volume,
        muted: s.muted,
        rate: s.rate,
        queue: s.queue,
        subscriptions: s.subscriptions,
        saved: s.saved,
        hasPlayedOnce: s.hasPlayedOnce,
        position: s.position,
      }),
    }
  )
);

/** Consume the queue-slug handoff from playNext() (used by AudioPlayer). */
export function takePendingQueueSlug(): string | null {
  const s = usePlayer.getState() as PlayerState & { _pendingQueueSlug?: string | null };
  const slug = (s as { _pendingQueueSlug?: string | null })._pendingQueueSlug ?? null;
  if (slug) usePlayer.setState({ _pendingQueueSlug: null } as never);
  return slug;
}

export const PLAYBACK_RATES = [0.75, 1, 1.25, 1.5, 2];
