import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { Bookmark, Calendar, Clock, Download, ListMusic, Mic, PlayCircle } from 'lucide-react';
import { allEpisodes, getEpisode, getShow, relatedEpisodes } from '@/lib/data';
import { formatDate, formatDuration, site } from '@/lib/site';
import Reveal from '@/components/Reveal';
import EpisodeWaveform from '@/components/EpisodeWaveform';
import ShareButtons from '@/components/ShareButtons';
import SubscribeButton from '@/components/SubscribeButton';
import SaveButton from '@/components/SaveButton';
import TimestampList from '@/components/TimestampList';
import TranscriptAccordion from '@/components/TranscriptAccordion';
import ListenerNotes from '@/components/ListenerNotes';
import JsonLd from '@/components/JsonLd';

export const revalidate = 300; // ISR: refresh episode pages every 5 minutes

export function generateStaticParams() {
  return allEpisodes.map((e) => ({ slug: e.slug }));
}

export function generateMetadata({ params }: { params: { slug: string } }): Metadata {
  const ep = getEpisode(params.slug);
  if (!ep) return { title: 'Episode not found' };
  const show = getShow(ep.showSlug);
  return {
    title: ep.title,
    description: ep.description,
    openGraph: {
      title: ep.title,
      description: ep.description,
      type: 'article',
      publishedTime: ep.publishedAt,
      images: [{ url: ep.artwork, width: 900, height: 900, alt: ep.title }],
    },
  };
}

