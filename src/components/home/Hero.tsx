'use client';

import { motion, useScroll, useTransform, useMotionValue, useSpring, useReducedMotion } from 'framer-motion';
import { useRef, useState, memo } from 'react';
import Image from 'next/image';
import { MagneticButton } from '@/components/ui/MagneticButton';
import { AnimatedCounter } from '@/components/ui/TextReveal';
import { HeroParticles } from '@/components/ui/ParticleField';
import { cn } from '@/lib/cn';
import { useAnimationVisibility } from '@/hooks/useAnimationOptimization';

// ============================================
// PERFORMANCE OPTIMIZED HERO SECTION
// ============================================
// Optimizations applied:
// 1. useReducedMotion support throughout
// 2. Intersection Observer for visibility-based animations
// 3. Reduced animation complexity
// 4. Memoized sub-components
// 5. will-change CSS for GPU acceleration
// 6. Conditional rendering of effects
// 7. Simplified floating spec badges (3 -> 2 animations)
// 8. Removed redundant scan lines animation
// ============================================

// Animated badge component - memoized
const AnimatedBadge = memo(function AnimatedBadge() {
  const shouldReduceMotion = useReducedMotion();

  if (shouldReduceMotion) {
    return (
      <div className="inline-flex items-center gap-3 px-5 py-2.5 rounded-full bg-gradient-to-r from-purple-500/10 to-magenta-500/10 border border-purple-500/30 backdrop-blur-md mb-8">
        <span className="relative flex h-3 w-3">
          <span className="relative inline-flex rounded-full h-3 w-3 bg-magenta-400 shadow-[0_0_10px_#22D3EE]" />
        </span>
        <span className="text-sm font-semibold bg-gradient-to-r from-purple-300 to-magenta-300 bg-clip-text text-transparent">
          Premium Gaming PCs
        </span>
        <span className="px-2 py-0.5 rounded-full bg-purple-500/20 text-xs font-bold text-purple-300">
          NEW 2025
        </span>
      </div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20, scale: 0.9 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{ duration: 0.6, delay: 0.2 }}
      className="inline-flex items-center gap-3 px-5 py-2.5 rounded-full bg-gradient-to-r from-purple-500/10 to-magenta-500/10 border border-purple-500/30 backdrop-blur-md mb-8"
    >
      <motion.span className="relative flex h-3 w-3">
        <motion.span
          className="absolute inline-flex h-full w-full rounded-full bg-magenta-400"
          animate={{
            scale: [1, 1.5, 1],
            opacity: [1, 0, 1],
          }}
          transition={{ duration: 2, repeat: Infinity }}
        />
        <span className="relative inline-flex rounded-full h-3 w-3 bg-magenta-400 shadow-[0_0_10px_#22D3EE]" />
      </motion.span>
      <span className="text-sm font-semibold bg-gradient-to-r from-purple-300 to-magenta-300 bg-clip-text text-transparent">
        Premium Gaming PCs
      </span>
      <motion.span
        className="px-2 py-0.5 rounded-full bg-purple-500/20 text-xs font-bold text-purple-300"
        animate={{ scale: [1, 1.05, 1] }}
        transition={{ duration: 2, repeat: Infinity }}
      >
        NEW 2025
      </motion.span>
    </motion.div>
  );
});

