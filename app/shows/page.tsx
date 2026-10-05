import type { Metadata } from 'next';
import { shows } from '@/lib/data';
import ShowsGrid from '@/components/ShowsGrid';
import Reveal from '@/components/Reveal';

export const metadata: Metadata = {
  title: 'Shows',
  description:
    'All The East Africa Podcast Network shows — business, true crime, technology, health, culture, religion, sports, finance, entertainment and politics.',
};

export default function ShowsPage({ searchParams }: { searchParams: { category?: string } }) {
  return (
    <>
      <header className="relative bg-night text-white bg-cover bg-center">
        <div className="absolute inset-0 bg-cover bg-center opacity-40" style={{ backgroundImage: "url('/images/hero-studio.jpg')" }} aria-hidden />
        <div className="relative max-w-container mx-auto px-4 py-16 md:py-24 text-center">
          <h1 className="text-white font-black text-[34px] md:text-[46px]">Our Shows</h1>
          <p className="text-white/70 font-light mt-3 max-w-xl mx-auto">
            Ten original East African shows. Filter by category and find your next listen.
          </p>
        </div>
      </header>
      <section className="site-section">
        <div className="max-w-container mx-auto px-4">
          <Reveal variant="fade">
            <ShowsGrid shows={shows} initialCategory={searchParams.category ?? ''} />
          </Reveal>
        </div>
      </section>
    </>
  );
}
