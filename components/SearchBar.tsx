'use client';

import { useMemo, useState } from 'react';
import Link from 'next/link';
import { Search } from 'lucide-react';

/** Inline search bar (404 page) — searches shows + episodes client-side. */
export default function SearchBar() {
  const [q, setQ] = useState('');
  const [data, setData] = useState<{ shows: { slug: string; title: string }[]; episodes: { slug: string; title: string; showSlug: string }[] }>({ shows: [], episodes: [] });
  const [loaded, setLoaded] = useState(false);

  const onChange = (v: string) => {
    setQ(v);
    if (!loaded && v) {
      setLoaded(true);
      void fetch('/api/shows').then((r) => r.json()).then((d) => setData((p) => ({ ...p, shows: d.shows ?? p.shows }))).catch(() => undefined);
      void fetch('/api/episodes?limit=100').then((r) => r.json()).then((d) => setData((p) => ({ ...p, episodes: d.episodes ?? p.episodes }))).catch(() => undefined);
    }
  };

  const ql = q.trim().toLowerCase();
  const hits = useMemo(() => {
    if (!ql) return [];
    const showHits = data.shows.filter((s) => s.title.toLowerCase().includes(ql)).map((s) => ({ slug: s.slug, title: s.title, kind: 'show' as const }));
    const epHits = data.episodes.filter((e) => e.title.toLowerCase().includes(ql)).map((e) => ({ slug: e.slug, title: e.title, kind: 'episode' as const }));
    return [...showHits, ...epHits].slice(0, 6);
  }, [ql, data]);

  return (
    <div className="relative">
      <form
        onSubmit={(e) => {
          e.preventDefault();
          if (hits[0]) window.location.href = hits[0].kind === 'show' ? `/shows/${hits[0].slug}` : `/episodes/${hits[0].slug}`;
        }}
        role="search"
      >
        <label htmlFor="nf-search" className="sr-only">
          Search episodes and shows
        </label>
        <div className="flex">
          <span className="flex items-center pl-3 border border-white/20 border-r-0 rounded-l-btn text-white/50">
            <Search size={16} />
          </span>
          <input
            id="nf-search"
            value={q}
            onChange={(e) => onChange(e.target.value)}
            placeholder="Search episodes and shows…"
            className="flex-1 min-w-0 bg-night border border-white/20 border-l-0 rounded-r-btn h-[43px] px-3 text-white text-[14px] placeholder:text-white/40 outline-none focus:border-primary"
          />
        </div>
      </form>
      {ql && hits.length > 0 && (
        <ul className="absolute top-full mt-2 w-full bg-white rounded-[4px] shadow-card border border-line overflow-hidden text-left z-10">
          {hits.map((h) => (
            <li key={h.kind + h.slug}>
              <Link
                href={h.kind === 'show' ? `/shows/${h.slug}` : `/episodes/${h.slug}`}
                className="block px-4 py-2.5 text-[14px] text-ink hover:bg-menuhover"
              >
                <span className="text-[10px] uppercase tracking-[0.12em] text-primary mr-2">{h.kind}</span>
                {h.title}
              </Link>
            </li>
          ))}
        </ul>
      )}
      {ql && hits.length === 0 && (
        <p className="text-white/40 text-[13px] font-light mt-2">Nothing found for “{q}”.</p>
      )}
    </div>
  );
}
