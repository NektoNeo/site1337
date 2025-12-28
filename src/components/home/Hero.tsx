'use client';

import { motion, useScroll, useTransform, useReducedMotion } from 'framer-motion';
import { useRef, memo } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { cn } from '@/lib/cn';

// ============================================
// HERO SECTION - GRAYSCALE PRO DESIGN
// ============================================
// Features:
// 1. LCP-optimized hero image
// 2. Trust metrics strip (YouTube, VK, Guarantee)
// 3. Primary CTA: Telegram, Secondary: Catalog
// 4. Minimal animations, respects prefers-reduced-motion
// 5. Clean grayscale aesthetic with subtle ultraviolet accents
// ============================================

// Trust metrics data
const TRUST_METRICS = [
  { 
    value: '250K+', 
    label: 'подписчиков YouTube',
    icon: (
      <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
        <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/>
      </svg>
    ),
    color: 'text-red-500'
  },
  { 
    value: '15K+', 
    label: 'подписчиков VK',
    icon: (
      <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
        <path d="M15.684 0H8.316C1.592 0 0 1.592 0 8.316v7.368C0 22.408 1.592 24 8.316 24h7.368C22.408 24 24 22.408 24 15.684V8.316C24 1.592 22.408 0 15.684 0zm3.692 17.123h-1.744c-.66 0-.862-.523-2.049-1.719-1.033-1.01-1.49-1.135-1.744-1.135-.356 0-.458.102-.458.593v1.575c0 .424-.135.678-1.253.678-1.846 0-3.896-1.118-5.335-3.202C4.624 10.857 4.03 8.57 4.03 8.096c0-.254.102-.491.593-.491h1.744c.44 0 .61.203.78.677.863 2.49 2.303 4.675 2.896 4.675.22 0 .322-.102.322-.66V9.721c-.068-1.186-.695-1.287-.695-1.71 0-.203.17-.407.44-.407h2.744c.373 0 .508.203.508.643v3.473c0 .372.17.508.271.508.22 0 .407-.136.813-.542 1.254-1.406 2.15-3.574 2.15-3.574.119-.254.322-.491.763-.491h1.744c.525 0 .644.27.525.643-.22 1.017-2.354 4.031-2.354 4.031-.186.305-.254.44 0 .78.186.254.796.779 1.203 1.253.745.847 1.32 1.558 1.473 2.049.17.49-.085.744-.576.744z"/>
      </svg>
    ),
    color: 'text-blue-500'
  },
  { 
    value: '12+', 
    label: 'месяцев гарантии',
    icon: (
      <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
      </svg>
    ),
    color: 'text-emerald-500'
  },
  { 
    value: '2000+', 
    label: 'собранных ПК',
    icon: (
      <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <path strokeLinecap="round" strokeLinejoin="round" d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
      </svg>
    ),
    color: 'text-white'
  },
];

// Trust metric badge component - memoized
const TrustMetric = memo(function TrustMetric({ 
  metric, 
  index 
}: { 
  metric: typeof TRUST_METRICS[0]; 
  index: number; 
}) {
  const shouldReduceMotion = useReducedMotion();

  const content = (
    <div className="flex items-center gap-3 px-4 py-2 rounded-lg bg-bg-elevated/50 border border-va-border backdrop-blur-sm">
      <span className={cn('opacity-80', metric.color)}>
        {metric.icon}
      </span>
      <div className="text-left">
        <div className="text-lg font-bold text-white">{metric.value}</div>
        <div className="text-xs text-text-secondary">{metric.label}</div>
      </div>
    </div>
  );

  if (shouldReduceMotion) {
    return content;
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.8 + index * 0.1 }}
    >
      {content}
    </motion.div>
  );
});

