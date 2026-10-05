import type { Metadata } from 'next';
import { site } from '@/lib/site';
import Reveal from '@/components/Reveal';

export const metadata: Metadata = {
  title: 'Terms & Conditions',
  description: 'The terms governing use of The East Africa Podcast Network.',
};

const updated = '5 October 2026';

export default function TermsPage() {
  return (
    <>
      <header className="relative bg-night text-white bg-cover bg-center">
        <div className="absolute inset-0 bg-cover bg-center opacity-35" style={{ backgroundImage: "url('/images/about-studio.jpg')" }} aria-hidden />
        <div className="relative max-w-container mx-auto px-4 py-16 md:py-24 text-center">
          <h1 className="text-white font-black text-[32px] md:text-[44px]">Terms &amp; Conditions</h1>
          <p className="text-white/60 font-light mt-3 text-[14px]">Last updated {updated}</p>
        </div>
      </header>

      <section className="site-section">
        <div className="max-w-3xl mx-auto px-4">
          <Reveal variant="fade">
            <div className="mdx-content">
              <p>
                These terms govern your use of The East Africa Podcast Network website, apps and
                audio content. By using the service you accept them.
              </p>

              <h2>1. Content Ownership</h2>
              <p>
                All shows, episodes, artwork, transcripts, articles and code on EAPN are owned by
                the network or licensed to it by creators and partners. Episode audio is protected
                by copyright and neighbouring rights. You may stream, download for personal
                offline listening, and share links freely. You may not republish, re-host, train
                machine-learning models on, or commercially exploit EAPN content without written
                permission. Guest submissions remain the intellectual property of their
                submitters; by submitting you grant EAPN a licence to read, discuss and publish
                your submission on the network.
              </p>

              <h2>2. Listener Rights</h2>
              <p>
                You may create a listener account to follow shows, save episodes and sync
                listening history. You are responsible for keeping your sign-in credentials
                private. Accounts are free for personal, non-commercial use. We may suspend
                accounts that abuse the service (see Prohibited Use). We may add, change or retire
                features; material changes to these terms will be announced on the site.
              </p>

              <h2>3. Advertiser Terms</h2>
              <p>
                Sponsorship placements booked through EAPN are governed by the insertion order or
                campaign agreement signed by both parties, which prevails over these terms where
                they conflict. In general: advertising must be legal in Kenya and every market
                where it is served; EAPN does not accept political-campaign advertising, betting
                targeting minors, or deceptive claims; host-read scripts require final approval by
                the network; reach estimates are good-faith projections based on trailing
                90-day data and are not guarantees. Media kits and case studies are provided for
                planning purposes only.
              </p>

              <h2>4. Prohibited Use</h2>
              <ul>
                <li>Redistributing, re-hosting or selling EAPN audio or transcripts.</li>
                <li>Scraping, data-mining or automated bulk access to the service without permission.</li>
                <li>Uploading malicious code, impersonating staff or hosts, or interfering with the service’s operation.</li>
                <li>Harassment, hate speech, or unlawful content in listener notes, messages and submissions.</li>
                <li>Circumventing geo-restrictions or content protections.</li>
              </ul>
              <p>We may remove content and suspend accounts that breach these rules.</p>

              <h2>5. Governing Law — Kenya</h2>
              <p>
                These terms are governed by the laws of the Republic of Kenya. The courts of
                Nairobi, Kenya have exclusive jurisdiction over any dispute arising from your use
                of the service. Nothing in these terms limits statutory consumer rights available
                to you under Kenyan law.
              </p>

              <h2>6. Contact</h2>
              <p>
                Questions about these terms: <a href={`mailto:${site.email}`}>{site.email}</a>
                <br />
                The East Africa Podcast Network, EAPN House, Ngong Road, Nairobi, Kenya.
              </p>
            </div>
          </Reveal>
        </div>
      </section>
    </>
  );
}
