'use client';

/**
 * Hero Section - Refactored for Performance
 *
 * This component has been split into smaller sub-components for:
 * - Better code maintainability
 * - Improved tree-shaking
 * - Easier testing
 * - Reduced re-render scope
 *
 * Original file: 476 lines -> Split into 7 focused components
 */

import { motion, useScroll, useTransform } from 'framer-motion';
import { useRef, memo, Suspense, lazy } from 'react';
import { HeroParticles } from '@/components/ui/ParticleField';

// Import sub-components directly (they're already memoized)
import { AnimatedBadge } from './AnimatedBadge';
import { AnimatedHeadline } from './AnimatedHeadline';
import { SubHeadline } from './SubHeadline';
import { CTAButtons } from './CTAButtons';
import { Stats } from './Stats';
import { HeroPCImage } from './HeroPCImage';
import { ScrollIndicator } from './ScrollIndicator';

/**
 * Main Hero component - orchestrates all sub-components
 */
export const Hero = memo(function Hero() {
  const ref = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ['start start', 'end start'],
  });

  const y = useTransform(scrollYProgress, [0, 1], ['0%', '30%']);
  const opacity = useTransform(scrollYProgress, [0, 0.5], [1, 0]);

  return (
    <section
      ref={ref}
      className="relative min-h-screen flex items-center overflow-hidden pt-20 pb-32"
    >
      {/* Particle field background */}
      <HeroParticles />

      {/* Central glow */}
      <motion.div
        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[1000px] h-[1000px] pointer-events-none will-change-transform"
        style={{
          background: 'radial-gradient(circle, rgba(139,92,246,0.15) 0%, transparent 50%)',
          y,
        }}
      />

      {/* Animated scan lines */}
      <motion.div
        className="absolute inset-0 opacity-[0.02] pointer-events-none"
        style={{
          backgroundImage: 'repeating-linear-gradient(0deg, transparent, transparent 2px, rgba(139,92,246,0.5) 2px, rgba(139,92,246,0.5) 4px)',
          backgroundSize: '100% 4px',
        }}
        animate={{ y: ['0%', '100%'] }}
        transition={{ duration: 15, repeat: Infinity, ease: 'linear' }}
      />

      {/* Main content */}
      <motion.div className="container mx-auto px-4 relative z-10" style={{ opacity }}>
        <div className="flex flex-col lg:flex-row items-center gap-12 lg:gap-16">
          {/* Text content */}
          <div className="flex-1 text-center lg:text-left">
            <AnimatedBadge />
            <AnimatedHeadline />
            <SubHeadline />
            <CTAButtons />
            <Stats />
          </div>

          {/* PC Image */}
          <div className="flex-1 relative">
            <HeroPCImage />
          </div>
        </div>
      </motion.div>

      {/* Scroll indicator */}
      <ScrollIndicator />

      {/* Bottom gradient fade */}
      <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-black to-transparent pointer-events-none z-10" />
    </section>
  );
});

// Re-export sub-components for potential individual use
export { AnimatedBadge } from './AnimatedBadge';
export { AnimatedHeadline } from './AnimatedHeadline';
export { SubHeadline } from './SubHeadline';
export { CTAButtons } from './CTAButtons';
export { Stats } from './Stats';
export { HeroPCImage } from './HeroPCImage';
export { ScrollIndicator } from './ScrollIndicator';
