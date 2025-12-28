import type { Metadata, Viewport } from 'next';
import { Orbitron, Outfit, JetBrains_Mono } from 'next/font/google';
import './globals.css';
import { Header } from '@/components/layout/header';
import { Footer } from '@/components/layout/footer';
import { QueryProvider } from '@/lib/query-client';

// Optimize font loading with next/font - prevents FOUT and improves CLS
const orbitron = Orbitron({
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-orbitron',
  preload: true,
  fallback: ['system-ui', 'sans-serif'],
});

const outfit = Outfit({
  subsets: ['latin', 'latin-ext'],
  display: 'swap',
  variable: '--font-outfit',
  preload: true,
  fallback: ['system-ui', 'sans-serif'],
});

const jetbrainsMono = JetBrains_Mono({
  subsets: ['latin', 'cyrillic'],
  display: 'swap',
  variable: '--font-mono',
  preload: true,
  fallback: ['Consolas', 'monospace'],
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
  themeColor: '#FF1E8E',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html
      lang="ru"
      className={`${orbitron.variable} ${outfit.variable} ${jetbrainsMono.variable}`}
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
          href="/gaming-pc-hero.png"
          as="image"
          type="image/png"
          fetchPriority="high"
        />

        {/* Prefetch catalog page for faster navigation */}
        <link rel="prefetch" href="/catalog" />
      </head>
      <body className="antialiased bg-black text-white min-h-screen flex flex-col font-outfit">
        {/* React Query Provider for data fetching */}
        <QueryProvider>
          {/* Global Header */}
          <Header />

          {/* Main Content */}
          <main className="flex-1 pt-20">
            {children}
          </main>

          {/* Global Footer */}
          <Footer />
        </QueryProvider>
      </body>
    </html>
  );
}
