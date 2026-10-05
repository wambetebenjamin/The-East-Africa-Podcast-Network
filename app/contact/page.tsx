import type { Metadata } from 'next';
import { Mail, MapPin, MessageCircle, Phone } from 'lucide-react';
import { site, whatsappLink } from '@/lib/site';
import Reveal from '@/components/Reveal';
import ContactForm from '@/components/ContactForm';

export const metadata: Metadata = {
  title: 'Contact',
  description: 'General enquiries, press and technical support for The East Africa Podcast Network.',
};

export default function ContactPage() {
  return (
    <>
      <header className="relative bg-night text-white">
        <div className="absolute inset-0 bg-cover bg-center opacity-35" style={{ backgroundImage: "url('/images/about-mix.jpg')" }} aria-hidden />
        <div className="relative max-w-container mx-auto px-4 py-16 md:py-24 text-center">
          <h1 className="text-white font-black text-[34px] md:text-[46px]">Contact Us</h1>
          <p className="text-white/70 font-light mt-3 max-w-xl mx-auto">
            General enquiries, press and technical support — we answer everything within two working days.
          </p>
        </div>
      </header>

      <section className="site-section">
        <div className="max-w-container mx-auto px-4">
          <div className="grid lg:grid-cols-[1fr_360px] gap-10">
            <Reveal variant="fade">
              <ContactForm />
            </Reveal>

            <Reveal variant="fade-left" className="space-y-4">
              <div className="card-eapn p-6">
                <h3 className="text-[16px] font-normal text-ink mb-4">General enquiries</h3>
                <p className="text-[14px] font-light text-body flex items-center gap-2 mb-2">
                  <Mail size={14} className="text-primary" /> {site.email}
                </p>
                <p className="text-[13px] font-light text-body/70">
                  Partnerships, show pitches, feedback and everything else.
                </p>
              </div>
              <div className="card-eapn p-6">
                <h3 className="text-[16px] font-normal text-ink mb-4">Press</h3>
                <p className="text-[14px] font-light text-body flex items-center gap-2 mb-2">
                  <Mail size={14} className="text-primary" /> {site.pressEmail}
                </p>
                <p className="text-[13px] font-light text-body/70">
                  Interview requests, network data and media assets.
                </p>
              </div>
              <div className="card-eapn p-6">
                <h3 className="text-[16px] font-normal text-ink mb-4">Technical support</h3>
                <p className="text-[14px] font-light text-body flex items-center gap-2 mb-2">
                  <Mail size={14} className="text-primary" /> {site.supportEmail}
                </p>
                <p className="text-[13px] font-light text-body/70">
                  App, feed and playback issues — we read every report.
                </p>
              </div>
              <a
                href={whatsappLink('Hello! I have a suggestion for The East Africa Podcast Network.')}
                target="_blank"
                rel="noopener noreferrer"
                className="card-eapn p-6 block hover:shadow-card transition-shadow border-2 !border-primary/20"
              >
                <h3 className="text-[16px] font-normal text-ink mb-3 flex items-center gap-2">
                  <Phone size={15} className="text-primary" /> WhatsApp us directly
                </h3>
                <p className="text-[14px] font-light text-body mb-2">Fastest for episode suggestions and sponsorships.</p>
                <p className="text-primary text-[14px] inline-flex items-center gap-1.5">
                  <MessageCircle size={14} /> +254 112 272 061
                </p>
              </a>
              <div className="card-eapn p-6">
                <h3 className="text-[16px] font-normal text-ink mb-3 flex items-center gap-2">
                  <MapPin size={15} className="text-primary" /> Studios
                </h3>
                <p className="text-[14px] font-light text-body">
                  EAPN House, Ngong Road
                  <br />
                  Nairobi, Kenya
                </p>
              </div>
            </Reveal>
          </div>
        </div>
      </section>
    </>
  );
}
