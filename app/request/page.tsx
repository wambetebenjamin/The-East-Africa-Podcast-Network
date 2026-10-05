import type { Metadata } from 'next';
import { Lightbulb } from 'lucide-react';
import Reveal from '@/components/Reveal';
import EpisodeRequestForm from '@/components/EpisodeRequestForm';

export const metadata: Metadata = {
  title: 'Suggest an Episode',
  description: 'Have a topic or guest you want The East Africa Podcast Network to cover? Tell us.',
};

export default function RequestPage() {
  return (
    <>
      <header className="relative bg-night text-white">
        <div className="absolute inset-0 bg-cover bg-center opacity-35" style={{ backgroundImage: "url('/images/blog-nairobi-stories.jpg')" }} aria-hidden />
        <div className="relative max-w-container mx-auto px-4 py-16 md:py-24 text-center">
          <h1 className="text-white font-black text-[32px] md:text-[44px] flex items-center justify-center gap-3">
            <Lightbulb className="text-primary" size={34} /> Have a topic or guest you want us to cover?
          </h1>
          <p className="text-white/70 font-light mt-4 max-w-xl mx-auto">
            Every show on the network started with a listener suggestion. Ours go straight to the
            producers’ WhatsApp.
          </p>
        </div>
      </header>

      <section className="site-section">
        <div className="max-w-2xl mx-auto px-4">
          <Reveal variant="fade">
            <EpisodeRequestForm />
          </Reveal>
        </div>
      </section>
    </>
  );
}
