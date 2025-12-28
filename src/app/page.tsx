'use client';

import { motion, useScroll, useTransform } from 'framer-motion';
import { useRef, useState, useEffect, useMemo, memo, Suspense } from 'react';
import dynamic from 'next/dynamic';
import Link from 'next/link';

// Critical above-fold components loaded immediately
import { Hero } from '@/components/home/Hero/index';

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

const LazyLive = dynamic(
  () => import('@/components/home/Live').then(mod => ({ default: mod.Live })),
  { ssr: true }
);

const LazyCTASection = dynamic(
  () => import('@/components/home/CTASection').then(mod => ({ default: mod.CTASection })),
  { ssr: true }
);

// ============================================================================
// OPTIMIZED FLOATING PARTICLES
// ============================================================================

/**
 * Reduced particle count and optimized for performance.
 * Uses CSS animations where possible to reduce JS overhead.
 * Memoized to prevent unnecessary re-renders.
 */
const FloatingParticles = memo(function FloatingParticles() {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  // Reduced from 10 to 6 particles for better performance
  const particles = useMemo(() => {
    if (!mounted) return [];
    return [...Array(6)].map((_, i) => ({
      id: i,
      left: Math.random() * 100,
      top: Math.random() * 100,
      xOffset: Math.random() * 50 - 25,
      duration: 5 + Math.random() * 5,
      delay: Math.random() * 5,
      isEven: i % 2 === 0,
    }));
  }, [mounted]);

  if (!mounted) return null;

  return (
    <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden">
      {particles.map((particle) => (
        <motion.div
          key={particle.id}
          className="absolute w-1 h-1 rounded-full will-change-transform"
          style={{
            left: `${particle.left}%`,
            top: `${particle.top}%`,
            background: particle.isEven ? '#8B5CF6' : '#FF1E8E',
            boxShadow: particle.isEven
              ? '0 0 10px #8B5CF6, 0 0 20px #8B5CF6'
              : '0 0 10px #FF1E8E, 0 0 20px #FF1E8E',
          }}
          animate={{
            y: [0, -100, 0],
            x: [0, particle.xOffset, 0],
            opacity: [0, 1, 0],
            scale: [0, 1, 0],
          }}
          transition={{
            duration: particle.duration,
            repeat: Infinity,
            delay: particle.delay,
            ease: 'easeInOut',
          }}
        />
      ))}
    </div>
  );
});

// ============================================================================
// SECTION DIVIDER - MEMOIZED
// ============================================================================

const SectionDivider = memo(function SectionDivider() {
  return (
    <div className="relative h-px w-full max-w-4xl mx-auto my-8">
      <motion.div
        className="absolute inset-0 bg-gradient-to-r from-transparent via-purple-500 to-transparent"
        initial={{ scaleX: 0, opacity: 0 }}
        whileInView={{ scaleX: 1, opacity: 1 }}
        viewport={{ once: true, margin: '-50px' }}
        transition={{ duration: 1, ease: 'easeOut' }}
      />
      <motion.div
        className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-3 h-3"
        initial={{ scale: 0, rotate: 0 }}
        whileInView={{ scale: 1, rotate: 45 }}
        viewport={{ once: true, margin: '-50px' }}
        transition={{ duration: 0.5, delay: 0.5 }}
      >
        <div className="w-full h-full bg-gradient-to-br from-purple-500 to-pink-500 rounded-sm" />
      </motion.div>
    </div>
  );
});

// ============================================================================
// SCROLL PROGRESS - OPTIMIZED WITH WILL-CHANGE
// ============================================================================

const ScrollProgress = memo(function ScrollProgress() {
  const { scrollYProgress } = useScroll();

  return (
    <motion.div
      className="fixed top-20 left-0 right-0 h-[2px] bg-gradient-to-r from-purple-600 via-pink-500 to-purple-600 origin-left z-50 will-change-transform"
      style={{ scaleX: scrollYProgress }}
    />
  );
});

// ============================================================================
// PREFETCH LINK FOR CATALOG
// ============================================================================

/**
 * Hidden prefetch link for catalog page.
 * Next.js will prefetch this route on hover or when it enters viewport.
 */
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
  const containerRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ['start start', 'end end'],
  });

  // Parallax effects for background elements
  const bgY = useTransform(scrollYProgress, [0, 1], ['0%', '50%']);
  const bgOpacity = useTransform(scrollYProgress, [0, 0.5, 1], [1, 0.5, 0.3]);

  return (
    <div ref={containerRef} className="relative min-h-screen overflow-hidden" style={{ position: 'relative' }}>
      {/* Prefetch catalog page for faster navigation */}
      <CatalogPrefetch />

      {/* Scroll Progress Indicator */}
      <ScrollProgress />

      {/* Global animated background with parallax - lazy loaded */}
      <Suspense fallback={null}>
        <motion.div style={{ y: bgY, opacity: bgOpacity }}>
          <AnimatedBackground />
        </motion.div>
      </Suspense>

      {/* Floating RGB Particles - reduced count */}
      <FloatingParticles />

      {/* Main content - Section order from original va-pc.ru */}
      <div className="relative z-10">
        {/* 1. Hero Section - Main headline and featured PC (CRITICAL - loaded immediately) */}
        <Hero />

        <SectionDivider />

        {/* 2. Services - "НАШИ УСЛУГИ" (lazy loaded) */}
        <Suspense fallback={<SectionSkeleton />}>
          <LazyServices />
        </Suspense>

        <SectionDivider />

        {/* 3. Products - "ЛУЧШЕЕ РЕШЕНИЕ ДЛЯ ВАС" (lazy loaded) */}
        <Suspense fallback={<ProductsSkeleton />}>
          <LazyFeaturedProducts />
        </Suspense>

        <SectionDivider />

        {/* 4. Payment - "РАССРОЧКА" (lazy loaded) */}
        <Suspense fallback={<SectionSkeleton />}>
          <LazyPayment />
        </Suspense>

        <SectionDivider />

        {/* 5. Stages - "ЭТАПЫ РАБОТЫ" (lazy loaded) */}
        <Suspense fallback={<SectionSkeleton />}>
          <LazyStages />
        </Suspense>

        <SectionDivider />

        {/* 6. Gifts - "ВМЕСТЕ С ПК ВЫ ПОЛУЧИТЕ" (lazy loaded) */}
        <Suspense fallback={<SectionSkeleton />}>
          <LazyGifts />
        </Suspense>

        <SectionDivider />

        {/* 7. Advantages - "НАШИ ПРЕИМУЩЕСТВА" (lazy loaded) */}
        <Suspense fallback={<SectionSkeleton />}>
          <LazyAdvantages />
        </Suspense>

        <SectionDivider />

        {/* 8. Socials - "НАШИ СОЦИАЛЬНЫЕ СЕТИ" (lazy loaded) */}
        <Suspense fallback={<SectionSkeleton />}>
          <LazySocials />
        </Suspense>

        <SectionDivider />

        {/* 9. Cases - "НАШИ КЕЙСЫ" (lazy loaded) */}
        <Suspense fallback={<CasesSkeleton />}>
          <LazyCases />
        </Suspense>

        <SectionDivider />

        {/* 10. Live - "LIVE ЛЕНТА" (lazy loaded) */}
        <Suspense fallback={<SectionSkeleton />}>
          <LazyLive />
        </Suspense>

        <SectionDivider />

        {/* 11. Form - Contact / CTA Section (lazy loaded) */}
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
