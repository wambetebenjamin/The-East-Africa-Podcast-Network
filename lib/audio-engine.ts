'use client';

/**
 * Single shared HTML5 Audio element ("the engine") driving every player UI:
 * the persistent bottom bar and the large episode-page waveform both attach
 * wavesurfer.js renderers to this one element (WaveSurfer v7 `media` option —
 * setSrc() no-ops when the element already has the same URL, so attaching is
 * side-effect free when URLs match exactly).
 */
import type { Episode } from './types';

type Events = {
  time: (position: number) => void;
  duration: (duration: number) => void;
  play: () => void;
  pause: () => void;
  ended: () => void;
  error: () => void;
};

type Listener<K extends keyof Events> = (payload: Parameters<Events[K]>[0]) => void;

class AudioEngine {
  private el: HTMLAudioElement | null = null;
  private listeners: { [K in keyof Events]: Set<Listener<K>> } = {
    time: new Set(),
    duration: new Set(),
    play: new Set(),
    pause: new Set(),
    ended: new Set(),
    error: new Set(),
  };
  currentSlug: string | null = null;

  element(): HTMLAudioElement | null {
    if (typeof window === 'undefined') return null;
    if (!this.el) {
      const el = new Audio();
      el.preload = 'metadata';
      el.crossOrigin = 'anonymous';
      const notifyPlay = () => this.emit('play', undefined);
      const notifyPause = () => this.emit('pause', undefined);
      const notifyTime = () => this.emit('time', el.currentTime);
      const notifyDuration = () => this.emit('duration', el.duration || 0);
      const notifyEnded = () => this.emit('ended', undefined);
      const notifyError = () => this.emit('error', undefined);
      el.addEventListener('play', notifyPlay);
      el.addEventListener('pause', notifyPause);
      el.addEventListener('timeupdate', notifyTime);
      el.addEventListener('seeking', notifyTime);
      el.addEventListener('loadedmetadata', notifyDuration);
      el.addEventListener('durationchange', notifyDuration);
      el.addEventListener('ended', notifyEnded);
      el.addEventListener('error', notifyError);
      this.el = el;
    }
    return this.el;
  }

  load(episode: Episode): void {
    const el = this.element();
    if (!el) return;
    if (this.currentSlug !== episode.slug) {
      this.currentSlug = episode.slug;
      el.src = episode.audio; // relative URL — resolves against origin
      el.load();
    }
  }

  absoluteUrl(audio: string): string {
    if (typeof window === 'undefined') return audio;
    return new URL(audio, window.location.origin).href;
  }

  play(): void {
    void this.el?.play().catch(() => undefined);
  }
  pause(): void {
    this.el?.pause();
  }
  seek(t: number): void {
    if (!this.el) return;
    const dur = this.el.duration || 0;
    this.el.currentTime = Math.min(Math.max(0, t), dur || t);
  }
  get position(): number {
    return this.el?.currentTime ?? 0;
  }
  get duration(): number {
    return this.el?.duration ?? 0;
  }
  get isPlaying(): boolean {
    return this.el ? !this.el.paused && !this.el.ended : false;
  }

  on<K extends keyof Events>(key: K, fn: Listener<K>): () => void {
    this.listeners[key].add(fn);
    return () => this.listeners[key].delete(fn);
  }

  private emit<K extends keyof Events>(key: K, payload: Parameters<Events[K]>[0]): void {
    this.listeners[key].forEach((fn) => fn(payload));
  }
}

export const audioEngine = new AudioEngine();