// CTA Buttons - Primary: Telegram, Secondary: Catalog
const CTAButtons = memo(function CTAButtons() {
  const shouldReduceMotion = useReducedMotion();

  const buttons = (
    <div className="flex flex-col sm:flex-row gap-4">
      {/* Primary CTA - Telegram */}
      <Link
        href="https://t.me/vapc_manager"
        target="_blank"
        rel="noopener noreferrer"
        className={cn(
          'group relative inline-flex items-center justify-center gap-3',
          'px-8 py-4 rounded-xl font-semibold text-lg',
          'bg-[#2AABEE] hover:bg-[#229ED9] text-white',
          'transition-all duration-300',
          'shadow-lg shadow-[#2AABEE]/25 hover:shadow-xl hover:shadow-[#2AABEE]/30',
          'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#2AABEE] focus-visible:ring-offset-2 focus-visible:ring-offset-black'
        )}
        aria-label="Написать в Telegram"
      >
        <svg className="w-6 h-6" viewBox="0 0 24 24" fill="currentColor">
          <path d="M11.944 0A12 12 0 0 0 0 12a12 12 0 0 0 12 12 12 12 0 0 0 12-12A12 12 0 0 0 12 0a12 12 0 0 0-.056 0zm4.962 7.224c.1-.002.321.023.465.14a.506.506 0 0 1 .171.325c.016.093.036.306.02.472-.18 1.898-.962 6.502-1.36 8.627-.168.9-.499 1.201-.82 1.23-.696.065-1.225-.46-1.9-.902-1.056-.693-1.653-1.124-2.678-1.8-1.185-.78-.417-1.21.258-1.91.177-.184 3.247-2.977 3.307-3.23.007-.032.014-.15-.056-.212s-.174-.041-.249-.024c-.106.024-1.793 1.14-5.061 3.345-.48.33-.913.49-1.302.48-.428-.008-1.252-.241-1.865-.44-.752-.245-1.349-.374-1.297-.789.027-.216.325-.437.893-.663 3.498-1.524 5.83-2.529 6.998-3.014 3.332-1.386 4.025-1.627 4.476-1.635z"/>
        </svg>
        <span>Написать менеджеру</span>
        <span className="absolute -top-2 -right-2 px-2 py-0.5 text-xs font-bold bg-emerald-500 text-white rounded-full">
          Онлайн
        </span>
      </Link>

      {/* Secondary CTA - Catalog */}
      <Link
        href="/catalog"
        className={cn(
          'group inline-flex items-center justify-center gap-3',
          'px-8 py-4 rounded-xl font-semibold text-lg',
          'bg-bg-elevated border border-va-border',
          'text-white hover:text-white',
          'hover:border-purple-500/50 hover:bg-bg-elevated/80',
          'transition-all duration-300',
          'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-purple-500 focus-visible:ring-offset-2 focus-visible:ring-offset-black'
        )}
        aria-label="Открыть каталог"
      >
        <svg className="w-5 h-5 opacity-70 group-hover:opacity-100 transition-opacity" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" />
        </svg>
        <span>Смотреть каталог</span>
        <svg className="w-4 h-4 opacity-50 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
        </svg>
      </Link>
    </div>
  );

  if (shouldReduceMotion) {
    return <div className="mb-12">{buttons}</div>;
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, delay: 0.6 }}
      className="mb-12"
    >
      {buttons}
    </motion.div>
  );
});

// Headline component
const Headline = memo(function Headline() {
  const shouldReduceMotion = useReducedMotion();

  const content = (
    <div className="mb-6">
      <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold tracking-tight">
        <span className="block text-white">Игровые компьютеры</span>
        <span className="block mt-2 text-transparent bg-clip-text bg-gradient-to-r from-white via-text-secondary to-white">
          от профессионалов
        </span>
      </h1>
    </div>
  );

  if (shouldReduceMotion) {
    return content;
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.7, delay: 0.2 }}
    >
      {content}
    </motion.div>
  );
});

// Subheadline component
const SubHeadline = memo(function SubHeadline() {
  const shouldReduceMotion = useReducedMotion();

  const content = (
    <p className="text-lg md:text-xl text-text-secondary mb-10 max-w-xl leading-relaxed">
      Собираем мощные игровые ПК с видеокартами{' '}
      <span className="text-white font-medium">RTX 4070 / 4080 / 4090</span>.
      {' '}Полная настройка, гарантия и поддержка 24/7.
    </p>
  );

  if (shouldReduceMotion) {
    return content;
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, delay: 0.4 }}
    >
      {content}
    </motion.div>
  );
});

