import type { Metadata, Viewport } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';
import { Header } from '@/components/layout/header';
import { Footer } from '@/components/layout/footer';
import { MobileContactDock } from '@/components/layout/MobileContactDock';
import { QueryProvider } from '@/lib/query-client';
import { OrganizationJsonLd, LocalBusinessJsonLd, WebSiteJsonLd } from '@/components/seo/JsonLd';
import { UIMonitor } from '@/components/ui/UIMonitor';
import dynamic from 'next/dynamic';

// Lazy load CosmicBackdrop for better initial load performance
const CosmicBackdrop = dynamic(
  () => import('@/components/ambient/CosmicBackdrop').then(mod => ({ default: mod.CosmicBackdrop })),
  { ssr: false }
);

// Inter font everywhere - Grayscale Pro typography
const inter = Inter({
  subsets: ['latin', 'cyrillic'],
  display: 'swap',
  variable: '--font-inter',
  preload: true,
  fallback: ['system-ui', '-apple-system', 'sans-serif'],
  weight: ['400', '500', '600', '700'],
});

export const metadata: Metadata = {
  title: {
    default: 'VA-PC | Игровые компьютеры',
    template: '%s | VA-PC',
  },
  description: 'Премиальные игровые ПК с RGB подсветкой. Сборка на заказ от профессионалов.',
  keywords: ['игровой компьютер', 'gaming PC', 'сборка ПК', 'RTX 4090', 'VA-PC'],
  authors: [{ name: 'VA-PC' }],
  creator: 'VA-PC',
  icons: {
    icon: '/icon.svg',
    shortcut: '/icon.svg',
    apple: '/icon.svg',
  },
  metadataBase: new URL('https://va-pc.ru'),
  openGraph: {
    type: 'website',
    locale: 'ru_RU',
    url: 'https://va-pc.ru',
    siteName: 'VA-PC',
    title: 'VA-PC | Игровые компьютеры',
    description: 'Премиальные игровые ПК с RGB подсветкой. Сборка на заказ от профессионалов.',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'VA-PC | Игровые компьютеры',
    description: 'Премиальные игровые ПК с RGB подсветкой',
  },
  robots: {
    index: true,
    follow: true,
  },
};

// Viewport configuration for mobile optimization
export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 5,
  themeColor: '#0A0A0A',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html
      lang="ru"
      className={inter.variable}
      suppressHydrationWarning
    >
      <head>
        {/*
          Preconnect to external image origins for faster resource loading.
          Note: Google Fonts preconnects are NOT needed - next/font downloads fonts
          at build time and self-hosts them from /_next/static/media/
        */}
        <link rel="preconnect" href="https://images.unsplash.com" />
        {/* VK API images */}
        <link rel="preconnect" href="https://sun1.userapi.com" />
        <link rel="preconnect" href="https://sun9.userapi.com" />

        {/* DNS prefetch for API endpoints */}
        <link rel="dns-prefetch" href="https://api.va-pc.ru" />
        <link rel="dns-prefetch" href="https://api.vk.com" />

        {/* Preload critical hero image for LCP optimization */}
        <link
          rel="preload"
          href="/Hero.png"
          as="image"
          type="image/png"
          fetchPriority="high"
        />

        {/* Prefetch catalog page for faster navigation */}
        <link rel="prefetch" href="/catalog" />

        {/* Structured Data for SEO */}
        <OrganizationJsonLd />
        <LocalBusinessJsonLd />
        <WebSiteJsonLd />
      </head>
      <body className="antialiased bg-black text-white min-h-screen flex flex-col font-inter">
        {/* Cosmic ambient background */}
        <CosmicBackdrop />
        
        {/* React Query Provider for data fetching */}
        <QueryProvider>
          {/* UI Monitor - Real-time monitoring of images and animations */}
          <UIMonitor enabled={true} />

          {/* Global Header */}
          <Header />

          {/* Main Content - pb-20 on mobile for MobileContactDock clearance */}
          <main className="flex-1 pt-20 pb-20 lg:pb-0">
            {children}
          </main>

          {/* Global Footer */}
          <Footer />

          {/* Mobile Contact Dock - Fixed panel for mobile */}
          <MobileContactDock />
        </QueryProvider>
      </body>
    </html>
  );
}
