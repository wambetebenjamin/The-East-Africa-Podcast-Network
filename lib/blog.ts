import type { ComponentType } from 'react';
import type { BlogMeta } from './types';

/**
 * Blog registry. Metadata is plain data (safe to import from any server
 * route — sitemap, RSS, etc.); MDX bodies are lazy-loaded per slug so no
 * React runtime is dragged into data-only routes.
 */
export const postMetas: BlogMeta[] = [
  {
    slug: 'east-africa-podcast-industry-2026',
    title: 'The State of East African Podcasting, October 2026',
    date: '2026-10-02',
    excerpt: 'Network numbers, ad rates and the trends shaping the industry — our quarterly industry report, in plain language.',
    cover: '/images/blog-industry-news.jpg',
    author: 'Wanjiru Maina',
    category: 'Industry News',
    readingMinutes: 8,
  },
  {
    slug: 'recap-can-stars-qualify',
    title: 'Recap: “Can Stars Qualify?” and the Episode That Broke Our Inbox',
    date: '2026-10-03',
    excerpt: 'Touchline’s fixture-by-fixture breakdown of Harambee Stars’ group drew 4,000 voice notes. Here is what you told us.',
    cover: '/images/blog-episode-recap.jpg',
    author: 'Kevin Achieng',
    category: 'Episode Recaps',
    readingMinutes: 5,
  },
  {
    slug: 'how-to-start-a-podcast-in-kenya',
    title: 'How to Start a Podcast in Kenya (Without Breaking the Bank)',
    date: '2026-09-28',
    excerpt: 'A practical 2026 guide to equipment, hosting and distribution for Kenyan creators — with real prices in KES.',
    cover: '/images/blog-podcasting-tips.jpg',
    author: 'Brian Otieno',
    category: 'Podcasting Tips',
    readingMinutes: 7,
  },
  {
    slug: 'nairobi-stories-audio-documentary',
    title: 'Nairobi Stories: Why Audio Documentary Is Booming in East Africa',
    date: '2026-09-21',
    excerpt: 'Cheap data, long commutes and rich archives have made East Africa the most exciting place on the continent to make audio documentaries.',
    cover: '/images/blog-nairobi-stories.jpg',
    author: 'Daniel Kimathi',
    category: 'East African Stories',
    readingMinutes: 6,
  },
  {
    slug: 'recording-from-your-apartment',
    title: 'Recording a Network-Quality Show From a Nairobi Apartment',
    date: '2026-09-14',
    excerpt: 'Duvets, wardrobes and midnight sessions: how three of our shows record studio-grade audio from home.',
    cover: '/images/blog-home-studio.jpg',
    author: 'Amina Yusuf',
    category: 'Podcasting Tips',
    readingMinutes: 6,
  },
].sort((a, b) => (a.date < b.date ? 1 : -1));

export const postLoaders: Record<string, () => Promise<{ default: ComponentType }>> = {
  'east-africa-podcast-industry-2026': () => import('@/content/blog/east-africa-podcast-industry-2026.mdx'),
  'recap-can-stars-qualify': () => import('@/content/blog/recap-can-stars-qualify.mdx'),
  'how-to-start-a-podcast-in-kenya': () => import('@/content/blog/how-to-start-a-podcast-in-kenya.mdx'),
  'nairobi-stories-audio-documentary': () => import('@/content/blog/nairobi-stories-audio-documentary.mdx'),
  'recording-from-your-apartment': () => import('@/content/blog/recording-from-your-apartment.mdx'),
};

export async function loadPostBody(slug: string): Promise<ComponentType | null> {
  const loader = postLoaders[slug];
  if (!loader) return null;
  const mod = await loader();
  return mod.default;
}
