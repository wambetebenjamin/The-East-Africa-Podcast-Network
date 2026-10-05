import type { Metadata } from 'next';
import { BarChart2, Check, Download, MessageCircle, Users } from 'lucide-react';
import { audience, sponsorPackages } from '@/lib/data';
import { formatNumber, site } from '@/lib/site';
import Reveal from '@/components/Reveal';
import AudienceCharts from '@/components/AudienceCharts';
import AdvertiseForm from '@/components/AdvertiseForm';

export const metadata: Metadata = {
  title: 'For Advertisers',
  description:
    'Reach 250,000+ monthly East African podcast listeners. Episode Sponsor, Show Partner and Network Partner packages from KES 25,000.',
};

export default function AdvertisePage({ searchParams }: { searchParams: { package?: string } }) {
  return (
    <>
      <header className="relative bg-night text-white">
        <div className="absolute inset-0 bg-cover bg-center opacity-35" style={{ backgroundImage: "url('/images/about-team.jpg')" }} aria-hidden />
        <div className="absolute inset-0 bg-gradient-to-t from-night via-night/70 to-night/30" aria-hidden />
        <div className="relative max-w-container mx-auto px-4 py-16 md:py-24 text-center">
          <p className="text-primary uppercase tracking-[0.25em] text-[12px] font-light mb-3">For Advertisers</p>
          <h1 className="text-white font-black text-[34px] md:text-[48px] leading-tight max-w-3xl mx-auto">
            East Africa is listening. Be in the room.
          </h1>
          <p className="text-white/70 font-light mt-4 max-w-2xl mx-auto">
            Host-read sponsorships on the region’s fastest-growing podcast network — measured,
            brand-safe and built for the 18–40 professionals defining the market.
          </p>
          <div className="flex flex-wrap justify-center gap-4 mt-8">
            <a
              href={`https://wa.me/${site.whatsappNumber}?text=${encodeURIComponent('Hello! I would like a sponsorship proposal from The East Africa Podcast Network.')}`}
              target="_blank"
              rel="noopener noreferrer"
              className="btn-primary-eapn"
            >
              <MessageCircle size={15} /> Talk to us on WhatsApp
            </a>
            <a href={site.mediaKitUrl} download className="btn-outline-eapn" aria-label="Download the media kit PDF">
              <Download size={15} /> Download Media Kit (PDF)
            </a>
          </div>
        </div>
      </header>

      {/* Audience overview */}
      <section className="site-section" aria-label="Audience overview">
        <div className="max-w-container mx-auto px-4">
          <Reveal className="text-center mb-10">
            <h2 className="section-heading centered font-bold">Audience Overview</h2>
          </Reveal>
          <Reveal className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-10">
            {[
              { label: 'Monthly listeners', value: formatNumber(audience.monthlyListeners), Icon: Users },
              { label: 'Monthly streams', value: formatNumber(audience.monthlyStreams), Icon: BarChart2 },
              { label: 'Avg. mid-roll completion', value: '68%', Icon: BarChart2 },
              { label: 'Aged 18–34', value: '69%', Icon: Users },
            ].map(({ label, value, Icon }) => (
              <div key={label} className="card-eapn p-5 text-center">
                <Icon size={18} className="text-primary mx-auto mb-2" />
                <p className="text-[26px] font-bold text-ink leading-none">{value}</p>
                <p className="text-[12px] text-body/70 font-light mt-2">{label}</p>
              </div>
            ))}
          </Reveal>
          <Reveal variant="fade">
            <AudienceCharts />
          </Reveal>
        </div>
      </section>

      {/* Sponsorship packages */}
      <section className="site-section bg-section/45" aria-label="Sponsorship packages">
        <div className="max-w-container mx-auto px-4">
          <Reveal className="text-center mb-10">
            <h2 className="section-heading centered font-bold">Sponsorship Packages</h2>
          </Reveal>
          <div className="grid lg:grid-cols-3 gap-6 items-stretch">
            {sponsorPackages.map((p, i) => (
              <Reveal key={p.name} delay={i * 100} className="h-full">
                <article
                  className={`card-eapn p-7 flex flex-col h-full relative ${
                    p.featured ? 'ring-2 ring-primary shadow-card' : ''
                  }`}
                >
                  {p.featured && (
                    <span className="absolute -top-3 left-1/2 -translate-x-1/2 bg-primary text-white text-[11px] uppercase tracking-[0.15em] px-3 py-1 rounded-full">
                      Most popular
                    </span>
                  )}
                  <h3 className="text-[20px] font-bold text-ink">{p.name}</h3>
                  <p className="text-[14px] font-light text-body mt-2 mb-5">{p.placement}</p>
                  <p className="text-[13px] text-body/70 font-light border-y border-line py-3">
                    <span className="text-ink font-normal">Reach:</span> {p.reach}
                  </p>
                  <p className="mt-5">
                    <span className="text-[12px] uppercase tracking-[0.1em] text-body/60 font-light">From</span>
                    <span className="block text-[30px] font-bold text-primary leading-none mt-1">
                      {p.priceKES === 'Custom' ? 'Custom' : `KES ${p.priceKES}`}
                      {p.priceKES !== 'Custom' && (
                        <span className="text-[13px] text-body font-light"> {p.cadence}</span>
                      )}
                    </span>
                  </p>
                  <ul className="mt-5 space-y-2.5 flex-1">
                    {p.inclusions.map((inc) => (
                      <li key={inc} className="flex items-start gap-2.5 text-[14px] font-light text-body">
                        <Check size={15} className="text-primary shrink-0 mt-1" /> {inc}
                      </li>
                    ))}
                  </ul>
                  <div className="flex flex-col gap-2 mt-7">
                    <a
                      href={`/advertise?package=${encodeURIComponent(p.name)}#enquiry`}
                      className={`btn-primary-eapn w-full ${p.featured ? '' : ''}`}
                    >
                      Request a Proposal
                    </a>
                    <a
                      href={`https://wa.me/${site.whatsappNumber}?text=${encodeURIComponent(`Hello! I'm interested in the ${p.name} package on The East Africa Podcast Network.`)}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="btn-light-eapn w-full"
                    >
                      <MessageCircle size={14} className="text-primary" /> WhatsApp us
                    </a>
                  </div>
                </article>
              </Reveal>
            ))}
          </div>
          <Reveal className="text-center mt-10">
            <p className="text-[13px] font-light text-body">
              All packages include the network’s standard measurement report. Custom placements,
              live reads and branded series available on request.
            </p>
          </Reveal>
        </div>
      </section>

      {/* Enquiry */}
      <section className="site-section" aria-label="Sponsorship enquiry">
        <div className="max-w-3xl mx-auto px-4">
          <Reveal className="text-center mb-10">
            <h2 className="section-heading centered font-bold">Request a Proposal</h2>
            <p className="text-body font-light mt-4">
              Or skip the form — WhatsApp us on{' '}
              <a
                href={`https://wa.me/${site.whatsappNumber}?text=${encodeURIComponent('Hello! I would like a sponsorship proposal from The East Africa Podcast Network.')}`}
                className="text-primary underline underline-offset-4"
                target="_blank"
                rel="noopener noreferrer"
              >
                +254 112 272 061
              </a>
              .
            </p>
          </Reveal>
          <Reveal variant="fade">
            <AdvertiseForm initialPackage={searchParams.package ?? ''} />
          </Reveal>
        </div>
      </section>
    </>
  );
}
