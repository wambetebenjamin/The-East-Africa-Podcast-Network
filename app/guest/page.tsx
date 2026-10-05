import type { Metadata } from 'next';
import { Mic } from 'lucide-react';
import Reveal from '@/components/Reveal';
import GuestForm from '@/components/GuestForm';

export const metadata: Metadata = {
  title: 'Become a Guest',
  description: 'Want to be a guest on an East Africa Podcast Network show? Tell us about yourself.',
};

export default function GuestPage() {
  return (
    <>
      <header className="relative bg-night text-white">
        <div className="absolute inset-0 bg-cover bg-center opacity-35" style={{ backgroundImage: "url('/images/blog-home-studio.jpg')" }} aria-hidden />
        <div className="relative max-w-container mx-auto px-4 py-16 md:py-24 text-center">
          <h1 className="text-white font-black text-[32px] md:text-[44px] flex items-center justify-center gap-3">
            <Mic className="text-primary" size={34} /> Want to be a guest on a show?
          </h1>
          <p className="text-white/70 font-light mt-4 max-w-xl mx-auto">
            Founders, experts, witnesses and storytellers — our producers read every submission and
            reply within a week.
          </p>
        </div>
      </header>

      <section className="site-section">
        <div className="max-w-2xl mx-auto px-4">
          <Reveal variant="fade">
            <GuestForm />
          </Reveal>
        </div>
      </section>
    </>
  );
}