// Animated headline with gradient - memoized
const AnimatedHeadline = memo(function AnimatedHeadline() {
  const shouldReduceMotion = useReducedMotion();

  if (shouldReduceMotion) {
    return (
      <div className="mb-8">
        <h1 className="font-display font-black text-5xl sm:text-6xl md:text-7xl lg:text-8xl leading-[0.9] tracking-tight">
          <span className="block text-white mb-2">Собери свой</span>
          <span className="relative block">
            <span className="bg-gradient-to-r from-purple-400 via-magenta-400 to-purple-400 bg-clip-text text-transparent">
              идеальный PC
            </span>
            <div
              className="absolute -bottom-2 left-0 h-1 w-full rounded-full bg-gradient-to-r from-purple-500 via-magenta-500 to-purple-500"
              style={{
                boxShadow: '0 0 20px rgba(139,92,246,0.5), 0 0 40px rgba(6,182,212,0.3)',
              }}
            />
          </span>
        </h1>
      </div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.8, delay: 0.3 }}
      className="mb-8"
    >
      <h1 className="font-display font-black text-5xl sm:text-6xl md:text-7xl lg:text-8xl leading-[0.9] tracking-tight">
        <motion.span
          className="block text-white mb-2"
          initial={{ opacity: 0, x: -30 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6, delay: 0.4 }}
        >
          Собери свой
        </motion.span>
        <motion.span
          className="relative block"
          initial={{ opacity: 0, x: -30 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6, delay: 0.5 }}
        >
          {/* Animated gradient text */}
          <motion.span
            className="bg-gradient-to-r from-purple-400 via-magenta-400 to-purple-400 bg-clip-text text-transparent bg-[length:200%_auto] will-change-auto"
            animate={{
              backgroundPosition: ['0% center', '200% center'],
            }}
            transition={{
              duration: 3,
              repeat: Infinity,
              ease: 'linear',
            }}
          >
            идеальный PC
          </motion.span>

          {/* Underline glow effect */}
          <motion.div
            className="absolute -bottom-2 left-0 h-1 rounded-full bg-gradient-to-r from-purple-500 via-magenta-500 to-purple-500"
            initial={{ width: 0 }}
            animate={{ width: '100%' }}
            transition={{ duration: 1, delay: 1 }}
            style={{
              boxShadow: '0 0 20px rgba(139,92,246,0.5), 0 0 40px rgba(6,182,212,0.3)',
            }}
          />
        </motion.span>
      </h1>
    </motion.div>
  );
});

// Subheadline with highlights - memoized
const SubHeadline = memo(function SubHeadline() {
  const shouldReduceMotion = useReducedMotion();

  if (shouldReduceMotion) {
    return (
      <p className="text-lg md:text-xl lg:text-2xl text-white/60 mb-10 max-w-2xl leading-relaxed">
        Мощные игровые компьютеры с видеокартами{' '}
        <span className="text-transparent bg-clip-text bg-gradient-to-r from-green-400 to-magenta-400 font-bold">
          RTX 4070/4080/4090
        </span>
        .{' '}
        <span className="inline-flex items-center gap-1 text-magenta-400 font-semibold">
          <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
          </svg>
          Гарантия 12+ месяцев
        </span>
        , полная настройка и активация Windows.
      </p>
    );
  }

  return (
    <motion.p
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.7, delay: 0.6 }}
      className="text-lg md:text-xl lg:text-2xl text-white/60 mb-10 max-w-2xl leading-relaxed"
    >
      Мощные игровые компьютеры с видеокартами{' '}
      <span className="text-transparent bg-clip-text bg-gradient-to-r from-green-400 to-magenta-400 font-bold">
        RTX 4070/4080/4090
      </span>
      .{' '}
      <motion.span
        className="inline-flex items-center gap-1 text-magenta-400 font-semibold"
        whileHover={{ scale: 1.05 }}
      >
        <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
          <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
        </svg>
        Гарантия 12+ месяцев
      </motion.span>
      , полная настройка и активация Windows.
    </motion.p>
  );
});

// CTA Buttons - memoized
const CTAButtons = memo(function CTAButtons() {
  const shouldReduceMotion = useReducedMotion();

  const buttons = (
    <>
      <MagneticButton
        href="/catalog"
        variant="primary"
        size="lg"
        magneticStrength={0.4}
      >
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
        </svg>
        Смотреть каталог
      </MagneticButton>

      <MagneticButton
        href="/configurator"
        variant="secondary"
        size="lg"
        magneticStrength={0.3}
      >
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
        </svg>
        Собрать свой PC
      </MagneticButton>
    </>
  );

  if (shouldReduceMotion) {
    return (
      <div className="flex flex-col sm:flex-row gap-4 mb-16">
        {buttons}
      </div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.7, delay: 0.7 }}
      className="flex flex-col sm:flex-row gap-4 mb-16"
    >
      {buttons}
    </motion.div>
  );
});

