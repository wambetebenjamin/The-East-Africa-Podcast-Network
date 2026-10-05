import Link from 'next/link';
import { Headphones, Instagram, Mail, Podcast, Radio, Twitter, Youtube, Phone } from 'lucide-react';
import { site, whatsappLink } from '@/lib/site';
import { CATEGORIES } from '@/lib/types';
import NewsletterForm from './NewsletterForm';

/**
 * Footer reproducing the zip's .site-footer (#333 bg, 20px white headings,
 * #737373 text, #999 links → white hover, 4em padding) plus the brief's
 * required link groups and newsletter signup.
 */
export default function Footer() {
  return (
    <footer className="bg-footer text-white/70">
      <div className="max-w-container mx-auto px-4 pt-16 pb-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10">
          {/* About + recent */}
          <div>
            <h3 className="text-[20px] text-white font-normal mb-4">About EAPN</h3>
            <p className="text-[14px] leading-relaxed text-footer-text font-light mb-6">
              The East Africa Podcast Network is Nairobi’s home for podcasts that inform, inspire
              and entertain — 10 original shows made for listeners from Nairobi to Kigali.
            </p>
            <div className="flex items-center gap-3">
              {[
                { href: site.social.spotify, label: 'Spotify', Icon: Radio },
                { href: site.social.apple, label: 'Apple Podcasts', Icon: Podcast },
                { href: site.social.youtube, label: 'YouTube', Icon: Youtube },
                { href: site.social.instagram, label: 'Instagram', Icon: Instagram },
                { href: site.social.twitter, label: 'Twitter', Icon: Twitter },
              ].map(({ href, label, Icon }) => (
                <a
                  key={label}
                  href={href}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={label}
                  className="text-footer-link hover:text-white transition-colors"
                >
                  <Icon size={18} />
                </a>
              ))}
            </div>
          </div>

          {/* Quick links */}
          <div>
            <h3 className="text-[20px] text-white font-normal mb-4">Quick Links</h3>
            <ul className="space-y-2.5 text-[14px] font-light">
              {site.nav.map((n) => (
                <li key={n.href}>
                  <Link href={n.href} className="text-footer-link hover:text-white">
                    {n.label}
                  </Link>
                </li>
              ))}
              <li>
                <Link href="/advertise" className="text-footer-link hover:text-white">
                  For Advertisers
                </Link>
              </li>
              <li>
                <Link href="/dashboard" className="text-footer-link hover:text-white">
                  Listener Dashboard
                </Link>
              </li>
              <li>
                <Link href="/request" className="text-footer-link hover:text-white">
                  Suggest an Episode
                </Link>
              </li>
              <li>
                <Link href="/guest" className="text-footer-link hover:text-white">
                  Become a Guest
                </Link>
              </li>
            </ul>
          </div>

          {/* Categories */}
          <div>
            <h3 className="text-[20px] text-white font-normal mb-4">Episode Categories</h3>
            <ul className="grid grid-cols-2 gap-2.5 text-[14px] font-light">
              {CATEGORIES.map((c) => (
                <li key={c}>
                  <Link href={`/shows?category=${encodeURIComponent(c)}`} className="text-footer-link hover:text-white">
                    {c}
                  </Link>
                </li>
              ))}
            </ul>
            <ul className="mt-6 space-y-2.5 text-[14px] font-light">
              <li>
                <Link href="/legal/privacy-policy" className="text-footer-link hover:text-white">
                  Privacy Policy
                </Link>
              </li>
              <li>
                <Link href="/legal/terms" className="text-footer-link hover:text-white">
                  Terms &amp; Conditions
                </Link>
              </li>
              <li>
                <Link href="/legal/cookie-policy" className="text-footer-link hover:text-white">
                  Cookie Policy
                </Link>
              </li>
            </ul>
          </div>

          {/* Newsletter + contact */}
          <div>
            <h3 className="text-[20px] text-white font-normal mb-2">Subscribe Newsletter</h3>
            <p className="text-[13px] text-footer-text font-light mb-4">
              New episodes delivered to your inbox every week.
            </p>
            <NewsletterForm compact />
            <div className="mt-6 space-y-2 text-[13px] font-light">
              <a href={whatsappLink('Hello! I have a suggestion for The East Africa Podcast Network.')} target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 text-footer-link hover:text-white">
                <Phone size={14} className="text-primary" /> WhatsApp +254 112 272 061
              </a>
              <a href={`mailto:${site.email}`} className="flex items-center gap-2 text-footer-link hover:text-white">
                <Mail size={14} className="text-primary" /> {site.email}
              </a>
              <p className="flex items-center gap-2 text-footer-text">
                <Headphones size={14} className="text-primary" /> Nairobi, Kenya
              </p>
            </div>
          </div>
        </div>

        <div className="border-t border-white/10 mt-12 pt-6 text-center text-[12px] text-footer-text font-light">
          © {new Date().getFullYear()} The East Africa Podcast Network. All rights reserved. Made in Nairobi.
        </div>
      </div>
    </footer>
  );
}
