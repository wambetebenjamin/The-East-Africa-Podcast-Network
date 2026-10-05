import Link from 'next/link';
import { BarChart2, Headphones, Mic } from 'lucide-react';
import { featuredEpisode, shows } from '@/lib/data';
import { formatNumber } from '@/lib/site';
import Hero from '@/components/Hero';
import Reveal from '@/components/Reveal';
import EpisodeFeed from '@/components/EpisodeFeed';
import ShowsGrid from '@/components/ShowsGrid';
import NewsletterForm from '@/components/NewsletterForm';

export default function HomePage() {
  const showOptions = shows.map((s) => ({ slug: s.slug, title: s.title, category: s.category }));
  const episodes = shows.flatMap((s) => s.episodes).sort((a, b) => (a.publishedAt < b.publishedAt ? 1 : -1));
  const hosts = shows.map((s) => s.host);

  return (
    <>
      <Hero featured={featuredEpisode} />

      {/* Latest episodes feed */}
      <section className="site-section bg-section/45" aria-label="Latest episodes">
        <div className="max-w-container mx-auto px-4">
          <Reveal className="text-center mb-10">
            <h2 className="section-heading centered font-bold">Latest Episodes</h2>
          </Reveal>
          <Reveal variant="fade">
            <EpisodeFeed episodes={episodes} showOptions={showOptions} pageSize={6} />
          </Reveal>
        </div>
      </section>

      {/* Shows */}
      <section className="site-section" aria-label="Our shows">
        <div className="max-w-container mx-auto px-4">
          <Reveal className="text-center mb-4">
            <h2 className="section-heading centered font-bold">Our Shows</h2>
          </Reveal>
          <Reveal variant="fade" className="text-center mb-10">
            <p className="text-body font-light max-w-2xl mx-auto">
              Ten original shows across business, culture, true crime, technology, health, faith,
              sports, finance, entertainment and politics.
            </p>
          </Reveal>
          <ShowsGrid shows={shows} />
          <Reveal className="text-center mt-10">
            <Link href="/shows" className="btn-dark-eapn">
              <Headphones size={15} /> Browse All Shows
            </Link>
          </Reveal>
        </div>
      </section>

      {/* Behind the mic — hosts (zip team-member style) */}
      <section className="site-section bg-section/45" aria-label="Behind the mic">
        <div className="max-w-container mx-auto px-4">
          <Reveal className="text-center mb-10">
            <h2 className="section-heading centered font-bold">Behind The Mic</h2>
          </Reveal>
          <Reveal stagger={75} className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-6">
            {hosts.map((h) => (
              <Link key={h.slug} href="/about" className="group relative block overflow-hidden rounded-[4px] aspect-square">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={h.photo}
                  alt={h.name}
                  className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-110"
                />
                <span className="absolute inset-0 bg-primary/80 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center p-4 text-center">
                  <span>
                    <span className="block text-white text-[16px] font-normal">{h.name}</span>
                    <span className="block text-white/85 text-[12px] font-light mt-1">{h.role}</span>
                  </span>
                </span>
              </Link>
            ))}
          </Reveal>
        </div>
      </section>

      {/* For advertisers strip */}
      <section className="relative bg-night text-white" aria-label="For advertisers">
        <div
          className="absolute inset-0 bg-cover bg-center opacity-30"
          style={{ backgroundImage: "url('/images/about-mix.jpg')" }}
          aria-hidden
        />
        <div className="relative max-w-container mx-auto px-4 py-16 md:py-20 text-center">
          <Reveal>
            <p className="text-primary uppercase tracking-[0.25em] text-[12px] font-light mb-4">For Advertisers</p>
            <h2 className="text-white font-black text-[28px] md:text-[38px] leading-tight max-w-2xl mx-auto">
              Put your brand inside East Africa’s most-listened conversations.
            </h2>
            <p className="text-white/70 font-light mt-4 max-w-xl mx-auto">
              250,000+ monthly listeners across 10 shows. Host-read mid-rolls, show partnerships and
              network-wide branded content — from KES 25,000.
            </p>
            <div className="flex flex-wrap justify-center gap-4 mt-8">
              <Link href="/advertise" className="btn-primary-eapn">
                <BarChart2 size={15} /> See Sponsorship Packages
              </Link>
              <Link href="/guest" className="btn-outline-eapn">
                <Mic size={15} /> Become a Guest
              </Link>
            </div>
          </Reveal>
        </div>
      </section>

      {/* Subscribe band (zip inner-page-cover style) */}
      <section
        id="subscribe"
        className="relative bg-night bg-cover bg-center text-white text-center"
        style={{ backgroundImage: "url('/images/hero-studio.jpg')" }}
        aria-label="Newsletter"
      >
        <div className="absolute inset-0 bg-black/60" aria-hidden />
        <div className="relative max-w-container mx-auto px-4 py-20 md:py-28">
          <Reveal>
            <h2 className="text-white font-black text-[30px] md:text-[40px] mb-3">Subscribe</h2>
            <p className="text-white/70 font-light text-[16px] mb-8 max-w-md mx-auto">
              New episodes delivered to your inbox every week.
            </p>
            <NewsletterForm />
            <p className="text-white/40 text-[12px] font-light mt-6">
              {formatNumber(65000)} subscribers · unsubscribe anytime
            </p>
          </Reveal>
        </div>
      </section>
    </>
  );
}
