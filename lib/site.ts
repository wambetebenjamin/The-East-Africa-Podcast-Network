export const site = {
  name: 'The East Africa Podcast Network',
  shortName: 'EAPN',
  tagline: 'East Africa’s home for podcasts that inform, inspire, and entertain.',
  description:
    'The East Africa Podcast Network is Nairobi’s home for East African podcasts — 10 shows across business, culture, true crime, technology, health, faith, sports, finance, entertainment and politics.',
  url: process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000',
  locale: 'en_KE',
  location: 'Nairobi, Kenya',
  email: 'hello@eapn.africa',
  advertiseEmail: 'advertise@eapn.africa',
  pressEmail: 'press@eapn.africa',
  supportEmail: 'support@eapn.audio',
  whatsappNumber: process.env.NEXT_PUBLIC_WHATSAPP_NUMBER || '254112272061',
  whatsappHello:
    'https://wa.me/254112272061?text=Hello!%20I%20have%20a%20suggestion%20for%20The%20East%20Africa%20Podcast%20Network.',
  social: {
    spotify: 'https://open.spotify.com/show/7yIt5cYqXKq8wSSTnGHp2C',
    apple: 'https://podcasts.apple.com/us/genre/podcasts/id26',
    youtube: 'https://www.youtube.com/@eastafricapodcastnetwork',
    instagram: 'https://www.instagram.com/eastafricapodcasts',
    twitter: 'https://twitter.com/eastafricapods',
  },
  mediaKitUrl: process.env.NEXT_PUBLIC_MEDIA_KIT_URL || '/media/eapn-media-kit.pdf',
  nav: [
    { label: 'Home', href: '/' },
    { label: 'Shows', href: '/shows' },
    { label: 'Episodes', href: '/episodes' },
    { label: 'Blog', href: '/blog' },
    { label: 'For Advertisers', href: '/advertise' },
    { label: 'About', href: '/about' },
  ],
} as const;

export function whatsappLink(text: string) {
  const num = site.whatsappNumber;
  return `https://wa.me/${num}?text=${encodeURIComponent(text)}`;
}

export function formatDuration(sec: number) {
  if (!Number.isFinite(sec) || sec < 0) sec = 0;
  const h = Math.floor(sec / 3600);
  const m = Math.floor((sec % 3600) / 60);
  const s = Math.floor(sec % 60);
  if (h > 0) return `${h}:${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}`;
  return `${m}:${String(s).padStart(2, '0')}`;
}

export function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString('en-KE', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  });
}

export function formatNumber(n: number) {
  if (n >= 1_000_000) return `${(n / 1_000_000).toFixed(1)}M`;
  if (n >= 1_000) return `${Math.round(n / 1000)}K`;
  return String(n);
}
