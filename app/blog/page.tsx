import type { Metadata } from 'next';
import Link from 'next/link';
import { Calendar, Clock } from 'lucide-react';
import { postMetas } from '@/lib/blog';
import { formatDate } from '@/lib/site';
import Reveal from '@/components/Reveal';

export const metadata: Metadata = {
  title: 'Blog',
  description: 'Podcasting tips, East African stories, industry news and episode recaps from the EAPN newsroom.',
};

export default function BlogPage() {
  return (
    <>
      <header className="relative bg-night text-white">
        <div className="absolute inset-0 bg-cover bg-center opacity-40" style={{ backgroundImage: "url('/images/blog-podcasting-tips.jpg')" }} aria-hidden />
        <div className="relative max-w-container mx-auto px-4 py-16 md:py-24 text-center">
          <h1 className="text-white font-black text-[34px] md:text-[46px]">The EAPN Blog</h1>
          <p className="text-white/70 font-light mt-3 max-w-xl mx-auto">
            Podcasting tips, East African stories, industry news and episode recaps.
          </p>
        </div>
      </header>

      <section className="site-section">
        <div className="max-w-container mx-auto px-4">
          <Reveal stagger={75} className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {postMetas.map((p) => (
              <article key={p.slug} className="card-eapn group overflow-hidden flex flex-col">
                <Link href={`/blog/${p.slug}`} className="block aspect-video overflow-hidden">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={p.cover}
                    alt={p.title}
                    className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                  />
                </Link>
                <div className="p-5 flex-1 flex flex-col">
                  <p className="text-[11px] uppercase tracking-[0.12em] text-primary font-light mb-2">{p.category}</p>
                  <h2 className="text-[18px] font-normal text-ink leading-snug mb-2">
                    <Link href={`/blog/${p.slug}`} className="hover:text-primary">
                      {p.title}
                    </Link>
                  </h2>
                  <p className="text-[14px] font-light text-body mb-4 line-clamp-3">{p.excerpt}</p>
                  <p className="text-[12px] text-body/60 font-light mt-auto flex items-center gap-3 flex-wrap">
                    <span>{p.author}</span>
                    <span className="inline-flex items-center gap-1">
                      <Calendar size={11} className="text-primary" /> {formatDate(p.date)}
                    </span>
                    <span className="inline-flex items-center gap-1">
                      <Clock size={11} className="text-primary" /> {p.readingMinutes} min read
                    </span>
                  </p>
                </div>
              </article>
            ))}
          </Reveal>
        </div>
      </section>
    </>
  );
}
