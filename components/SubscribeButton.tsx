'use client';

import { useEffect, useState } from 'react';
import { Rss } from 'lucide-react';
import { usePlayer } from '@/lib/store';
import { getShow } from '@/lib/data';

/**
 * Subscribe button — optimistic local subscribe (persisted) + POST
 * /api/subscribe/[showSlug] which records it in Vercel KV.
 */
export default function SubscribeButton({ showSlug, dark = false }: { showSlug: string; dark?: boolean }) {
  const subscriptions = usePlayer((s) => s.subscriptions);
  const toggle = usePlayer((s) => s.toggleSubscription);
  const [serverCount, setServerCount] = useState<number | null>(null);

  const subscribed = subscriptions.includes(showSlug);
  const show = getShow(showSlug);

  useEffect(() => {
    void fetch(`/api/subscribe/${showSlug}`)
      .then((r) => r.json())
      .then((d) => setServerCount(d.subscribers ?? null))
      .catch(() => undefined);
  }, [showSlug]);

  const onToggle = () => {
    toggle(showSlug);
    void fetch(`/api/subscribe/${showSlug}`, { method: 'POST' }).catch(() => undefined);
  };

  return (
    <div className="inline-flex flex-col">
      <button
        type="button"
        onClick={onToggle}
        aria-pressed={subscribed}
        className={subscribed ? (dark ? 'btn-light-eapn !bg-primary !text-white !border-primary' : 'btn-primary-eapn') : dark ? 'btn-primary-eapn' : 'btn-primary-eapn'}
      >
        <Rss size={14} /> {subscribed ? 'Subscribed' : 'Subscribe'}
      </button>
      {(serverCount ?? show?.subscribers) !== undefined && (
        <span className="text-[11px] text-body/60 font-light mt-1.5">
          {new Intl.NumberFormat('en-KE').format((serverCount ?? show?.subscribers) as number)} subscribers
        </span>
      )}
    </div>
  );
}
