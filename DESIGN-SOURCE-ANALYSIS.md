# Design Source Analysis — `podca-gh-pages.zip`

**Inspected and unpacked:** every file read and documented before any new code was written.

## 1. Template identity

The zip is the **“Podca” static website template** (Colorlib, Bootstrap 4, built 2018, GitHub-Pages export).
Base design: dark hero photography, red accent `#f23a2e`, Poppins type, MediaElement.js audio players.
Template license: CC BY 3.0 (Colorlib) — design patterns reproduced; original code not copied wholesale.

## 2. Folder structure & naming conventions

```
podca-gh-pages/
├── index.html            # home
├── about.html            # about page
├── contact.html          # contact page
├── single-post.html      # episode/post detail page
├── css/                  # compiled css + vendor css (bootstrap.min, aos, magnific-popup,
│                         #   jquery-ui, mediaelementplayer, owl.carousel, style.css)
├── scss/                 # source: style.scss → _site-base.scss, _site-navbar.scss,
│                         #   _site-blocks.scss + full Bootstrap 4.1 scss (_variables.scss: $red: #f23a2e)
├── js/                   # jquery 3.3.1 + migrate, popper, bootstrap, aos, owl.carousel 2.3.4,
│                         #   jquery.stellar, jquery.countdown, magnific-popup,
│                         #   mediaelement-and-player 4.2.7, main.js
├── fonts/icomoon/        # icomoon icon font (eot/svg/ttf/woff + selection.json)
├── images/               # hero_bg_1-3 (1900×1267), img_1-5 (900×874), person_1-6 (665×665)
├── prepros-6.config      # Prepros build config (SCSS compile)
└── .DS_Store files       # macOS origin
```

## 3. Pages & routes (4 static pages)

| Route (zip) | New route | Contents |
|---|---|---|
| `index.html` | `/` | Hero cover w/ featured episode + inline audio player, “Recent Podcasts” entry list w/ pagination, “Behind The Mic” team grid, “Featured Guests” carousel, Subscribe band, footer |
| `about.html` | `/about` | Hero inner cover (30vh), intro heading (`display-4`), image + lead paragraphs, hosts, video block, subscribe band |
| `contact.html` | `/contact` | Inner cover, 2-col: form (`p-5 border`, name/email/phone/message) + contact info blocks (`p-4 border mb-3 bg-white`) |
| `single-post.html` | `/episodes/[slug]` | Episode hero, full-width image, `podcast-entry` block with audio player, text content, share, author row |

## 4. Components & props (documented from markup/SCSS)

- **Navbar** — `site-navbar py-4 absolute transparent`: logo left (`h2` wordmark), menu right; links uppercase 15px, letter-spacing .05em, white, hover/active `#f23a2e`; `data-aos="fade-down"`; dropdowns white w/ 1px `#edf0f5` border, arrow-top 10px.
- **Mobile menu** — offcanvas right, 300px, white bg, `box-shadow: -10px 0 20px -10px rgba(0,0,0,.1)`, `transform: translateX(110%)` → 0 on `.offcanvas-menu`, transition `.3s ease-in-out`; page overlay `rgba(0,0,0,.6)` via `.site-wrap:before`; top-level links 20px, sub 16px; body scroll `calc(100vh - 52px)`.
- **Hero cover** — `site-blocks-cover overlay`: full viewport `height: calc(100vh)` (min 600px), bg cover center, `:before` overlay `rgba(0,0,0,.4)`, content `data-aos="fade-up" data-aos-delay="400"`; inner-page variant 30vh; cover `h1` weight 900, 30px → 50px @md.
- **Podcast entry row** — white card, `box-shadow: 0 5px 40px -10px rgba(0,0,0,.1)`, 300×300 image block left, `.text` padding 40px, meta line `By {host} / {date} / {duration}` (`/` separators, `#ccc`), MediaElement audio player.
- **Team member card** — image; hover: `rgba(#f23a2e,.8)` overlay fades in, image `scale(1.1)`, text rises `translateY(-50%)` with `.2s` delay; transitions `.3s`/`.5s`.
- **Featured guests carousel** — owl-carousel, white cards, circular 50% portraits (`w-50 rounded-circle`), nav arrows bottom.
- **Subscribe band** — inner-page cover, input height 80px, font-size 22px, transparent bg, white border, italic placeholder `rgba(255,255,255,.5)` weight 200, “Send” `btn-primary`.
- **Pagination** — `site-block-27`: 40px circles, 1px `#ccc` border, active: `#f23a2e` bg white text.
- **Footer** — bg `#333333`, padding 4em; headings (`.footer-heading`) 20px white; text `#737373`; links `#999` → white hover; recent-episodes thumbs (90px, radius 4px); social icons.
- **Buttons** — `.btn` uppercase, letter-spacing .05em (primary: weight 300, letter-spacing .2em), `.btn-sm` 0.9rem; hover: `box-shadow 0 5px 20px -7px rgba(0,0,0,.9)`, `top: -2px`, transition `.2s ease-in-out`; `.btn-secondary` bg `#e6e7e9` black text.
- **Forms** — `form-control` height 43px, focus border `#f23a2e`, no shadow.
- **Play button (video)** — 70px white circle, icon colored `#f23a2e`, centered.