// Animated stats - memoized
const Stats = memo(function Stats() {
  const shouldReduceMotion = useReducedMotion();
  const stats = [
    { value: 500, suffix: '+', label: 'собранных ПК' },
    { value: 12, suffix: '+', label: 'месяцев гарантии' },
    { value: 24, suffix: '/7', label: 'поддержка' },
  ];

  if (shouldReduceMotion) {
    return (
      <div className="flex flex-wrap gap-10">
        {stats.map((stat, index) => (
          <div key={index} className="relative group">
            <div className="relative">
              <div className="font-display font-black text-4xl md:text-5xl bg-gradient-to-r from-purple-400 to-magenta-400 bg-clip-text text-transparent">
                {stat.value}{stat.suffix}
              </div>
              <div className="text-white/50 text-sm mt-1 font-medium">{stat.label}</div>
            </div>
          </div>
        ))}
      </div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.7, delay: 0.9 }}
      className="flex flex-wrap gap-10"
    >
      {stats.map((stat, index) => (
        <motion.div
          key={index}
          className="relative group"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1 + index * 0.1 }}
        >
          {/* Glow on hover */}
          <motion.div
            className="absolute -inset-4 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity duration-300"
            style={{
              background: 'radial-gradient(circle, rgba(139,92,246,0.2), transparent 70%)',
            }}
          />

          <div className="relative">
            <div className="font-display font-black text-4xl md:text-5xl bg-gradient-to-r from-purple-400 to-magenta-400 bg-clip-text text-transparent">
              <AnimatedCounter value={stat.value} suffix={stat.suffix} duration={2} delay={1 + index * 0.2} />
            </div>
            <div className="text-white/50 text-sm mt-1 font-medium">{stat.label}</div>
          </div>
        </motion.div>
      ))}
    </motion.div>
  );
});

