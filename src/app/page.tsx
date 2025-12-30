'use client';

import { useRef, useState, useEffect, useMemo, memo, Suspense } from 'react';
import dynamic from 'next/dynamic';
import Link from 'next/link';
import { useDeferredAnimation } from '@/providers/AnimationDeferProvider';

// Critical above-fold components loaded immediately
import { Hero } from '@/components/home/Hero';
import { SectionDivider } from '@/components/ambient/SectionDivider';

// Lazy load cosmic effects - only after LCP
const LazyInteractiveStarfield = dynamic(
  () => import('@/components/ambient/InteractiveStarfield').then(mod => ({ default: mod.InteractiveStarfield })),
  { ssr: false }
);

const LazyCosmicTransition = dynamic(
  () => import('@/components/ambient/CosmicTransition').then(mod => ({ default: mod.CosmicTransition })),
  { ssr: false }
);

const LazyZeroGravityLiquid = dynamic(
  () => import('@/components/ambient/ZeroGravityLiquid').then(mod => ({ default: mod.ZeroGravityLiquid })),
  { ssr: false }
);

// Lazy load the animated background (heavy CSS animations)
const AnimatedBackground = dynamic(
  () => import('@/components/ui/AnimatedBackground').then(mod => ({ default: mod.AnimatedBackground })),
  { ssr: false }
);

// Lazy load all below-fold sections
const LazyServices = dynamic(
  () => import('@/components/home/Services').then(mod => ({ default: mod.Services })),
  { ssr: true }
);

const LazyFeaturedProducts = dynamic(
  () => import('@/components/home/FeaturedProducts').then(mod => ({ default: mod.FeaturedProducts })),
  { ssr: true }
);

const LazyPayment = dynamic(
  () => import('@/components/home/Payment').then(mod => ({ default: mod.Payment })),
  { ssr: true }
);

const LazyStages = dynamic(
  () => import('@/components/home/Stages').then(mod => ({ default: mod.Stages })),
  { ssr: true }
);

const LazyConfiguratorCTA = dynamic(
  () => import('@/components/home/ConfiguratorCTA').then(mod => ({ default: mod.ConfiguratorCTA })),
  { ssr: true }
);

const LazyGifts = dynamic(
  () => import('@/components/home/Gifts').then(mod => ({ default: mod.Gifts })),
  { ssr: true }
);

const LazyAdvantages = dynamic(
  () => import('@/components/home/Advantages').then(mod => ({ default: mod.Advantages })),
  { ssr: true }
);

const LazySocials = dynamic(
  () => import('@/components/home/Socials').then(mod => ({ default: mod.Socials })),
  { ssr: true }
);

const LazyCases = dynamic(
  () => import('@/components/home/Cases').then(mod => ({ default: mod.Cases })),
  { ssr: true }
);

const LazyWorksGallery = dynamic(
  () => import('@/components/home/WorksGallery').then(mod => ({ default: mod.WorksGallery })),
  { ssr: true }
);

const LazyLive = dynamic(
  () => import('@/components/home/Live').then(mod => ({ default: mod.Live })),
  { ssr: true }
);

const LazyCTASection = dynamic(
  () => import('@/components/home/CTASection').then(mod => ({ default: mod.CTASection })),
  { ssr: true }
);

// ============================================================================
// OPTIMIZED FLOATING PARTICLES - CSS ONLY
// ============================================================================

/**
 * Reduced particle count and uses CSS animations instead of Framer Motion.
 * Particles are only rendered after LCP.
 */
const FloatingParticles = memo(function FloatingParticles() {
  const { canAnimate } = useDeferredAnimation();

  if (!canAnimate) return null;

  return (
    <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden">
      {[0, 1, 2, 3, 4, 5].map((i) => (
        <div
          key={i}
          className="absolute w-1 h-1 rounded-full will-change-transform animate-float-particle"
          style={{
            left: `${10 + i * 15}%`,
            top: `${20 + (i % 3) * 25}%`,
            background: i % 2 === 0 ? '#8B5CF6' : '#7C3AED',
            boxShadow: i % 2 === 0
              ? '0 0 10px #8B5CF6, 0 0 20px #8B5CF6'
              : '0 0 10px #7C3AED, 0 0 20px #7C3AED',
            animationDelay: `${i * 0.8}s`,
            animationDuration: `${5 + i * 0.5}s`,
          }}
        />
      ))}
    </div>
  );
});

