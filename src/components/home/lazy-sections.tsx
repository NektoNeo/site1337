'use client';

/**
 * Lazy-loaded homepage sections
 *
 * These components are dynamically imported to reduce initial bundle size.
 * Each section only loads when the user scrolls near it.
 *
 * Expected bundle size reduction: ~150-200KB initial JS
 */

import dynamic from 'next/dynamic';
import { ComponentType, ReactNode } from 'react';

// ============================================================================
// LOADING SKELETONS
// ============================================================================

function SectionSkeleton({ height = 'min-h-[400px]' }: { height?: string }) {
  return (
    <div className={`${height} w-full animate-pulse`}>
      <div className="container mx-auto px-4 py-24">
        {/* Title skeleton */}
        <div className="flex flex-col items-center mb-16">
          <div className="h-10 w-64 bg-white/5 rounded-lg mb-4" />
          <div className="h-5 w-96 bg-white/5 rounded-lg" />
        </div>
        {/* Content skeleton - grid of cards */}
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
          {[...Array(4)].map((_, i) => (
            <div key={i} className="h-64 bg-white/5 rounded-2xl" />
          ))}
        </div>
      </div>
    </div>
  );
}

function ProductsSkeleton() {
  return (
    <div className="min-h-[600px] w-full animate-pulse">
      <div className="container mx-auto px-4 py-24">
        <div className="flex flex-col items-center mb-16">
          <div className="h-10 w-72 bg-white/5 rounded-lg mb-4" />
          <div className="h-5 w-80 bg-white/5 rounded-lg" />
        </div>
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {[...Array(6)].map((_, i) => (
            <div key={i} className="bg-white/5 rounded-2xl p-4">
              <div className="aspect-square bg-white/5 rounded-lg mb-4" />
              <div className="h-5 w-3/4 bg-white/5 rounded mb-2" />
              <div className="h-4 w-1/2 bg-white/5 rounded mb-4" />
              <div className="h-8 w-1/3 bg-white/5 rounded" />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

function CasesSkeleton() {
  return (
    <div className="min-h-[500px] w-full animate-pulse">
      <div className="container mx-auto px-4 py-24">
        <div className="flex flex-col items-center mb-16">
          <div className="h-10 w-56 bg-white/5 rounded-lg mb-4" />
        </div>
        <div className="grid md:grid-cols-3 gap-6">
          {[...Array(3)].map((_, i) => (
            <div key={i} className="aspect-video bg-white/5 rounded-2xl" />
          ))}
        </div>
      </div>
    </div>
  );
}

// ============================================================================
// LAZY LOADED COMPONENTS
// ============================================================================

/**
 * Services section - "НАШИ УСЛУГИ"
 * First below-fold section, load with slight delay
 */
export const LazyServices = dynamic(
  () => import('./Services').then(mod => ({ default: mod.Services })),
  {
    loading: () => <SectionSkeleton />,
    ssr: true, // SSR for SEO
  }
);

/**
 * Featured Products - "ЛУЧШЕЕ РЕШЕНИЕ ДЛЯ ВАС"
 * Heavy component with product cards
 */
export const LazyFeaturedProducts = dynamic(
  () => import('./FeaturedProducts').then(mod => ({ default: mod.FeaturedProducts })),
  {
    loading: () => <ProductsSkeleton />,
    ssr: true,
  }
);

/**
 * Payment section - "РАССРОЧКА"
 */
export const LazyPayment = dynamic(
  () => import('./Payment').then(mod => ({ default: mod.Payment })),
  {
    loading: () => <SectionSkeleton height="min-h-[300px]" />,
    ssr: true,
  }
);

/**
 * Stages section - "ЭТАПЫ РАБОТЫ"
 */
export const LazyStages = dynamic(
  () => import('./Stages').then(mod => ({ default: mod.Stages })),
  {
    loading: () => <SectionSkeleton />,
    ssr: true,
  }
);

/**
 * Gifts section - "ВМЕСТЕ С ПК ВЫ ПОЛУЧИТЕ"
 */
export const LazyGifts = dynamic(
  () => import('./Gifts').then(mod => ({ default: mod.Gifts })),
  {
    loading: () => <SectionSkeleton height="min-h-[350px]" />,
    ssr: true,
  }
);

/**
 * Advantages section - "НАШИ ПРЕИМУЩЕСТВА"
 */
export const LazyAdvantages = dynamic(
  () => import('./Advantages').then(mod => ({ default: mod.Advantages })),
  {
    loading: () => <SectionSkeleton />,
    ssr: true,
  }
);

/**
 * Socials section - "НАШИ СОЦИАЛЬНЫЕ СЕТИ"
 */
export const LazySocials = dynamic(
  () => import('./Socials').then(mod => ({ default: mod.Socials })),
  {
    loading: () => <SectionSkeleton height="min-h-[250px]" />,
    ssr: true,
  }
);

/**
 * Cases section - "НАШИ КЕЙСЫ"
 */
export const LazyCases = dynamic(
  () => import('./Cases').then(mod => ({ default: mod.Cases })),
  {
    loading: () => <CasesSkeleton />,
    ssr: true,
  }
);

/**
 * Live feed section - "LIVE ЛЕНТА"
 */
export const LazyLive = dynamic(
  () => import('./Live').then(mod => ({ default: mod.Live })),
  {
    loading: () => <SectionSkeleton />,
    ssr: true,
  }
);

/**
 * CTA Section - Contact form
 */
export const LazyCTASection = dynamic(
  () => import('./CTASection').then(mod => ({ default: mod.CTASection })),
  {
    loading: () => <SectionSkeleton height="min-h-[400px]" />,
    ssr: true,
  }
);

// ============================================================================
// VIEWPORT-BASED LAZY WRAPPER
// ============================================================================

import { useIntersectionLazyLoad } from '@/lib/lazy-components';

interface LazyViewportSectionProps {
  children: ReactNode;
  fallback?: ReactNode;
  className?: string;
  rootMargin?: string;
}

/**
 * Wrapper that only renders children when section enters viewport
 * Uses Intersection Observer for efficient detection
 */
export function LazyViewportSection({
  children,
  fallback = <SectionSkeleton />,
  className = '',
  rootMargin = '200px', // Start loading 200px before visible
}: LazyViewportSectionProps) {
  const { ref, hasIntersected } = useIntersectionLazyLoad({ rootMargin });

  return (
    <div ref={ref} className={className}>
      {hasIntersected ? children : fallback}
    </div>
  );
}
