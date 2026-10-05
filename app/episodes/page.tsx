import type { Metadata } from 'next';
import { allEpisodes, shows } from '@/lib/data';
import EpisodeFeed from '@/components/EpisodeFeed';
import Reveal from '@/components/Reveal';

export const metadata: Metadata = {
  title: 'Episodes',
  description: 'The latest episodes from every show on The East Africa Podcast Network.',
};

export default function EpisodesPage() {
  const showOptions = shows.map((s) => ({ slug: s.slug, title: s.title, category: s.category }));

  return (
    <>
      <header className="relative bg-night text-white">
        <div className="absolute inset-0 bg-cover bg-center opacity-40" style={{ backgroundImage: "url('/images/about-mix.jpg')" }} aria-hidden />
        <div className="relative max-w-container mx-auto px-4 py-16 md:py-24 text-center">
          <h1 className="text-white font-black text-[34px] md:text-[46px]">Latest Episodes</h1>
          <p className="text-white/70 font-light mt-3 max-w-xl mx-auto">
            Every new episode across the network — filter by show or category.
          </p>
        </div>
      </header>
      <section className="site-section">
        <div className="max-w-container mx-auto px-4">
          <Reveal variant="fade">
            <EpisodeFeed episodes={allEpisodes} showOptions={showOptions} pageSize={8} />
          </Reveal>
        </div>
      </section>
    </>
  );
}