// ============================================================================
// WATER COOLING SECTION - CSS ANIMATED
// ============================================================================

const WaterCoolingSection = memo(function WaterCoolingSection() {
  const { canAnimate } = useDeferredAnimation();
  const [isVisible, setIsVisible] = useState(false);
  const sectionRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!canAnimate) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          observer.disconnect();
        }
      },
      { threshold: 0.3 }
    );

    if (sectionRef.current) {
      observer.observe(sectionRef.current);
    }

    return () => observer.disconnect();
  }, [canAnimate]);

  return (
    <div ref={sectionRef} className="relative h-48 md:h-64 overflow-hidden">
      <Suspense fallback={null}>
        <LazyZeroGravityLiquid dropletCount={6} colorScheme="purple" interactive={false} />
      </Suspense>
      {/* Overlay text - CSS animated */}
      <div className="absolute inset-0 flex items-center justify-center z-10">
        <div className="text-center">
          <h3
            className={`text-2xl md:text-4xl font-bold bg-gradient-to-r from-purple-400 via-fuchsia-400 to-purple-400 bg-clip-text text-transparent mb-2 transition-all duration-700 ${
              isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-5'
            }`}
          >
            Водяное охлаждение
          </h3>
          <p
            className={`text-white/60 text-sm md:text-base transition-all duration-700 delay-200 ${
              isVisible ? 'opacity-100' : 'opacity-0'
            }`}
          >
            Невесомость. Тишина. Производительность.
          </p>
        </div>
      </div>
    </div>
  );
});

// ============================================================================
// PREFETCH LINK FOR CATALOG
// ============================================================================

function CatalogPrefetch() {
  return (
    <Link href="/catalog" prefetch={true} className="hidden" aria-hidden="true">
      Catalog
    </Link>
  );
}

// ============================================================================
// MAIN PAGE COMPONENT
// ============================================================================