// Hero PC Image with 3D effects - optimized
const HeroPCImage = memo(function HeroPCImage() {
  const ref = useRef<HTMLDivElement>(null);
  const [isHovered, setIsHovered] = useState(false);
  const shouldReduceMotion = useReducedMotion();
  const { ref: visibilityRef, shouldAnimate } = useAnimationVisibility<HTMLDivElement>();

  const x = useMotionValue(0);
  const y = useMotionValue(0);

  const springConfig = { damping: 20, stiffness: 300 };
  const xSpring = useSpring(x, springConfig);
  const ySpring = useSpring(y, springConfig);

  const rotateX = useTransform(ySpring, [-0.5, 0.5], [10, -10]);
  const rotateY = useTransform(xSpring, [-0.5, 0.5], [-10, 10]);

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!ref.current || shouldReduceMotion) return;
    const rect = ref.current.getBoundingClientRect();
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;
    x.set((e.clientX - centerX) / (rect.width / 2) * 0.5);
    y.set((e.clientY - centerY) / (rect.height / 2) * 0.5);
  };

  const handleMouseLeave = () => {
    x.set(0);
    y.set(0);
    setIsHovered(false);
  };

  const shouldAnimateEffects = shouldAnimate && !shouldReduceMotion;

  // Static version for reduced motion
  if (shouldReduceMotion) {
    return (
      <div className="relative w-full max-w-2xl mx-auto">
        <div
          className="absolute inset-0 rounded-full"
          style={{
            background: 'radial-gradient(circle, rgba(139,92,246,0.4) 0%, transparent 60%)',
            filter: 'blur(60px)',
          }}
        />
        <div className="relative z-10">
          <Image
            src="/gaming-pc-hero.png"
            alt="Gaming PC VA-PC with RGB lighting"
            width={600}
            height={700}
            className="relative z-10 drop-shadow-2xl"
            priority
          />
        </div>
      </div>
    );
  }

  return (
    <div ref={visibilityRef}>
      <motion.div
        ref={ref}
        className="relative w-full max-w-2xl mx-auto"
        onMouseMove={handleMouseMove}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={handleMouseLeave}
        style={{ perspective: 1000 }}
        initial={{ opacity: 0, scale: 0.8, y: 50 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        transition={{ duration: 1, delay: 0.5, ease: [0.25, 0.46, 0.45, 0.94] }}
      >
        {/* Multi-layer glow effects - only when visible */}
        {shouldAnimateEffects && (
          <motion.div
            className="absolute inset-0 rounded-full will-change-transform"
            style={{
              background: 'radial-gradient(circle, rgba(139,92,246,0.4) 0%, transparent 60%)',
              filter: 'blur(60px)',
            }}
            animate={{
              scale: [1, 1.1, 1],
              opacity: [0.5, 0.8, 0.5],
            }}
            transition={{ duration: 4, repeat: Infinity }}
          />
        )}

        {/* RGB spinning border - only when visible */}
        {shouldAnimateEffects && (
          <motion.div
            className="absolute inset-0 rounded-3xl will-change-transform"
            style={{
              background: 'conic-gradient(from 0deg, #8B5CF6, #06B6D4, #EC4899, #8B5CF6)',
              filter: 'blur(30px)',
              opacity: 0.3,
            }}
            animate={{ rotate: 360 }}
            transition={{ duration: 10, repeat: Infinity, ease: 'linear' }}
          />
        )}

        {/* Main image with 3D tilt */}
        <motion.div
          className="relative z-10 will-change-transform"
          style={{
            rotateX: shouldAnimateEffects ? rotateX : 0,
            rotateY: shouldAnimateEffects ? rotateY : 0,
            transformStyle: 'preserve-3d',
          }}
          animate={shouldAnimateEffects ? { y: [0, -20, 0] } : undefined}
          transition={shouldAnimateEffects ? { duration: 5, repeat: Infinity, ease: 'easeInOut' } : undefined}
        >
          {/* Image */}
          <Image
            src="/gaming-pc-hero.png"
            alt="Gaming PC VA-PC with RGB lighting"
            width={600}
            height={700}
            className="relative z-10 drop-shadow-2xl"
            priority
          />

          {/* Holographic overlay - only on hover */}
          {isHovered && shouldAnimateEffects && (
            <motion.div
              className="absolute inset-0 z-20 pointer-events-none rounded-3xl overflow-hidden will-change-auto"
              style={{
                background: `linear-gradient(
                  135deg,
                  transparent 0%,
                  rgba(139,92,246,0.1) 25%,
                  transparent 50%,
                  rgba(6,182,212,0.1) 75%,
                  transparent 100%
                )`,
                backgroundSize: '400% 400%',
              }}
              animate={{
                backgroundPosition: ['0% 0%', '100% 100%', '0% 0%'],
              }}
              transition={{ duration: 5, repeat: Infinity }}
            />
          )}

          {/* Shine effect */}
          {shouldAnimateEffects && (
            <motion.div
              className="absolute inset-0 z-30 pointer-events-none"
              style={{
                background: 'linear-gradient(105deg, transparent 40%, rgba(255,255,255,0.2) 50%, transparent 60%)',
              }}
              initial={{ x: '-100%' }}
              animate={isHovered ? { x: '100%' } : { x: '-100%' }}
              transition={{ duration: 0.8, ease: 'easeInOut' }}
            />
          )}
        </motion.div>

        {/* Floating spec badges - reduced from 3 to 2 unique animations */}
        {shouldAnimateEffects && (
          <>
            <motion.div
              className="absolute -top-4 -right-4 z-30"
              animate={{ y: [0, -10, 0] }}
              transition={{ duration: 3, repeat: Infinity }}
            >
              <div className="px-4 py-2 rounded-xl bg-black/80 backdrop-blur-md border border-purple-500/50 shadow-lg shadow-purple-500/20">
                <span className="text-sm font-bold bg-gradient-to-r from-green-400 to-magenta-400 bg-clip-text text-transparent">
                  RTX 4090
                </span>
              </div>
            </motion.div>

            <motion.div
              className="absolute top-1/3 -left-8 z-30"
              animate={{ y: [0, -8, 0] }}
              transition={{ duration: 3.5, repeat: Infinity }}
            >
              <div className="px-4 py-2 rounded-xl bg-black/80 backdrop-blur-md border border-magenta-500/50 shadow-lg shadow-magenta-500/20">
                <span className="text-sm font-bold text-magenta-400">Intel i9-14900K</span>
              </div>
            </motion.div>

            <motion.div
              className="absolute bottom-1/4 -right-4 z-30"
              animate={{ y: [0, -10, 0] }}
              transition={{ duration: 3, repeat: Infinity, delay: 0.5 }}
            >
              <div className="px-4 py-2 rounded-xl bg-black/80 backdrop-blur-md border border-purple-500/50 shadow-lg shadow-purple-500/20">
                <span className="text-sm font-bold text-purple-400">64GB DDR5</span>
              </div>
            </motion.div>
          </>
        )}

        {/* Bottom reflection - only when visible */}
        {shouldAnimateEffects && (
          <motion.div
            className="absolute -bottom-8 left-1/2 -translate-x-1/2 w-3/4 h-16 rounded-full -z-10 will-change-opacity"
            style={{
              background: 'linear-gradient(90deg, rgba(139,92,246,0.5), rgba(6,182,212,0.5))',
              filter: 'blur(30px)',
            }}
            animate={{
              opacity: [0.3, 0.6, 0.3],
              scaleX: [0.8, 1, 0.8],
            }}
            transition={{ duration: 4, repeat: Infinity }}
          />
        )}
      </motion.div>
    </div>
  );
});

