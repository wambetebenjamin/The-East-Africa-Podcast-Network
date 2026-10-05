'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useEffect, useMemo, useRef, useState } from 'react';
import { Menu, Search, X, Headphones } from 'lucide-react';
import { site } from '@/lib/site';
import type { Episode, Show } from '@/lib/types';

/**
 * Sticky navbar (zip look: transparent absolute over hero, white uppercase links,
 * hover/active #f23a2e). Center nav, logo left, search + Subscribe right.
 * Mobile: hamburger with full-screen overlay.
 */
export default function Navbar() {
  const pathname = usePathname();
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);

  const isHome = pathname === '/';
  const overHero = isHome && !scrolled;

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  useEffect(() => {
    setOpen(false);
    setSearchOpen(false);
  }, [pathname]);

  useEffect(() => {
    document.body.style.overflow = open || searchOpen ? 'hidden' : '';
    return () => {
      document.body.style.overflow = '';
    };
  }, [open, searchOpen]);

  return (
    <>
      <header
        className={`sticky top-0 z-50 w-full transition-colors duration-300 ${
          overHero ? 'bg-transparent' : 'bg-night/95 backdrop-blur border-b border-white/10'
        }`}
      >
        <div className="max-w-container mx-auto px-4">
          <div className="flex items-center justify-between h-[72px]">
            {/* Logo */}
            <Link href="/" className="flex items-center gap-2 shrink-0" aria-label={site.name}>
              <span className="flex items-end gap-[3px] h-5" aria-hidden>
                <i className="w-[4px] bg-primary rounded-sm" style={{ height: 8 }} />
                <i className="w-[4px] bg-primary rounded-sm" style={{ height: 18 }} />
                <i className="w-[4px] bg-primary rounded-sm" style={{ height: 12 }} />
                <i className="w-[4px] bg-primary rounded-sm" style={{ height: 20 }} />
                <i className="w-[4px] bg-primary rounded-sm" style={{ height: 10 }} />
              </span>
              <span className="leading-none">
                <span className={`block text-[15px] font-bold tracking-tight ${overHero ? 'text-white' : 'text-white'}`}>EAPN</span>
                <span className="block text-[11px] uppercase tracking-[0.18em] text-white/60 font-light">East Africa Podcasts</span>
              </span>
            </Link>

            {/* Center nav */}
            <nav className="hidden lg:flex items-center" aria-label="Primary">
              {site.nav.map((item) => {
                const active = item.href === '/' ? pathname === '/' : pathname.startsWith(item.href);
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    className={`uppercase text-[13px] tracking-[0.05em] px-3 py-2 text-white ${active ? 'text-primary' : 'hover:text-primary'}`}
                  >
                    {item.label}
                  </Link>
                );
              })}
            </nav>

            {/* Right */}
            <div className="flex items-center gap-2">
              <button
                type="button"
                aria-label="Search"
                onClick={() => setSearchOpen(true)}
                className="p-2.5 text-white hover:text-primary"
              >
                <Search size={19} />
              </button>
              <Link href="/#subscribe" className="btn-primary-eapn hidden sm:inline-flex !px-4 !py-2.5">
                Subscribe
              </Link>
              <button
                type="button"
                aria-label={open ? 'Close menu' : 'Open menu'}
                className="lg:hidden p-2.5 text-white hover:text-primary"
                onClick={() => setOpen((v) => !v)}
              >
                {open ? <X size={22} /> : <Menu size={22} />}
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Mobile full-screen overlay menu */}
      {open && (
        <div className="fixed inset-0 z-[60] bg-night flex flex-col lg:hidden" role="dialog" aria-label="Menu">
          <div className="flex justify-end p-4">
            <button type="button" aria-label="Close menu" className="p-2.5 text-white" onClick={() => setOpen(false)}>
              <X size={26} />
            </button>
          </div>
          <nav className="flex-1 overflow-y-auto px-8 pt-4" aria-label="Mobile">
            <ul className="space-y-1">
              {site.nav.map((item, i) => (
                <li key={item.href} style={{ animationDelay: `${i * 60}ms` }} className="eapn-menu-item">
                  <Link
                    href={item.href}
                    className={`block text-[22px] py-3 border-b border-white/10 ${
                      pathname === item.href ? 'text-primary' : 'text-white'
                    }`}
                  >
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
            <div className="py-8 space-y-3">
              <Link href="/dashboard" className="btn-light-eapn w-full !bg-white/10 !text-white !border-white/30">
                Listener Dashboard
              </Link>
              <Link href="/#subscribe" className="btn-primary-eapn w-full">
                Subscribe
              </Link>
            </div>
          </nav>
        </div>
      )}

      {searchOpen && <SearchOverlay onClose={() => setSearchOpen(false)} />}
    </>
  );
}

/** Full-screen search overlay — searches shows + episodes from the API. */
export function SearchOverlay({ onClose }: { onClose: () => void }) {
  const [q, setQ] = useState('');
  const [shows, setShows] = useState<Show[]>([]);
  const [episodes, setEpisodes] = useState<Episode[]>([]);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    inputRef.current?.focus();
    fetch('/api/shows')
      .then((r) => r.json())
      .then((d) => setShows(d.shows ?? []))
      .catch(() => undefined);
    fetch('/api/episodes?limit=100')
      .then((r) => r.json())
      .then((d) => setEpisodes(d.episodes ?? []))
      .catch(() => undefined);
  }, []);

  const ql = q.trim().toLowerCase();
  const showHits = useMemo(
    () => (ql ? shows.filter((s) => (s.title + s.host.name + s.category).toLowerCase().includes(ql)).slice(0, 5) : []),
    [ql, shows]
  );
  const epHits = useMemo(
    () => (ql ? episodes.filter((e) => (e.title + e.showSlug).toLowerCase().includes(ql)).slice(0, 6) : []),
    [ql, episodes]
  );

  return (
    <div className="fixed inset-0 z-[60] bg-night/97 backdrop-blur overflow-y-auto" role="dialog" aria-label="Search">
      <div className="max-w-2xl mx-auto px-4 pt-8 pb-16">
        <div className="flex items-center justify-between mb-8">
          <span className="flex items-center gap-2 text-white/60 text-[12px] uppercase tracking-[0.2em]">
            <Headphones size={16} className="text-primary" /> Search the network
          </span>
          <button type="button" onClick={onClose} aria-label="Close search" className="p-2.5 text-white hover:text-primary">
            <X size={24} />
          </button>
        </div>
        <input
          ref={inputRef}
          value={q}
          onChange={(e) => setQ(e.target.value)}
          placeholder="Search shows, hosts, episodes…"
          className="w-full bg-transparent border-b-2 border-white/20 focus:border-primary outline-none text-white text-2xl md:text-3xl font-light py-4 placeholder:text-white/30"
        />
        {ql && (
          <div className="mt-10 space-y-8">
            <section>
              <h3 className="text-[12px] uppercase tracking-[0.2em] text-white/50 mb-4">Shows</h3>
              {showHits.length === 0 && <p className="text-white/50 font-light">No shows match “{q}”.</p>}
              <ul className="space-y-2">
                {showHits.map((s) => (
                  <li key={s.slug}>
                    <Link href={`/shows/${s.slug}`} className="flex items-center gap-4 p-3 hover:bg-white/5 rounded-[4px] group">
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img src={s.artwork} alt="" className="w-12 h-12 rounded-[4px] object-cover" />
                      <span>
                        <span className="block text-white group-hover:text-primary">{s.title}</span>
                        <span className="block text-[12px] text-white/50">{s.category} · {s.host.name}</span>
                      </span>
                    </Link>
                  </li>
                ))}
              </ul>
            </section>
            <section>
              <h3 className="text-[12px] uppercase tracking-[0.2em] text-white/50 mb-4">Episodes</h3>
              {epHits.length === 0 && <p className="text-white/50 font-light">No episodes match “{q}”.</p>}
              <ul className="space-y-2">
                {epHits.map((e) => (
                  <li key={e.slug}>
                    <Link href={`/episodes/${e.slug}`} className="flex items-center gap-4 p-3 hover:bg-white/5 rounded-[4px] group">
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img src={e.artwork} alt="" className="w-12 h-12 rounded-[4px] object-cover" />
                      <span>
                        <span className="block text-white group-hover:text-primary">{e.title}</span>
                        <span className="block text-[12px] text-white/50">{e.showSlug.replace(/-/g, ' ')}</span>
                      </span>
                    </Link>
                  </li>
                ))}
              </ul>
            </section>
          </div>
        )}
        {!ql && (
          <p className="mt-10 text-white/40 font-light text-[14px]">
            Try “true crime”, “Wanjiru”, “football”, “health”…
          </p>
        )}
      </div>
    </div>
  );
}
