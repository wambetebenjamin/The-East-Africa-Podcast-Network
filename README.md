# The East Africa Podcast Network

East Africa's home for podcasts that inform, inspire, and entertain — a full
production podcast network site built with **Next.js 14 (App Router) +
TypeScript**, designed from the uploaded `podca-gh-pages.zip` (Colorlib "Podca"
template). See **`DESIGN-SOURCE-ANALYSIS.md`** for the complete design audit
and **`image-credits.md`** for photo attribution.

## Quick start

```bash
npm install
npm run dev        # http://localhost:3000
npm run build      # production build
```

Everything runs in **demo mode** with zero configuration. Each integration
activates when its environment variables are present (see `.env.example`).

## What's inside

| Area | Details |
|---|---|
| Design system | Tokens extracted from the zip: primary `#f23a2e`, Poppins 200/300/400/700/900, zip shadow/radius/spacing scales (`tailwind.config.ts`, `app/globals.css`) |
| Pages | Home, Shows, Show detail, Episodes feed, Episode detail, Blog (MDX), Advertise, About, Contact, Episode request, Guest submission, Listener dashboard (NextAuth, SSR), Legal (privacy/terms/cookies), branded 404 & 500 |
| Audio | Persistent player pinned to every page — HTML5 Audio + wavesurfer.js waveform, scrub, ±15s, volume + mute, speed 0.75×–2×, subscribe/share/queue; state persists across navigation (Zustand + localStorage) |
| 3D | Three.js sine-displaced sphere in the hero (right side, desktop only, opacity 0.25, pauses offscreen, DPR ≤ 1.5) |
| Animation | Word-by-word hero headline (0.1s/word), 5-bar equalizer (0.4–0.8s, 8–40px), show cards 75ms stagger, episode rows 50ms from left, player 400ms slide-up, waveform draw-in, charts animate on scroll — all `prefers-reduced-motion` safe |
| APIs | `/api/shows`, `/api/shows/[slug]`, `/api/episodes`, `/api/episodes/[slug]`, `/api/rss/[showSlug]` (rss-parser, 15-min cache), `/api/request`, `/api/guest-submission`, `/api/subscribe/[showSlug]`, `/api/listening-history` (protected), `/api/advertise`, `/api/newsletter`, `/api/contact`, `/api/captcha`, NextAuth `/api/auth/[...nextauth]` |
| Auth | NextAuth.js — Google OAuth + email magic link (KV-backed adapter). Dashboard is SSR-protected |
| CAPTCHA | reCAPTCHA v3 (invisible) on every form, server-side verified, v2 checkbox fallback when score < 0.5 |
| SEO | PodcastSeries + PodcastEpisode JSON-LD, per-episode Open Graph, ISR (episodes 300s, RSS 900s), dynamic sitemap, robots |
| PWA | `app/manifest.ts` + service worker (`public/sw.js`) with offline fallback |
| Deploy | `vercel.json` security headers (incl. CSP), Vercel KV + Blob conventions, all secrets via env vars |

## Demo-mode notes

- **Vercel KV** absent → API routes serve the bundled dataset / in-process store.
- **SMTP** absent → emails are logged server-side instead of failing.
- **WhatsApp Cloud API** absent → wa.me deep links are generated (the number is real: +254 112 272 061).
- **reCAPTCHA** keys absent → forms submit with a demo token and the server accepts in demo mode only.
- **NextAuth** unconfigured → the dashboard runs in demo mode with a clear notice; configure `NEXTAUTH_SECRET` + providers to enforce sign-in.
- **Episode audio** — six local synthesized placeholder tracks (`scripts/generate-audio.mjs`); swap the `audio` fields in `lib/data.ts` for Vercel Blob / CDN URLs of real episodes.

## Media kit

`public/media/eapn-media-kit.pdf` is served locally; set `NEXT_PUBLIC_MEDIA_KIT_URL` to a Vercel Blob URL to override.
