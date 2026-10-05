import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { Calendar, Clock, Download, Headphones, Mic, PlayCircle, Share2 } from 'lucide-react';
import { getShow, shows } from '@/lib/data';
import { site, formatDate, formatDuration, formatNumber, whatsappLink } from '@/lib/site';
import Reveal from '@/components/Reveal';
import ShowEpisodeList from '@/components/ShowEpisodeList';
import SubscribeButton from '@/components/SubscribeButton';
import JsonLd from '@/components/JsonLd';

export const revalidate = 300;

export function generateStaticParams() {
  return shows.map((s) => ({ slug: s.slug }));
}

export function generateMetadata({ params }: { params: { slug: string } }): Metadata {
  const show = getShow(params.slug);
  if (!show) return { title: 'Show not found' };
  return {
    title: show.title,
    description: show.description,
    openGraph: {
      title: `${show.title} — ${show.tagline}`,
      description: show.description,
      images: [{ url: show.artwork, width: 900, height: 900, alt: show.title }],
      type: 'website',
    },
  };
}

export default async function ShowPage({ params }: { params: { slug: string } }) {
  const show = getShow(params.slug);
  if (!show) notFound();

  const related = shows.filter((s) => s.slug !== show.slug && s.category === show.category)
    .concat(shows.filter((s) => s.slug !== show.slug && s.category !== show.category))
    .slice(0, 4);

  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'PodcastSeries',
    name: show.title,
    description: show.description,
    url: `${site.url}/shows/${show.slug}`,
    image: `${site.url}${show.artwork}`,
    inLanguage: 'en',
    author: { '@type': 'Person', name: show.host.name },
    provider: { '@type': 'Organization', name: site.name },
    genre: show.category,
  };

  return (
    <>
      <JsonLd data={jsonLd} />

      {/* Full-width show banner */}
      <header className="relative bg-night text-white">
        <div className="absolute inset-0 bg-cover bg-center opacity-35" style={{ backgroundImage: `url('${show.banner}')` }} aria-hidden />
        <div className="absolute inset-0 bg-gradient-to-t from-night via-night/60 to-transparent" aria-hidden />
        <div className="relative max-w-container mx-auto px-4 pt-12 pb-10 md:pt-16 md:pb-14">
          <div className="flex flex-col md:flex-row gap-8 items-start">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={show.artwork} alt={`${show.title} artwork`} className="w-40 h-40 md:w-52 md:h-52 rounded-[4px] shadow-card object-cover" />
            <div className="flex-1 min-w-0">
              <p className="text-primary uppercase tracking-[0.2em] text-[12px] font-light mb-2">{show.category}</p>
              <h1 className="text-white font-black text-[30px] md:text-[44px] leading-tight">{show.title}</h1>
              <p className="text-white/70 font-light text-[16px] mt-2">{show.tagline}</p>
              <p className="text-white/60 text-[13px] font-light mt-4">
                Hosted by <span className="text-white">{show.host.name}</span> · {show.episodes.length} episodes ·{' '}
                {formatNumber(show.subscribers)} subscribers
              </p>
              <div className="flex flex-wrap gap-3 mt-6">
                <SubscribeButton showSlug={show.slug} />
                <a
                  href={whatsappLink(`Hello! I'm listening to ${show.title} on EAPN.`)}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="btn-outline-eapn"
                >
                  <Share2 size={14} /> Share
                </a>
                <a href={show.spotifyUrl} target="_blank" rel="noopener noreferrer" className="btn-light-eapn !text-white !bg-white/10 !border-white/30">
                  Spotify
                </a>
                <a href={show.appleUrl} target="_blank" rel="noopener noreferrer" className="btn-light-eapn !text-white !bg-white/10 !border-white/30">
                  Apple Podcasts
                </a>
              </div>
            </div>
          </div>
        </div>
      </header>

      <section className="site-section">
        <div className="max-w-container mx-auto px-4">
          <div className="grid lg:grid-cols-[1fr_320px] gap-10">
            <div>
              <Reveal>
                <h2 className="section-heading font-bold mb-6">About this show</h2>
                {show.longDescription.map((p, i) => (
                  <p key={i} className="text-[16px] font-light text-body leading-[1.85] mb-5">
                    {p}
                  </p>
                ))}
              </Reveal>

              <Reveal className="mt-12">
                <h2 className="section-heading font-bold mb-6">Episodes</h2>
                <ShowEpisodeList episodes={show.episodes} />
              </Reveal>
            </div>

            {/* Host profile */}
            <aside className="space-y-6">
              <Reveal variant="fade-left">
                <div className="card-eapn p-6 text-center">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={show.host.photo} alt={show.host.name} className="w-24 h-24 rounded-full object-cover mx-auto mb-4" />
                  <h3 className="text-[18px] font-normal text-ink">{show.host.name}</h3>
                  <p className="text-[12px] uppercase tracking-[0.1em] text-primary font-light mt-1 mb-4">{show.host.role}</p>
                  <p className="text-[14px] font-light text-body">{show.host.bio}</p>
                </div>
              </Reveal>
              <Reveal variant="fade-left">
                <div className="card-eapn p-6">
                  <h3 className="text-[16px] font-normal text-ink mb-3 flex items-center gap-2">
                    <Headphones size={16} className="text-primary" /> Listen on
                  </h3>
                  <ul className="space-y-2 text-[14px] font-light">
                    <li>
                      <a href={show.spotifyUrl} target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">
                        Spotify
                      </a>
                    </li>
                    <li>
                      <a href={show.appleUrl} target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">
                        Apple Podcasts
                      </a>
                    </li>
                    <li>
                      <a href={`/api/rss/${show.slug}`} className="text-primary hover:underline">
                        RSS feed
                      </a>
                    </li>
                  </ul>
                </div>
              </Reveal>
            </aside>
          </div>

          {/* Related shows */}
          <div className="mt-16">
            <Reveal>
              <h2 className="section-heading font-bold mb-8">You might also like</h2>
            </Reveal>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
              {related.map((s) => (
                <Link key={s.slug} href={`/shows/${s.slug}`} className="group">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={s.artwork} alt={s.title} className="w-full aspect-square object-cover rounded-[4px] shadow-card transition-transform duration-300 group-hover:scale-[1.03]" />
                  <p className="text-[14px] text-ink mt-3 font-normal group-hover:text-primary">{s.title}</p>
                  <p className="text-[12px] text-body/70 font-light">{s.category}</p>
                </Link>
              ))}
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
