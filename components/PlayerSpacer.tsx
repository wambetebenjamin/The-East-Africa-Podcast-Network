'use client';

import { useEffect, useState } from 'react';
import { usePlayer } from '@/lib/store';

/**
 * Reserves space at the bottom of the page so the fixed audio player never
 * covers page CTAs or footer content on any screen size.
 */
export default function PlayerSpacer() {
  const visible = usePlayer((s) => s.hasPlayedOnce && !!s.episode);
  const [h, setH] = useState(84);

  useEffect(() => {
    const update = () => setH(window.innerWidth < 768 ? 69 : 85);
    update();
    window.addEventListener('resize', update);
    return () => window.removeEventListener('resize', update);
  }, []);

  if (!visible) return null;
  return <div aria-hidden style={{ height: h }} />;
}
