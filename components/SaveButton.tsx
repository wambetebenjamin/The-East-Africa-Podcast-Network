'use client';

import { Bookmark } from 'lucide-react';
import { usePlayer } from '@/lib/store';

/** Bookmark (save) an episode — appears in the dashboard Saved Episodes tab. */
export default function SaveButton({ episodeSlug }: { episodeSlug: string }) {
  const saved = usePlayer((s) => s.saved);
  const toggleSaved = usePlayer((s) => s.toggleSaved);
  const isSaved = saved.includes(episodeSlug);

  return (
    <button
      type="button"
      onClick={() => toggleSaved(episodeSlug)}
      aria-pressed={isSaved}
      className={`btn-light-eapn w-full ${isSaved ? '!bg-primary !text-white !border-primary' : ''}`}
    >
      <Bookmark size={14} className={isSaved ? 'fill-current' : ''} />
      {isSaved ? 'Saved' : 'Save Episode'}
    </button>
  );
}