## 5. CSS variables / design tokens

| Token | Value (compiled) |
|---|---|
| `$primary` (red) | **`#f23a2e`** (`$red` override in `scss/bootstrap/_variables.scss:45`) |
| `$secondary` | `$gray-600` (`#6c757d`); btn-secondary tint `#e6e7e9` |
| Body text color | `#4d4d4d` (`lighten(#000,30%)`), weight 200, line-height 1.7 |
| Headings color | `#25262a` ($gray-1) |
| Footer bg | `#333333`; footer text `#737373`; footer links `#999999` |
| Section bg-light | `#cccccc` |
| Borders | `#edf0f5` ($gray-4); card borders `#e6e6e6` (lighten black 90%) |
| Dropdown hover bg | `#f4f5f9` |
| Overlay | `rgba(0,0,0,.4)` hero; `rgba(0,0,0,.6)` offcanvas |
| Selection | black bg / white text |
| `text-white-opacity-05` | `rgba(255,255,255,.5)` (meta text on dark) |

## 6. Typography (from source)

- **Font family:** Poppins — Google Fonts, weights **200, 300, 400, 700, 900** (no italics used).
- Body: `1.1rem` (17.6px) weight 200 lh 1.7 → **≥ 15px body minimum ✓**
- Cover h1: 30px (mobile) → **50px** @≥768px, weight 900, lh 1.5
- Section heading: 30px, `#25262a`, 40×2px `#f23a2e` top rule
- Navbar links: **15px** uppercase (≥13px nav minimum ✓), weight 400
- Buttons: `.btn-sm` 14.4px (≥12px ✓); primary letter-spacing .2em
- Meta/small: `<small>` (≈83% ≈ 14.5px on body — new build enforces ≥11px metadata)
- Footer heading 20px; mobile menu 20px/16px; subscribe input 22px
- Headings scale (BS4): h1 40px, h2 32px, h3 28px, h4 24px, h5 20px, h6 16px — headings wrap naturally ✓

## 7. Spacing scale

