import Link from 'next/link';
import { Headphones, Search } from 'lucide-react';
import SearchBar from '@/components/SearchBar';

/**
 * Branded 404 — “This episode or page is gone.” with Browse All Episodes CTA
 * and a search bar (dark hero style from the design source).
 */
export default function NotFound() {
  return (
    <section className="relative min-h-[80vh] flex items-center bg-night overflow-hidden">
      <div className="absolute inset-0 bg-cover bg-center opacity-25" style={{ backgroundImage: "url('/images/hero-studio.jpg')" }} aria-hidden />
      <div className="absolute inset-0 bg-gradient-to-t from-night via-night/80 to-night/60" aria-hidden />
      <div className="relative max-w-container mx-auto px-4 py-24 text-center">
        <p className="text-primary font-black text-[64px] md:text-[90px] leading-none tracking-tight">404</p>
        <h1 className="text-white font-black text-[26px] md:text-[36px] mt-4">
          This episode or page is gone.
        </h1>
        <p className="text-white/60 font-light mt-3 max-w-md mx-auto">
          The link may be old, or the episode has moved. Try a search, or browse what is playing now.
        </p>
        <div className="flex flex-wrap justify-center gap-4 mt-8">
          <Link href="/episodes" className="btn-primary-eapn">
            <Headphones size={15} /> Browse All Episodes
          </Link>
          <Link href="/" className="btn-outline-eapn">
            Back Home
          </Link>
        </div>
        <div className="max-w-md mx-auto mt-10">
          <SearchBar />
        </div>
      </div>
    </section>
  );
}