// Hero PC Image - LCP optimized
const HeroPCImage = memo(function HeroPCImage() {
  const shouldReduceMotion = useReducedMotion();

  const imageContent = (
    <div className="relative">
      {/* Subtle glow behind image */}
      <div
        className="absolute inset-0 -z-10 blur-3xl opacity-30"
        style={{
          background: 'radial-gradient(circle at center, rgba(168, 85, 247, 0.3), transparent 70%)',
        }}
      />
      
      {/* Main image - LCP optimized */}
      <Image
        src="/IMG_7794.JPG"
        alt="Премиальный игровой компьютер VA-PC с RGB подсветкой"
        width={700}
        height={800}
        className="relative z-10 drop-shadow-2xl object-cover rounded-2xl"
        priority
        fetchPriority="high"
        sizes="(max-width: 768px) 100vw, 50vw"
        unoptimized
      />
      
      {/* Subtle spec badges */}
      <div className="absolute top-8 right-0 z-20">
        <div className="px-3 py-1.5 rounded-lg bg-black/60 backdrop-blur-sm border border-va-border">
          <span className="text-sm font-semibold text-emerald-400">RTX 4090</span>
        </div>
      </div>

      <div className="absolute top-1/3 left-0 z-20">
        <div className="px-3 py-1.5 rounded-lg bg-black/60 backdrop-blur-sm border border-va-border">
          <span className="text-sm font-semibold text-text-primary">i9-14900K</span>
        </div>
      </div>

      <div className="absolute bottom-1/4 right-0 z-20">
        <div className="px-3 py-1.5 rounded-lg bg-black/60 backdrop-blur-sm border border-va-border">
          <span className="text-sm font-semibold text-text-primary">64GB DDR5</span>
        </div>
      </div>
    </div>
  );

  if (shouldReduceMotion) {
    return (
      <div className="relative w-full max-w-xl mx-auto lg:max-w-none">
        {imageContent}
      </div>
    );
  }

  return (
    <motion.div
      className="relative w-full max-w-xl mx-auto lg:max-w-none"
      initial={{ opacity: 0, scale: 0.95, y: 30 }}
      animate={{ opacity: 1, scale: 1, y: 0 }}
      transition={{ duration: 0.8, delay: 0.3, ease: [0.25, 0.46, 0.45, 0.94] }}
    >
      {imageContent}
    </motion.div>
  );
});

// Main Hero component
export function Hero() {
  const ref = useRef<HTMLElement>(null);
  const shouldReduceMotion = useReducedMotion();
  
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ['start start', 'end start'],
  });

  const opacity = useTransform(scrollYProgress, [0, 0.5], [1, 0]);

  return (
    <section
      ref={ref}
      className="relative min-h-screen flex items-center overflow-hidden pt-20 pb-16"
      aria-label="Главный баннер"
    >
      {/* Subtle background gradient */}
      <div
        className="absolute inset-0 -z-10"
        style={{
          background: 'radial-gradient(ellipse at 30% 20%, rgba(168, 85, 247, 0.08) 0%, transparent 50%), radial-gradient(ellipse at 70% 80%, rgba(217, 70, 239, 0.05) 0%, transparent 50%)',
        }}
      />

      {/* Main content */}
      <motion.div
        className="container mx-auto px-4 relative z-10"
        style={{ opacity: shouldReduceMotion ? 1 : opacity }}
      >
        <div className="flex flex-col lg:flex-row items-center gap-8 lg:gap-12">
          {/* Text content */}
          <div className="flex-1 text-center lg:text-left">
            <Headline />
            <SubHeadline />
            <CTAButtons />
            
            {/* Trust metrics strip */}
            <div className="flex flex-wrap justify-center lg:justify-start gap-3">
              {TRUST_METRICS.map((metric, index) => (
                <TrustMetric key={index} metric={metric} index={index} />
              ))}
            </div>
          </div>

          {/* PC Image */}
          <div className="flex-1 relative">
            <HeroPCImage />
          </div>
        </div>
      </motion.div>

      {/* Bottom gradient fade */}
      <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-black to-transparent pointer-events-none z-10" />
    </section>
  );
}