- Bootstrap 4 grid: gutters 30px (15px each side); containers 540/720/960/**1140**px
- `site-section` padding: **2.5em (40px)** mobile → **5em (80px)** ≥768px
- Podcast-entry text padding: **40px**; image block **300×300**
- Cards `mb-5` (48px); nav link padding `10px 10px`, li padding `10px 5px`
- Footer padding 4em; subscribe input height 80px, padding-x 30px

## 8. Shadow scale

| Shadow | Use |
|---|---|
| `0 5px 40px -10px rgba(0,0,0,.1)` | podcast entry cards |
| `0 5px 20px -7px rgba(0,0,0,.9)` | button hover |
| `0 10px 40px -5px rgba(0,0,0,.4)` | feature block hover |
| `0 0 4px 0 rgba(0,0,0,.25)` | dropdowns |
| `-10px 0 20px -10px rgba(0,0,0,.1)` | mobile offcanvas |
| `0 0 20px -5px rgba(0,0,0,.3)` | floating text panels |

## 9. Border-radius scale

`4px` (post cards, thumbnails) · `0.25rem` (BS4 buttons/inputs) · `50%`/`999px` (circular play button, pagination, avatars, arrow buttons).

## 10. Loading screen component

**Not present in zip** → build spec fallback: network wordmark fades in; 5-bar equalizer (heights pulse 8–40px, per-bar duration 0.4–0.8s CSS keyframes); thin progress bar fills left→right; page fades in on completion; total under 2 seconds; once per session.

## 11. Cookie consent banner

**Not present in zip** → build spec fallback: fixed full-width bottom banner, exact message “We use cookies to track listening preferences, improve recommendations, and measure performance. See our Cookie Policy for details.”, “Accept All” + “Manage Preferences” buttons, modal with toggles (Necessary locked / Functional / Analytics / Marketing), consent in `localStorage`, no repeat after acceptance, link `/legal/cookie-policy`.

## 12. CAPTCHA

**Not present in zip** → implement Google reCAPTCHA **v3 (invisible)** on newsletter, episode request, contact/sponsorship, guest submission, registration forms; server-side token verification (`/api/captcha` + inline verification in each handler); **v2 fallback when score < 0.5**; secret keys in env vars only.

## 13. Privacy policy & Terms pages

**Not present in zip** → build at `/legal/privacy-policy` (Listening Data, Email & Subscription Data, Analytics Partners, Your Rights, Contact) and `/legal/terms` (Content Ownership, Listener Rights, Advertiser Terms, Prohibited Use, Governing Law Kenya), using the zip’s inner-page-cover + bordered content layout.

## 14. 404 / 500 pages

**Not present in zip** → build branded pages in the template’s dark-hero style:
- 404: “This episode or page is gone.” + “Browse All Episodes” CTA + search bar.
- 500: “Audio temporarily unavailable. We are fixing it.” + “Try Again” button.

## 15. API route structures

**None (static site)** → build all 12 specified routes: `/api/shows`, `/api/shows/[slug]`, `/api/episodes`, `/api/episodes/[slug]`, `/api/rss/[showSlug]`, `/api/request`, `/api/guest-submission`, `/api/subscribe/[showSlug]`, `/api/listening-history`, `/api/advertise`, `/api/newsletter`, `/api/contact`, `/api/captcha`, plus NextAuth `/api/auth/[...nextauth]`.

## 16. Third-party libraries in zip (→ modern equivalents in new build)

| Zip library | Version | New build equivalent |
|---|---|---|
| jQuery | 3.3.1 (+migrate 3.0.1) | React 18 / Next 14 |
| Bootstrap CSS/JS | 4.1 | Tailwind CSS with exact token mapping |
| Popper | 1.14 | — |
| AOS | 2.x (`AOS.init({duration:800, easing:'slide', once:true})`) | Custom IntersectionObserver reveal system (same values) |
| Owl Carousel | 2.3.4 | CSS scroll-snap carousel |
| jQuery Stellar | 1.0.0 (parallax ratio 0.5) | subtle CSS parallax |
| jQuery Countdown | 2.2.0 | — (not needed) |
| Magnific Popup | 1.1.0 | custom modal |
| MediaElement.js | 4.2.7 | **wavesurfer.js 7** + HTML5 Audio (spec) |
| icomoon font | — | **Lucide** icons (spec) |
| Poppins (Google Fonts) | 200/300/400/700/900 | same, self-hosted via @fontsource |
| Prepros 6 | config | — |

## 17. Environment variables referenced

**None in zip** (static). New build defines (see `.env.example`):
`NEXT_PUBLIC_SITE_URL`, `NEXT_PUBLIC_RECAPTCHA_SITE_KEY`, `RECAPTCHA_SECRET_KEY`, `NEXT_PUBLIC_RECAPTCHA_V2_SITE_KEY`, `RECAPTCHA_SECRET_KEY_V2`, `NEXTAUTH_URL`, `NEXTAUTH_SECRET`, `GOOGLE_CLIENT_ID`, `GOOGLE_CLIENT_SECRET`, `EMAIL_SERVER`/`SMTP_*`, `EMAIL_FROM`, `KV_REST_API_URL`, `KV_REST_API_TOKEN`, `BLOB_READ_WRITE_TOKEN`, `NEXT_PUBLIC_MEDIA_KIT_URL`, `NEXT_PUBLIC_WHATSAPP_NUMBER`, `WHATSAPP_TOKEN`, `WHATSAPP_PHONE_NUMBER_ID`, `CONTACT_EMAIL`, `PRODUCER_EMAIL`.

## 18. Animation inventory (zip, exact values)

- AOS global: `duration: 800`, `easing: 'slide'`, `once: true`
- Hero: navbar `fade-down`; cover `fade` (no delay); cover content `fade-up` delay **400ms**
- Links/images: `.3s all ease`; team img `scale 1.0→1.1` `.3s`; team overlay `.3s`; team text `.5s` + `.2s` delay
- Buttons: `.2s ease-in-out`, hover lift `top: -2px`
- Dropdown: `transition 0.2s 0s`, margin-top 20px→0
- Offcanvas menu: `.3s ease-in-out` slide
- Post image hover: `scale(1.2)` `.3s`
- (New spec animations — word-by-word hero headline 0.1s/word, 5-bar equalizer, 75ms/50ms staggers, 400ms player slide-up, waveform draw-in, chart grow — layered on top; `prefers-reduced-motion` respected.)

---

**Conclusion:** the zip supplies the complete visual system (colors, type, spacing, shadows, radii, component styles, animation timing). Everything the brief requires that the zip lacks (loading screen, cookie banner, CAPTCHA, legal pages, 404/500, APIs, env vars) is built exactly to the brief’s written fallback specs.
