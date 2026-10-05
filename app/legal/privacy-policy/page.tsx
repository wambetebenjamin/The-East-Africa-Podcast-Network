import type { Metadata } from 'next';
import { site } from '@/lib/site';
import Reveal from '@/components/Reveal';

export const metadata: Metadata = {
  title: 'Privacy Policy',
  description: 'How The East Africa Podcast Network collects, uses and protects listener data.',
};

const updated = '5 October 2026';

export default function PrivacyPolicyPage() {
  return (
    <>
      <header className="relative bg-night text-white bg-cover bg-center">
        <div className="absolute inset-0 bg-cover bg-center opacity-35" style={{ backgroundImage: "url('/images/about-mix.jpg')" }} aria-hidden />
        <div className="relative max-w-container mx-auto px-4 py-16 md:py-24 text-center">
          <h1 className="text-white font-black text-[32px] md:text-[44px]">Privacy Policy</h1>
          <p className="text-white/60 font-light mt-3 text-[14px]">Last updated {updated}</p>
        </div>
      </header>

      <section className="site-section">
        <div className="max-w-3xl mx-auto px-4">
          <Reveal variant="fade">
            <div className="mdx-content">
              <p>
                The East Africa Podcast Network (“EAPN”, “we”, “us”) operates{' '}
                <a href={site.url}>{site.url.replace('https://', '')}</a> and the EAPN app. This
                policy explains what personal data we collect, why we collect it, and the choices
                you have. It is written to comply with the Kenya Data Protection Act, 2019.
              </p>

              <h2>1. Listening Data</h2>
              <p>
                When you stream or download an episode we record technical data needed to deliver
                audio: the episode identifier, stream quality, approximate duration listened,
                device and browser type, and a randomised listener identifier. We use this data to
                improve recommendations, calculate creator payments and sponsor reporting, and
                keep the service secure. You can stream without an account; anonymous listening
                data cannot be linked back to you.
              </p>

              <h2>2. Email and Subscription Data</h2>
              <p>
                If you subscribe to a show or our newsletter we store your email address, the shows
                you follow and your subscription preferences. We use this to send new-episode
                notifications and the weekly newsletter. Every email we send contains an
                unsubscribe link; unsubscribing takes effect immediately. If you create a listener
                account we also store your name (optional) and sign-in method. You can request a
                copy or deletion of your account data at any time.
              </p>

              <h2>3. Analytics Partners</h2>
              <p>
                We use privacy-respecting, aggregate analytics to understand how the network is
                used (pages visited, episodes played, approximate region, referral source). Our
                analytics partners process data under contract with us and may not use it for
                their own purposes. Where consent is required, analytics cookies load only after
                you accept them in the cookie banner. We do not sell listener data, ever.
              </p>

              <h2>4. Your Rights</h2>
              <ul>
                <li><strong>Access</strong> — request a copy of the personal data we hold about you.</li>
                <li><strong>Correction</strong> — ask us to correct inaccurate data.</li>
                <li><strong>Deletion</strong> — ask us to delete your account and personal data (“right to be forgotten”).</li>
                <li><strong>Objection and restriction</strong> — object to processing or ask us to restrict it.</li>
                <li><strong>Portability</strong> — receive your data in a machine-readable format.</li>
                <li><strong>Withdraw consent</strong> — change your cookie preferences or unsubscribe at any time.</li>
              </ul>
              <p>
                To exercise any of these rights email{' '}
                <a href={`mailto:${site.email}`}>{site.email}</a> or write to EAPN House, Ngong
                Road, Nairobi. We respond within 30 days. You may also lodge a complaint with the
                Office of the Data Protection Commissioner (Kenya).
              </p>

              <h2>5. Contact</h2>
              <p>
                Data protection questions, requests and complaints:
                <br />
                Email: <a href={`mailto:${site.email}`}>{site.email}</a>
                <br />
                Post: The East Africa Podcast Network, EAPN House, Ngong Road, Nairobi, Kenya
                <br />
                WhatsApp: +254 112 272 061
              </p>
            </div>
          </Reveal>
        </div>
      </section>
    </>
  );
}
