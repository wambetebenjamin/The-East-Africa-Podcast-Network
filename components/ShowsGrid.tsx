'use client';

import { useMemo, useState } from 'react';
import { CATEGORIES } from '@/lib/types';
import type { Show } from '@/lib/types';
import ShowCard from './ShowCard';
import Reveal from './Reveal';

/**
 * Shows grid with category filter (Business, True Crime, Technology, Health,
 * Culture, Religion, Sports, Finance, Entertainment, Politics).
 * Cards stagger fade-up on scroll, 75ms apart. 4→3→2→1 columns responsive.
 */
export default function ShowsGrid({ shows, initialCategory = '' }: { shows: Show[]; initialCategory?: string }) {
  const [category, setCategory] = useState(initialCategory);

  const filtered = useMemo(
    () => (category ? shows.filter((s) => s.category === category) : shows),
    [shows, category]
  );

  return (
    <div>
      <div className="flex flex-wrap gap-2 justify-center mb-10" role="tablist" aria-label="Filter shows by category">
        <button
          type="button"
          role="tab"
          aria-selected={category === ''}
          onClick={() => setCategory('')}
          className={`px-4 py-1.5 rounded-full border text-[12px] uppercase tracking-[0.08em] transition-colors ${
            category === '' ? 'bg-primary border-primary text-white' : 'border-line text-body hover:border-primary hover:text-primary bg-white'
          }`}
        >
          All
        </button>
        {CATEGORIES.map((c) => (
          <button
            key={c}
            type="button"
            role="tab"
            aria-selected={category === c}
            onClick={() => setCategory(c)}
            className={`px-4 py-1.5 rounded-full border text-[12px] uppercase tracking-[0.08em] transition-colors ${
              category === c ? 'bg-primary border-primary text-white' : 'border-line text-body hover:border-primary hover:text-primary bg-white'
            }`}
          >
            {c}
          </button>
        ))}
      </div>

      <Reveal stagger={75} className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {filtered.map((s) => (
          <ShowCard key={s.slug} show={s} />
        ))}
      </Reveal>

      {filtered.length === 0 && (
        <p className="text-center text-body font-light py-16">No shows in this category yet.</p>
      )}
    </div>
  );
}
