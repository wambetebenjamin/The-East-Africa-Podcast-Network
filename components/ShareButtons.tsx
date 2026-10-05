'use client';

import { useState } from 'react';
import { Check, Copy, MessageCircle } from 'lucide-react';

/**
 * Episode share actions: WhatsApp share with episode link, copy link,
 * embed code snippet.
 */
export default function ShareButtons({ episode, title }: { episode: { slug: string; title: string }; title?: string }) {
  const [copied, setCopied] = useState<'link' | 'embed' | null>(null);
  const [embedOpen, setEmbedOpen] = useState(false);

  const url =
    typeof window !== 'undefined' ? `${window.location.origin}/episodes/${episode.slug}` : `/episodes/${episode.slug}`;
  const embed = `<iframe src="${typeof window !== 'undefined' ? window.location.origin : ''}/episodes/${episode.slug}/embed" width="100%" height="180" frameborder="0" title="${episode.title} — The East Africa Podcast Network"></iframe>`;

  const copy = async (what: 'link' | 'embed') => {
    await navigator.clipboard?.writeText(what === 'link' ? url : embed);
    setCopied(what);
    setTimeout(() => setCopied(null), 2000);
  };

  return (
    <div className="space-y-3">
      <div className="flex flex-wrap gap-2">
        <a
          href={`https://wa.me/?text=${encodeURIComponent(`${title ?? episode.title} — listen on The East Africa Podcast Network: ${url}`)}`}
          target="_blank"
          rel="noopener noreferrer"
          className="btn-light-eapn"
        >
          <MessageCircle size={14} className="text-primary" /> Share Episode on WhatsApp
        </a>
        <button type="button" onClick={() => void copy('link')} className="btn-light-eapn">
          {copied === 'link' ? <Check size={14} className="text-primary" /> : <Copy size={14} />}{' '}
          {copied === 'link' ? 'Copied' : 'Copy link'}
        </button>
        <button type="button" onClick={() => setEmbedOpen((v) => !v)} className="btn-light-eapn" aria-expanded={embedOpen}>
          &lt;/&gt; Embed code
        </button>
      </div>
      {embedOpen && (
        <div>
          <textarea
            readOnly
            value={embed}
            onFocus={(e) => e.currentTarget.select()}
            className="field !h-auto font-mono text-[12px] p-3 bg-section/30"
            rows={3}
            aria-label="Embed code"
          />
          <button type="button" onClick={() => void copy('embed')} className="text-[12px] uppercase tracking-[0.1em] text-primary hover:underline mt-1">
            {copied === 'embed' ? 'Copied!' : 'Copy embed code'}
          </button>
        </div>
      )}
    </div>
  );
}
