'use client';

import Link from 'next/link';
import { useMemo, useState } from 'react';
import { Bell, Bookmark, Clock, Headphones, Rss } from 'lucide-react';
import { allEpisodes, shows } from '@/lib/data';
import { formatDate, formatDuration } from '@/lib/site';
import { usePlayer } from '@/lib/store';
import PlayEpisodeButton from './PlayEpisodeButton';

interface HistoryEntry {
  episodeSlug: string;
  position: number;
  duration: number;
  completed: boolean;
  at: string;
}

interface ServerHistory {
  entries: HistoryEntry[];
}

/**
 * Listener dashboard tabs: Listening History (resume playback), Saved Episodes,
 * Subscribed Shows (with unread badges), Notifications (new episodes per
 * subscribed show). Auth is enforced server-side (SSR) — this component also
 * merges the local player state.
 */
export default function Dashboard({
  session,
  serverHistory,
}: {
  session: { name?: string | null; email?: string | null } | null;
  serverHistory: HistoryEntry[];
}) {
  const [tab, setTab] = useState<'history' | 'saved' | 'shows' | 'notifications'>('history');
  const [history, setHistory] = useState<HistoryEntry[]>(serverHistory);

  const subscriptions = usePlayer((s) => s.subscriptions);
  const saved = usePlayer((s) => s.saved);
  const setEpisode = usePlayer((s) => s.setEpisode);

  const epBySlug = useMemo(() => {
    const m: Record<string, (typeof allEpisodes)[number]> = {};
    allEpisodes.forEach((e) => (m[e.slug] = e));
    return m;
  }, []);
  const showBySlug = useMemo(() => {
    const m: Record<string, (typeof shows)[number]> = {};
    shows.forEach((s) => (m[s.slug] = s));
    return m;
  }, []);

  // Local history (from the persistent player, this browser) merged with server
  const localHistory = useMemo<HistoryEntry[]>(() => {
    try {
      const raw = localStorage.getItem('eapn-history');
      return raw ? (JSON.parse(raw) as HistoryEntry[]) : [];
    } catch {
      return [];
    }
  }, [tab]); // refresh on tab switch

  const mergedHistory = useMemo(() => {
    const map = new Map<string, HistoryEntry>();
    [...localHistory, ...history].forEach((h) => {
      const prev = map.get(h.episodeSlug);
      if (!prev || new Date(h.at) > new Date(prev.at)) map.set(h.episodeSlug, h);
    });
    return [...map.values()]
      .filter((h) => epBySlug[h.episodeSlug])
      .sort((a, b) => (a.at < b.at ? 1 : -1))
      .slice(0, 30);
  }, [localHistory, history, epBySlug]);

  const unreadByShow = useMemo(() => {
    // "Unread" = episodes published in the last 10 days on a subscribed show
    const cutoff = Date.now() - 10 * 86400_000;
    const m: Record<string, number> = {};
    subscriptions.forEach((slug) => {
      m[slug] = allEpisodes.filter(
        (e) => e.showSlug === slug && new Date(e.publishedAt).getTime() > cutoff
      ).length;
    });
    return m;
  }, [subscriptions]);

  const notifications = useMemo(
    () =>
      allEpisodes
        .filter((e) => subscriptions.includes(e.showSlug))
        .sort((a, b) => (a.publishedAt < b.publishedAt ? 1 : -1))
        .slice(0, 12),
    [subscriptions]
  );

  // Write-through local history when playback state changes
  const playingSlug = usePlayer((s) => s.episode?.slug);
  const position = usePlayer((s) => s.position);
  const duration = usePlayer((s) => s.duration);
  useMemo(() => {
    if (!playingSlug) return;
    try {
      const raw = localStorage.getItem('eapn-history');
      const arr: HistoryEntry[] = raw ? JSON.parse(raw) : [];
      const next = [
        { episodeSlug: playingSlug, position, duration, completed: false, at: new Date().toISOString() },
        ...arr.filter((h) => h.episodeSlug !== playingSlug),
      ].slice(0, 50);
      localStorage.setItem('eapn-history', JSON.stringify(next));
    } catch {
      /* storage unavailable */
    }
  }, [playingSlug, Math.floor(position / 10)]); // eslint-disable-line react-hooks/exhaustive-deps

  const tabs = [
    { id: 'history', label: 'Listening History', Icon: Clock },
    { id: 'saved', label: 'Saved Episodes', Icon: Bookmark },
    { id: 'shows', label: 'Subscribed Shows', Icon: Rss },
    { id: 'notifications', label: 'Notifications', Icon: Bell },
  ] as const;

  return (
    <div>
      {/* Tabs */}
      <div className="flex gap-6 border-b border-line mb-8 overflow-x-auto" role="tablist" aria-label="Dashboard sections">
        {tabs.map(({ id, label, Icon }) => (
          <button
            key={id}
            type="button"
            role="tab"
            aria-selected={tab === id}
            onClick={() => setTab(id)}
            className={`flex items-center gap-2 pb-3 border-b-2 -mb-px text-[13px] uppercase tracking-[0.06em] whitespace-nowrap transition-colors ${
              tab === id ? 'border-primary text-primary font-normal' : 'border-transparent text-body hover:text-ink'
            }`}
          >
            <Icon size={15} /> {label}
            {id === 'shows' && subscriptions.length > 0 && (
              <span className="bg-primary text-white text-[10px] rounded-full px-1.5 py-0.5">{subscriptions.length}</span>
            )}
          </button>
        ))}
      </div>

      {/* History */}
      {tab === 'history' && (
        <section aria-label="Listening history">
          {mergedHistory.length === 0 && (
            <p className="text-body font-light py-8">Nothing here yet — press play on any episode and it will appear.</p>
          )}
          <div className="space-y-3">
            {mergedHistory.map((h) => {
              const ep = epBySlug[h.episodeSlug];
              const pct = h.duration ? Math.min(100, Math.round((h.position / h.duration) * 100)) : 0;
              return (
                <div key={h.episodeSlug} className="card-eapn p-4 flex items-center gap-4">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={ep.artwork} alt="" className="w-14 h-14 rounded-[4px] object-cover" />
                  <div className="flex-1 min-w-0">
                    <Link href={`/episodes/${ep.slug}`} className="text-[15px] text-ink hover:text-primary font-normal truncate block">
                      {ep.title}
                    </Link>
                    <p className="text-[12px] text-body/70 font-light">
                      {showBySlug[ep.showSlug]?.title} · {formatDuration(h.position)} / {formatDuration(h.duration || ep.duration)} · {pct}%
                    </p>
                    <div className="h-1 bg-line rounded-full mt-2 overflow-hidden">
                      <div className="h-full bg-primary" style={{ width: `${pct}%` }} />
                    </div>
                  </div>
                  <div className="flex items-center gap-2 shrink-0">
                    <PlayEpisodeButton episode={ep} size={30} />
                    {pct > 0 && pct < 95 && (
                      <button
                        type="button"
                        onClick={() => {
                          setEpisode(ep, true);
                          usePlayer.setState({ position: h.position });
                        }}
                        className="text-[11px] uppercase tracking-[0.1em] text-primary hover:underline whitespace-nowrap"
                      >
                        Resume
                      </button>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </section>
      )}

      {/* Saved */}
      {tab === 'saved' && (
        <section aria-label="Saved episodes">
          {saved.length === 0 && (
            <p className="text-body font-light py-8">No bookmarks yet — tap the bookmark icon on any episode to save it here.</p>
          )}
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {saved.filter((s) => epBySlug[s]).map((slug) => {
              const ep = epBySlug[slug];
              return (
                <div key={slug} className="card-eapn overflow-hidden group">
                  <Link href={`/episodes/${ep.slug}`} className="block aspect-video overflow-hidden">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img src={ep.artwork} alt="" className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105" />
                  </Link>
                  <div className="p-4">
                    <Link href={`/episodes/${ep.slug}`} className="text-[15px] font-normal text-ink hover:text-primary">
                      {ep.title}
                    </Link>
                    <p className="text-[12px] text-body/70 font-light">{showBySlug[ep.showSlug]?.title}</p>
                    <div className="mt-2">
                      <PlayEpisodeButton episode={ep} size={28} />
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </section>
      )}

      {/* Subscribed shows */}
      {tab === 'shows' && (
        <section aria-label="Subscribed shows">
          {subscriptions.length === 0 && (
            <p className="text-body font-light py-8">You have not subscribed to any shows yet. Browse shows and tap Subscribe.</p>
          )}
          <div className="grid sm:grid-cols-2 gap-4">
            {subscriptions.map((slug) => {
              const show = showBySlug[slug];
              if (!show) return null;
              const unread = unreadByShow[slug] ?? 0;
              return (
                <Link key={slug} href={`/shows/${slug}`} className="card-eapn p-4 flex items-center gap-4 hover:shadow-card transition-shadow">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={show.artwork} alt="" className="w-16 h-16 rounded-[4px] object-cover" />
                  <div className="flex-1 min-w-0">
                    <span className="text-[15px] text-ink font-normal block truncate">{show.title}</span>
                    <span className="text-[12px] text-body/70 font-light">
                      {show.category} · {show.episodes.length} episodes
                    </span>
                  </div>
                  {unread > 0 && (
                    <span className="bg-primary text-white text-[11px] font-normal rounded-full min-w-[22px] h-[22px] flex items-center justify-center px-1.5">
                      {unread} new
                    </span>
                  )}
                </Link>
              );
            })}
          </div>
        </section>
      )}

      {/* Notifications */}
      {tab === 'notifications' && (
        <section aria-label="Notifications">
          {notifications.length === 0 && (
            <p className="text-body font-light py-8">
              No new episodes to report. Subscribe to shows to get alerts when new episodes drop.
            </p>
          )}
          <ul className="space-y-3">
            {notifications.map((ep) => (
              <li key={ep.slug} className="card-eapn p-4 flex items-center gap-4">
                <span className="bg-primary/10 text-primary rounded-full w-9 h-9 flex items-center justify-center shrink-0">
                  <Bell size={16} />
                </span>
                <div className="flex-1 min-w-0">
                  <p className="text-[14px] text-ink font-normal">
                    New episode: <Link href={`/episodes/${ep.slug}`} className="hover:text-primary">{ep.title}</Link>
                  </p>
                  <p className="text-[12px] text-body/70 font-light">
                    {showBySlug[ep.showSlug]?.title} · {formatDate(ep.publishedAt)} · {formatDuration(ep.duration)}
                  </p>
                </div>
                <PlayEpisodeButton episode={ep} size={28} />
              </li>
            ))}
          </ul>
        </section>
      )}

      <p className="mt-10 text-[12px] text-body/60 font-light flex items-center gap-2">
        <Headphones size={13} className="text-primary" />
        {session
          ? `Signed in as ${session.email ?? session.name ?? 'listener'} — history syncs to your account.`
          : 'Demo mode — sign-in is not configured on this deployment, so history is stored on this device only.'}
      </p>
    </div>
  );
}
