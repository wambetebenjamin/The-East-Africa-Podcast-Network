export const CATEGORIES = [
  'Business',
  'True Crime',
  'Technology',
  'Health',
  'Culture',
  'Religion',
  'Sports',
  'Finance',
  'Entertainment',
  'Politics',
] as const;

export type Category = (typeof CATEGORIES)[number];

export interface Host {
  name: string;
  slug: string;
  role: string;
  bio: string;
  photo: string;
  twitter?: string;
  instagram?: string;
  linkedin?: string;
}

export interface Chapter {
  start: number; // seconds
  title: string;
}

export interface Timestamp extends Chapter {}

export interface Episode {
  slug: string;
  showSlug: string;
  season: number;
  number: number;
  title: string;
  description: string;
  content: string[]; // long-form paragraphs
  publishedAt: string; // ISO date
  duration: number; // seconds
  audio: string;
  artwork: string;
  timestamps: Timestamp[];
  chapters?: Chapter[];
  transcript?: string[];
  spotifyUrl?: string;
  appleUrl?: string;
}

export interface Show {
  slug: string;
  title: string;
  tagline: string;
  category: Category;
  description: string;
  longDescription: string[];
  host: Host;
  subscribers: number;
  artwork: string;
  banner: string;
  spotifyUrl: string;
  appleUrl: string;
  rssUrl?: string; // external RSS feed imported by /api/rss/[showSlug]
  audioTrack: string; // local demo audio file
  episodes: Episode[];
}

export interface SponsorPackage {
  name: string;
  placement: string;
  reach: string;
  priceKES: string;
  cadence: string;
  inclusions: string[];
  featured?: boolean;
}

export interface BlogMeta {
  slug: string;
  title: string;
  date: string;
  excerpt: string;
  cover: string;
  author: string;
  category: string;
  readingMinutes: number;
}