export default function HomePage() {
  const { canAnimate } = useDeferredAnimation();

  return (
    <div className="relative min-h-screen overflow-hidden">
      {/* Prefetch catalog page for faster navigation */}
      <CatalogPrefetch />

      {/* Global animated background - only after LCP */}
      {canAnimate && (
        <Suspense fallback={null}>
          <AnimatedBackground />
        </Suspense>
      )}

      {/* Interactive Starfield - only after LCP */}
      {canAnimate && (
        <Suspense fallback={null}>
          <LazyInteractiveStarfield starCount={40} parallaxStrength={15} />
        </Suspense>
      )}

      {/* Floating RGB Particles - CSS animated, only after LCP */}
      <FloatingParticles />

      {/* Main content */}
      <div className="relative z-10">
        {/* 1. Hero Section with Trust Metrics */}
        <Hero />

        <SectionDivider variant="glow" intensity="strong" />

        {/* 2. Services - "НАШИ УСЛУГИ" (lazy loaded) */}
        <div id="services" />
        <Suspense fallback={<SectionSkeleton />}>
          <LazyServices />
        </Suspense>

        {/* Cosmic Transition: Nebula effect - only after LCP */}
        {canAnimate && (
          <Suspense fallback={null}>
            <LazyCosmicTransition variant="nebula" intensity="subtle" height="h-32 md:h-48" />
          </Suspense>
        )}

        {/* 3. Products - "ЛУЧШЕЕ РЕШЕНИЕ ДЛЯ ВАС" (lazy loaded) */}
        <Suspense fallback={<ProductsSkeleton />}>
          <LazyFeaturedProducts />
        </Suspense>

        {/* Cosmic Transition: Warp speed - only after LCP */}
        {canAnimate && (
          <Suspense fallback={null}>
            <LazyCosmicTransition variant="warp" intensity="subtle" height="h-24 md:h-32" />
          </Suspense>
        )}

        {/* 4. Payment - "РАССРОЧКА" (lazy loaded) */}
        <Suspense fallback={<SectionSkeleton />}>
          <LazyPayment />
        </Suspense>

        <SectionDivider variant="minimal" />

        {/* 5. Stages - "ЭТАПЫ РАБОТЫ" (lazy loaded) */}
        <Suspense fallback={<SectionSkeleton />}>
          <LazyStages />
        </Suspense>

        <SectionDivider variant="glow" intensity="medium" />

        {/* 5.5. Configurator CTA - "ПОПРОБУЙ СОБРАТЬ САМ" (lazy loaded) */}
        <div id="configurator" />
        <Suspense fallback={<SectionSkeleton />}>
          <LazyConfiguratorCTA />
        </Suspense>

        <SectionDivider variant="orb" intensity="subtle" />

        {/* 6. Gifts - "ВМЕСТЕ С ПК ВЫ ПОЛУЧИТЕ" (lazy loaded) */}
        <Suspense fallback={<SectionSkeleton />}>
          <LazyGifts />
        </Suspense>

        <SectionDivider variant="glow" intensity="subtle" />

        {/* 7. Advantages - "НАШИ ПРЕИМУЩЕСТВА" (lazy loaded) */}
        <div id="about" />
        <Suspense fallback={<SectionSkeleton />}>
          <LazyAdvantages />
        </Suspense>

        <SectionDivider variant="minimal" />

        {/* 8. Socials - "НАШИ СОЦИАЛЬНЫЕ СЕТИ" (lazy loaded) */}
        <Suspense fallback={<SectionSkeleton />}>
          <LazySocials />
        </Suspense>

        <SectionDivider variant="orb" intensity="subtle" />

        {/* 9. Cases - "НАШИ КЕЙСЫ" (lazy loaded) */}
        <div id="reviews" />
        <Suspense fallback={<CasesSkeleton />}>
          <LazyCases />
        </Suspense>

        <SectionDivider variant="glow" intensity="strong" />

        {/* 10. Works Gallery - "НАШИ РАБОТЫ" (lazy loaded) */}
        <Suspense fallback={<WorksSkeleton />}>
          <LazyWorksGallery />
        </Suspense>

        {/* Water Cooling Section - CSS animated */}
        <WaterCoolingSection />

        {/* 11. Live - "LIVE ЛЕНТА" (lazy loaded) */}
        <Suspense fallback={<SectionSkeleton />}>
          <LazyLive />
        </Suspense>

        <SectionDivider variant="wave" intensity="medium" />

        {/* 12. Form - Contact / CTA Section (lazy loaded) */}
        <Suspense fallback={<SectionSkeleton />}>
          <LazyCTASection />
        </Suspense>
      </div>

      {/* Bottom gradient fade */}
      <div className="fixed bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-black via-black/50 to-transparent pointer-events-none z-20" />
    </div>
  );
}

// ============================================================================
// LOADING SKELETONS
// ============================================================================

function SectionSkeleton() {
  return (
    <div className="min-h-[400px] w-full animate-pulse">
      <div className="container mx-auto px-4 py-24">
        <div className="flex flex-col items-center mb-16">
          <div className="h-10 w-64 bg-white/5 rounded-lg mb-4" />
          <div className="h-5 w-96 bg-white/5 rounded-lg" />
        </div>
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

function WorksSkeleton() {
  return (
    <div className="min-h-[600px] w-full animate-pulse">
      <div className="container mx-auto px-4 py-24">
        <div className="flex flex-col items-center mb-16">
          <div className="h-10 w-64 bg-white/5 rounded-lg mb-4" />
          <div className="h-5 w-96 bg-white/5 rounded-lg" />
        </div>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {[...Array(8)].map((_, i) => (
            <div key={i} className="aspect-square bg-white/5 rounded-xl" />
          ))}
        </div>
      </div>
    </div>
  );
}
