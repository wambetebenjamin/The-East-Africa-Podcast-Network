'use client';

import { useEffect, useState } from 'react';
import { Phone } from 'lucide-react';
import { site } from '@/lib/site';
import { usePlayer } from '@/lib/store';

/**
 * Floating WhatsApp button — sits above the persistent audio player
 * (above the player bar on mobile). Colors from design source (#f23a2e on
 * brand night). Tooltip: "Suggest an episode or become a sponsor".
 */
export default function WhatsAppButton() {
  const hasEpisode = usePlayer((s) => s.hasPlayedOnce && !!s.episode);
  const [showTip, setShowTip] = useState(false);

  useEffect(() => {
    const t = setTimeout(() => setShowTip(true), 2500);
    const t2 = setTimeout(() => setShowTip(false), 8000);
    return () => {
      clearTimeout(t);
      clearTimeout(t2);
    };
  }, []);

  return (
    <div
      className="fixed right-4 z-[50] transition-all duration-300"
      style={{ bottom: hasEpisode ? 'calc(var(--eapn-player-h, 80px) + 16px)' : '24px' }}
    >
      {showTip && (
        <span className="absolute right-full mr-3 top-1/2 -translate-y-1/2 whitespace-nowrap bg-night text-white text-[12px] font-light px-3 py-2 rounded-[4px] shadow-card border border-white/10">
          Suggest an episode or become a sponsor
        </span>
      )}
      <a
        href={site.whatsappHello}
        target="_blank"
        rel="noopener noreferrer"
        aria-label="Suggest an episode or become a sponsor on WhatsApp"
        className="flex items-center justify-center w-13 h-13 rounded-full bg-primary text-white shadow-card hover:shadow-btn-hover hover:bg-primary-dark transition-all"
        style={{ width: 52, height: 52 }}
        onMouseEnter={() => setShowTip(true)}
        onMouseLeave={() => setShowTip(false)}
      >
        <Phone size={22} />
      </a>
    </div>
  );
}
