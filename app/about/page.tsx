import type { Metadata } from 'next';
import Link from 'next/link';
import { Headphones, Mic, Radio, Users } from 'lucide-react';
import { shows } from '@/lib/data';
import { formatNumber } from '@/lib/site';
import Reveal from '@/components/Reveal';

export const metadata: Metadata = {
  title: 'About',
  description:
    'The East Africa Podcast Network is Nairobi’s home for podcasts that inform, inspire, and entertain — 10 shows, 10 categories, one network.',
};

export default function AboutPage() {
  const hosts = shows.map((s) => s.host);
  const totalSubs = shows.reduce((a, s) => a + s.subscribers, 0);

  return (
    <>
      <header className="relative bg-night text-white bg-cover bg-center">
        <div className="absolute inset-0 bg-cover bg-center opacity-40" style={{ backgroundImage: "url('/images/about-studio.jpg')" }} aria-hidden />
        <div className="relative max-w-container mx-auto px-4 py-16 md:py-28 text-center">
          <h1 className="text-white font-black text-[34px] md:text-[48px] leading-tight max-w-3xl mx-auto">
            We are the sound of East Africa.
          </h1>
          <p className="text-white/70 font-light mt-5 max-w-2xl mx-auto text-[16px]">
            The East Africa Podcast Network records in Nairobi and listens everywhere — from Kisumu
            to Kigali, Dar to Kampala. Ten shows. Ten categories. One network built for the way
            East Africans actually listen.
          </p>
        </div>
      </header>

      <section className="site-section">
        <div className="max-w-container mx-auto px-4">
          <div className="grid lg:grid-cols-2 gap-10 items-center">
            <Reveal variant="fade-left">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src="/images/about-studio.jpg" alt="Recording at the EAPN studio in Nairobi" className="rounded-[4px] shadow-card w-full object-cover" />
            </Reveal>
            <Reveal variant="fade-right">
              <h2 className="section-heading font-bold mb-6">Our story</h2>
              <p className="text-[16px] font-light text-body leading-[1.85] mb-5">
                EAPN started in a converted storeroom off Ngong Road with two microphones, a
                mixing desk older than most of our staff, and a conviction: East African stories
                deserve East African telling.
              </p>
              <p className="text-[16px] font-light text-body leading-[1.85] mb-5">
                Today we produce ten original shows from our Nairobi studios, work with
                correspondents in four countries, and reach a quarter of a million listeners every
                month — on the matatu, at the gym, in the kitchen, at work.
              </p>
              <p className="text-[16px] font-light text-body leading-[1.85]">
                We are proudly independent, journalistically careful, and allergic to filler
                episodes.
              </p>
              <div className="grid grid-cols-3 gap-4 mt-8">
                {[
                  { value: '10', label: 'Original shows', Icon: Mic },
                  { value: formatNumber(totalSubs), label: 'Subscribers', Icon: Headphones },
                  { value: '4', label: 'Countries', Icon: Radio },
                ].map(({ value, label, Icon }) => (
                  <div key={label} className="text-center border border-line rounded-[4px] py-4 px-2">
                    <Icon size={16} className="text-primary mx-auto mb-1.5" />
                    <p className="text-[22px] font-bold text-ink leading-none">{value}</p>
                    <p className="text-[11px] uppercase tracking-[0.08em] text-body/60 font-light mt-1">{label}</p>
                  </div>
                ))}
              </div>
            </Reveal>
          </div>
        </div>
      </section>

      {/* Team */}
      <section className="site-section bg-section/45">
        <div className="max-w-container mx-auto px-4">
          <Reveal className="text-center mb-10">
            <h2 className="section-heading centered font-bold">The Team Behind The Mic</h2>
          </Reveal>
          <Reveal stagger={75} className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-6">
            {hosts.map((h) => (
              <div key={h.slug} className="text-center">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={h.photo} alt={h.name} className="w-full aspect-square object-cover rounded-full shadow-card mb-3" />
                <h3 className="text-[15px] text-ink font-normal">{h.name}</h3>
                <p className="text-[12px] text-body/70 font-light">{h.role}</p>
              </div>
            ))}
          </Reveal>
          <Reveal className="text-center mt-12">
            <p className="text-[15px] font-light text-body max-w-xl mx-auto mb-6">
              Want to host a show on the network or join the production team?
            </p>
            <div className="flex flex-wrap justify-center gap-4">
              <Link href="/guest" className="btn-primary-eapn">
                <Users size={15} /> Become a Guest
              </Link>
              <Link href="/contact" className="btn-dark-eapn">
                Work with us
              </Link>
            </div>
          </Reveal>
        </div>
      </section>

      {/* Studio strip */}
      <section className="site-section">
        <div className="max-w-container mx-auto px-4 grid md:grid-cols-2 gap-6">
          <Reveal variant="fade-left">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src="/images/about-mix.jpg" alt="The EAPN mix desk" className="rounded-[4px] shadow-card w-full object-cover" />
          </Reveal>
          <Reveal variant="fade-right">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src="/images/about-team.jpg" alt="Recording an interview at EAPN" className="rounded-[4px] shadow-card w-full object-cover" />
          </Reveal>
        </div>
      </section>
    </>
  );
}
