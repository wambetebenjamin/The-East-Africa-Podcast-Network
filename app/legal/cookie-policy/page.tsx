import type { Metadata } from 'next';
import { site } from '@/lib/site';
import Reveal from '@/components/Reveal';

export const metadata: Metadata = {
  title: 'Cookie Policy',
  description: 'The cookies The East Africa Podcast Network uses and how to control them.',
};

const updated = '5 October 2026';

export default function CookiePolicyPage() {
  return (
    <>
      <header className="relative bg-night text-white bg-cover bg-center">
        <div className="absolute inset-0 bg-cover bg-center opacity-35" style={{ backgroundImage: "url('/images/hero-studio.jpg')" }} aria-hidden />
        <div className="relative max-w-container mx-auto px-4 py-16 md:py-24 text-center">
          <h1 className="text-white font-black text-[32px] md:text-[44px]">Cookie Policy</h1>
          <p className="text-white/60 font-light mt-3 text-[14px]">Last updated {updated}</p>
        </div>
      </header>

      <section className="site-section">
        <div className="max-w-3xl mx-auto px-4">
          <Reveal variant="fade">
            <div className="mdx-content">
              <p>
                Cookies are small files stored by your browser. We use them to keep the audio
                player working across pages, remember your preferences, and — only with your
                consent — measure performance and campaigns.
              </p>

              <h2>Cookie categories</h2>
              <ul>
                <li>
                  <strong>Necessary (always on)</strong> — player state (current episode, position,
                  volume, queue), security tokens and load balancing. The service cannot function
                  without them.
                </li>
                <li>
                  <strong>Functional</strong> — remember shows you follow, saved episodes and UI
                  preferences.
                </li>
                <li>
                  <strong>Analytics</strong> — aggregate measurement of which episodes and features
                  listeners use.
                </li>
                <li>
                  <strong>Marketing</strong> — measuring sponsor campaigns and promo codes.
                </li>
              </ul>

              <h2>Managing your preferences</h2>
              <p>
                On your first visit a banner lets you accept all cookies or choose which
                categories to allow. Your choice is stored in your browser (localStorage) and we
                will not ask again after acceptance. You can change your decision at any time by
                clearing site data in your browser settings, which makes the banner reappear.
              </p>

              <h2>Contact</h2>
              <p>
                Questions about cookies: <a href={`mailto:${site.email}`}>{site.email}</a>
              </p>
            </div>
          </Reveal>
        </div>
      </section>
    </>
  );
}
