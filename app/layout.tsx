import type { Metadata, Viewport } from 'next';
import '@fontsource/poppins/200.css';
import '@fontsource/poppins/300.css';
import '@fontsource/poppins/400.css';
import '@fontsource/poppins/700.css';
import '@fontsource/poppins/900.css';
import './globals.css';

import { site } from '@/lib/site';
import { RecaptchaProvider } from '@/components/Recaptcha';
import LoadingScreen from '@/components/LoadingScreen';
import CookieConsent from '@/components/CookieConsent';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import WhatsAppButton from '@/components/WhatsAppButton';
import AudioPlayer from '@/components/AudioPlayer';
import PlayerSpacer from '@/components/PlayerSpacer';
import ServiceWorkerRegister from '@/components/ServiceWorkerRegister';

export const metadata: Metadata = {
  metadataBase: new URL(site.url),
  title: {
    default: `${site.name} — ${site.tagline}`,
    template: `%s | ${site.name}`,
  },
  description: site.description,
  openGraph: {
    type: 'website',
    locale: 'en_KE',
    siteName: site.name,
    title: `${site.name} — ${site.tagline}`,
    description: site.description,
    images: [{ url: '/images/hero-studio.jpg', width: 1600, height: 900, alt: site.name }],
  },
  twitter: {
    card: 'summary_large_image',
    site: '@eastafricapods',
  },
  manifest: '/manifest.webmanifest',
  icons: {
    icon: [
      { url: '/icons/favicon-32.png', sizes: '32x32', type: 'image/png' },
      { url: '/icons/favicon.ico', sizes: 'any' },
    ],
    apple: '/icons/apple-touch-icon.png',
  },
};

export const viewport: Viewport = {
  themeColor: '#0a0a0a',
  width: 'device-width',
  initialScale: 1,
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    name: site.name,
    url: site.url,
    description: site.description,
    inLanguage: 'en',
    publisher: {
      '@type': 'Organization',
      name: site.name,
      logo: `${site.url}/icons/icon-512.png`,
    },
  };

  return (
    <html lang="en" className="scroll-pt-[72px]">
      <body className="bg-white text-body">
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
        <RecaptchaProvider>
          <LoadingScreen />
          <Navbar />
          <main id="main">{children}</main>
          <Footer />
          <WhatsAppButton />
          <AudioPlayer />
          <PlayerSpacer />
          <CookieConsent />
          <ServiceWorkerRegister />
        </RecaptchaProvider>
      </body>
    </html>
  );
}