export default async function EpisodePage({ params }: { params: { slug: string } }) {
  const ep = getEpisode(params.slug);
  if (!ep) notFound();
  const show = getShow(ep.showSlug) as NonNullable<ReturnType<typeof getShow>>;
  const related = relatedEpisodes(ep, 4);

  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'PodcastEpisode',
    url: `${site.url}/episodes/${ep.slug}`,
    name: ep.title,
    episodeNumber: ep.number,
    partOfSeason: { '@type': 'PodcastSeason', seasonNumber: ep.season },
    datePublished: ep.publishedAt,
    timeRequired: `PT${Math.floor(ep.duration / 60)}M${ep.duration % 60}S`,
    description: ep.description,
    associatedMedia: {
      '@type': 'MediaObject',
      contentUrl: `${site.url}${ep.audio}`,
      encodingFormat: 'audio/mpeg',
    },
    partOfSeries: {
      '@type': 'PodcastSeries',
      name: show.title,
      url: `${site.url}/shows/${show.slug}`,
    },
  };

  return (
    <>
      <JsonLd data={jsonLd} />

      {/* Episode hero */}
      <header className="relative bg-night text-white">
        <div className="absolute inset-0 bg-cover bg-center opacity-30" style={{ backgroundImage: `url('${ep.artwork}')` }} aria-hidden />
        <div className="absolute inset-0 bg-gradient-to-t from-night via-night/70 to-night/40" aria-hidden />
        <div className="relative max-w-container mx-auto px-4 pt-12 md:pt-16 pb-12">
          <Link href={`/shows/${show.slug}`} className="text-primary text-[13px] uppercase tracking-[0.15em] hover:underline">
            {show.title}
          </Link>
          <h1 className="text-white font-black text-[28px] md:text-[42px] leading-tight mt-3 max-w-3xl">
            {ep.title}
          </h1>
          <div className="flex flex-wrap items-center gap-x-5 gap-y-2 text-white/60 text-[13px] font-light mt-4">
            <span className="inline-flex items-center gap-1.5">
              <Mic size={13} className="text-primary" /> {show.host.name}
            </span>
            <span className="inline-flex items-center gap-1.5">
              <Calendar size={13} className="text-primary" /> {formatDate(ep.publishedAt)}
            </span>
            <span className="inline-flex items-center gap-1.5">
              <Clock size={13} className="text-primary" /> {formatDuration(ep.duration)}
            </span>
            <span>
              Season {ep.season} · Episode {ep.number}
            </span>
          </div>
        </div>
      </header>

      <section className="site-section">
        <div className="max-w-container mx-auto px-4">
          <div className="grid lg:grid-cols-[1fr_320px] gap-10">
            <div className="min-w-0">
              {/* Large waveform player */}
              <Reveal variant="fade">
                <EpisodeWaveform episode={ep} />
              </Reveal>

              {/* Description with clickable timestamps */}
              <Reveal className="mt-10">
                <h2 className="section-heading font-bold mb-6">Episode Notes</h2>
                {ep.content.map((p, i) => (
                  <p key={i} className="text-[16px] font-light text-body leading-[1.85] mb-5">
                    {p}
                  </p>
                ))}
                <div className="card-eapn p-6 mt-6">
                  <h3 className="text-[16px] font-normal text-ink mb-4 flex items-center gap-2">
                    <ListMusic size={16} className="text-primary" /> Timestamps
                  </h3>
                  <TimestampList episode={ep} timestamps={ep.timestamps} />
                </div>
              </Reveal>

              {/* Chapters */}
              {ep.chapters && (
                <Reveal className="mt-10">
                  <h2 className="section-heading font-bold mb-6">Chapters</h2>
                  <ol className="border border-line rounded-[4px] bg-white divide-y divide-line">
                    {ep.chapters.map((c, i) => (
                      <li key={i} className="flex items-center gap-4 px-5 py-3">
                        <span className="text-primary text-[13px] tabular-nums font-light w-12">{formatDuration(c.start)}</span>
                        <span className="text-[15px] text-ink font-light">
                          {i + 1}. {c.title}
                        </span>
                      </li>
                    ))}
                  </ol>
                </Reveal>
              )}

              {/* Transcript accordion */}
              <Reveal className="mt-10">
                <TranscriptAccordion transcript={ep.transcript} />
              </Reveal>

              {/* Listener notes / comments */}
              <Reveal className="mt-10">
                <ListenerNotes episodeSlug={ep.slug} />
              </Reveal>
            </div>

            {/* Sidebar */}
            <aside className="space-y-6">
              <Reveal variant="fade-left">
                <div className="card-eapn p-6">
                  <div className="flex items-center gap-4 mb-5">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img src={show.artwork} alt={show.title} className="w-16 h-16 rounded-[4px] object-cover" />
                    <div>
                      <Link href={`/shows/${show.slug}`} className="text-[16px] text-ink hover:text-primary font-normal">
                        {show.title}
                      </Link>
                      <p className="text-[12px] text-body/70 font-light">{show.category}</p>
                    </div>
                  </div>
                  <p className="text-[14px] font-light text-body mb-4">{show.description}</p>
                  <SubscribeButton showSlug={show.slug} />
                </div>
              </Reveal>

              <Reveal variant="fade-left">
                <div className="card-eapn p-6">
                  <h3 className="text-[16px] font-normal text-ink mb-4">This episode</h3>
                  <div className="space-y-3">
                    <a href={ep.audio} download className="btn-dark-eapn w-full">
                      <Download size={14} /> Download Episode
                    </a>
                    {ep.spotifyUrl && (
                      <a href={ep.spotifyUrl} target="_blank" rel="noopener noreferrer" className="btn-light-eapn w-full">
                        Listen on Spotify
                      </a>
                    )}
                    {ep.appleUrl && (
                      <a href={ep.appleUrl} target="_blank" rel="noopener noreferrer" className="btn-light-eapn w-full">
                        Listen on Apple Podcasts
                      </a>
                    )}
                  </div>
                  <div className="mt-4">
                    <SaveButton episodeSlug={ep.slug} />
                  </div>
                </div>
              </Reveal>

              <Reveal variant="fade-left">
                <div className="card-eapn p-6">
                  <h3 className="text-[16px] font-normal text-ink mb-4">Share this episode</h3>
                  <ShareButtons episode={ep} />
                </div>
              </Reveal>
            </aside>
          </div>

          {/* Related episodes */}
          <div className="mt-16">
            <Reveal>
              <h2 className="section-heading font-bold mb-8">Related episodes</h2>
            </Reveal>
            <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {related.map((r) => {
                const rs = getShow(r.showSlug);
                return (
                  <Link key={r.slug} href={`/episodes/${r.slug}`} className="group card-eapn overflow-hidden">
                    <span className="block aspect-square overflow-hidden">
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img src={r.artwork} alt={r.title} className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105" />
                    </span>
                    <span className="block p-4">
                      <span className="block text-[14px] text-ink font-normal group-hover:text-primary">{r.title}</span>
                      <span className="block text-[12px] text-body/60 font-light">
                        {rs?.title} · {formatDuration(r.duration)}
                      </span>
                    </span>
                  </Link>
                );
              })}
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
