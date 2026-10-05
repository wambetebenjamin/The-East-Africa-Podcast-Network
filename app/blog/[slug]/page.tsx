import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { ArrowLeft, Calendar, Clock } from 'lucide-react';
import { loadPostBody, postMetas } from '@/lib/blog';
import { formatDate, site } from '@/lib/site';
import Reveal from '@/components/Reveal';
import NewsletterForm from '@/components/NewsletterForm';
import JsonLd from '@/components/JsonLd';

export function generateStaticParams() {
  return postMetas.map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({ params }: { params: { slug: string } }): Promise<Metadata> {
  const post = postMetas.find((p) => p.slug === params.slug);
  if (!post) return { title: 'Post not found' };
  return {
    title: post.title,
    description: post.excerpt,
    openGraph: {
      title: post.title,
      description: post.excerpt,
      type: 'article',
      publishedTime: post.date,
      images: [{ url: post.cover, width: 1600, height: 900, alt: post.title }],
    },
  };
}

export default async function BlogPostPage({ params }: { params: { slug: string } }) {
  const post = postMetas.find((p) => p.slug === params.slug);
  if (!post) notFound();

  const Body = await loadPostBody(post.slug);
  if (!Body) notFound();

  const others = postMetas.filter((p) => p.slug !== post.slug).slice(0, 2);

  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'Article',
    headline: post.title,
    datePublished: post.date,
    author: { '@type': 'Person', name: post.author },
    publisher: { '@type': 'Organization', name: site.name },
    image: `${site.url}${post.cover}`,
    description: post.excerpt,
  };

  return (
    <>
      <JsonLd data={jsonLd} />
      <header className="relative bg-night text-white">
        <div className="absolute inset-0 bg-cover bg-center opacity-35" style={{ backgroundImage: `url('${post.cover}')` }} aria-hidden />
        <div className="absolute inset-0 bg-gradient-to-t from-night via-night/70 to-night/30" aria-hidden />
        <div className="relative max-w-3xl mx-auto px-4 py-16 md:py-24">
          <Link href="/blog" className="text-white/60 hover:text-white text-[13px] inline-flex items-center gap-1.5 mb-6">
            <ArrowLeft size={14} /> All articles
          </Link>
          <p className="text-primary uppercase tracking-[0.2em] text-[12px] font-light mb-3">{post.category}</p>
          <h1 className="text-white font-black text-[30px] md:text-[42px] leading-tight">{post.title}</h1>
          <p className="text-white/60 text-[13px] font-light mt-4 flex items-center gap-4 flex-wrap">
            <span>{post.author}</span>
            <span className="inline-flex items-center gap-1">
              <Calendar size={12} className="text-primary" /> {formatDate(post.date)}
            </span>
            <span className="inline-flex items-center gap-1">
              <Clock size={12} className="text-primary" /> {post.readingMinutes} min read
            </span>
          </p>
        </div>
      </header>

      <article className="site-section">
        <div className="max-w-3xl mx-auto px-4">
          <Reveal variant="fade">
            <div className="mdx-content">
              <Body />
            </div>
          </Reveal>
          <Reveal className="mt-14 pt-10 border-t border-line">
            <div className="bg-night text-white p-8 md:p-10 text-center rounded-[4px]">
              <h2 className="text-white font-black text-[24px] mb-2">Never miss an episode</h2>
              <p className="text-white/60 font-light text-[14px] mb-6">
                New episodes delivered to your inbox every week.
              </p>
              <NewsletterForm />
            </div>
          </Reveal>
          <Reveal className="mt-14">
            <h2 className="section-heading font-bold mb-6">More from the blog</h2>
            <div className="grid sm:grid-cols-2 gap-6">
              {others.map((p) => (
                <Link key={p.slug} href={`/blog/${p.slug}`} className="card-eapn group overflow-hidden">
                  <span className="block aspect-video overflow-hidden">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img src={p.cover} alt={p.title} className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105" />
                  </span>
                  <span className="block p-4">
                    <span className="block text-[15px] text-ink font-normal group-hover:text-primary">{p.title}</span>
                    <span className="block text-[12px] text-body/60 font-light">{formatDate(p.date)}</span>
                  </span>
                </Link>
              ))}
            </div>
          </Reveal>
        </div>
      </article>
    </>
  );
}
