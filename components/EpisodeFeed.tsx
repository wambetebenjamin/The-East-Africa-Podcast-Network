'use client';

import { useMemo, useState } from 'react';
import { CATEGORIES } from '@/lib/types';
import type { Episode } from '@/lib/types';
import EpisodeRow from './EpisodeRow';
import Reveal from './Reveal';

/**
 * Latest episodes feed — reverse chronological, filter by show or category,
 * load-more pagination. Rows fade in from the left on scroll (50ms stagger).
 */
export default function EpisodeFeed({
  episodes,
  showOptions,
  initialCategory = '',
  pageSize = 8,
}: {
  episodes: Episode[];
  showOptions: { slug: string; title: string; category: string }[];
  initialCategory?: string;
  pageSize?: number;
}) {
  const [show, setShow] = useState('');
  const [category, setCategory] = useState(initialCategory);
  const [limit, setLimit] = useState(pageSize);

  const byShow = useMemo(() => {
    const m: Record<string, { title: string; category: string }> = {};
    showOptions.forEach((s) => (m[s.slug] = { title: s.title, category: s.category }));
    return m;
  }, [showOptions]);

  const filtered = useMemo(
    () =>
      episodes.filter(
        (e) => (!show || e.showSlug === show) && (!category || byShow[e.showSlug]?.category === category)
      ),
    [episodes, show, category, byShow]
  );
  const visible = filtered.slice(0, limit);

  return (
    <div>
      <div className="flex flex-col md:flex-row md:items-end gap-4 mb-8">
        <div className="flex-1">
          <label htmlFor="feed-show" className="field-label">
            Filter by show
          </label>
          <select
            id="feed-show"
            value={show}
            onChange={(e) => {
              setShow(e.target.value);
              setLimit(pageSize);
            }}
            className="field"
          >
            <option value="">All shows</option>
            {showOptions.map((s) => (
              <option key={s.slug} value={s.slug}>
                {s.title}
              </option>
            ))}
          </select>
        </div>
        <div className="flex-1">
          <label htmlFor="feed-cat" className="field-label">
            Filter by category
          </label>
          <select
            id="feed-cat"
            value={category}
            onChange={(e) => {
              setCategory(e.target.value);
              setLimit(pageSize);
            }}
            className="field"
          >
            <option value="">All categories</option>
            {CATEGORIES.map((c) => (
              <option key={c} value={c}>
                {c}
              </option>
            ))}
          </select>
        </div>
      </div>

      <Reveal variant="fade-left" stagger={50} className="space-y-5">
        {visible.map((e) => (
          <EpisodeRow key={e.slug} episode={e} showTitle={byShow[e.showSlug]?.title ?? e.showSlug} />
        ))}
      </Reveal>

      {visible.length === 0 && (
        <p className="text-body font-light text-center py-16">
          No episodes match those filters yet — try another category.
        </p>
      )}

      {limit < filtered.length && (
        <div className="text-center mt-10">
          <button type="button" onClick={() => setLimit(limit + pageSize)} className="btn-dark-eapn">
            Load more episodes
          </button>
        </div>
      )}
    </div>
  );
}