// Scroll indicator - memoized
const ScrollIndicator = memo(function ScrollIndicator() {
  const shouldReduceMotion = useReducedMotion();

  if (shouldReduceMotion) {
    return (
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 z-20">
        <div
          className="flex flex-col items-center gap-2 cursor-pointer group"
          onClick={() => window.scrollBy({ top: window.innerHeight, behavior: 'smooth' })}
        >
          <span className="text-xs text-white/40 group-hover:text-white/60 transition-colors">
            Scroll
          </span>
          <div className="w-6 h-10 rounded-full border-2 border-white/20 flex justify-center pt-2 group-hover:border-purple-500/50 transition-colors">
            <div className="w-1.5 h-3 rounded-full bg-gradient-to-b from-purple-400 to-magenta-400" />
          </div>
        </div>
      </div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ delay: 2 }}
      className="absolute bottom-8 left-1/2 -translate-x-1/2 z-20"
    >
      <motion.div
        className="flex flex-col items-center gap-2 cursor-pointer group"
        animate={{ y: [0, 8, 0] }}
        transition={{ duration: 2, repeat: Infinity }}
        onClick={() => window.scrollBy({ top: window.innerHeight, behavior: 'smooth' })}
      >
        <span className="text-xs text-white/40 group-hover:text-white/60 transition-colors">
          Scroll
        </span>
        <div className="w-6 h-10 rounded-full border-2 border-white/20 flex justify-center pt-2 group-hover:border-purple-500/50 transition-colors">
          <motion.div
            className="w-1.5 h-3 rounded-full bg-gradient-to-b from-purple-400 to-magenta-400"
            animate={{ y: [0, 8, 0], opacity: [1, 0.3, 1] }}
            transition={{ duration: 2, repeat: Infinity }}
          />
        </div>
      </motion.div>
    </motion.div>
  );
});

export function Hero() {
  const ref = useRef<HTMLElement>(null);
  const shouldReduceMotion = useReducedMotion();
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
        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[1000px] h-[1000px] pointer-events-none"
        style={{
          background: 'radial-gradient(circle, rgba(139,92,246,0.15) 0%, transparent 50%)',
          y: shouldReduceMotion ? 0 : y,
        }}
      />

      {/* Main content */}
      <motion.div
        className="container mx-auto px-4 relative z-10"
        style={{ opacity: shouldReduceMotion ? 1 : opacity }}
      >
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
}
