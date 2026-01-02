'use client';

import { motion, useScroll, useTransform, useReducedMotion, AnimatePresence } from 'framer-motion';
import { useRef, memo, useEffect, useState, useCallback } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { cn } from '@/lib/cn';

// ============================================
// HERO SECTION - COSMIC POWER-ON EFFECT
// ============================================
// Features:
// 1. PC "boots up" from darkness with epic glow
// 2. Cyan/purple lighting effects
// 3. Electric arcs during power-on
// 4. Content reveals after PC lights up
// ============================================

// CTA Buttons - Primary: Telegram, Secondary: Catalog
const CTAButtons = memo(function CTAButtons({ visible }: { visible: boolean }) {
  const shouldReduceMotion = useReducedMotion();

  const buttons = (
    <div className="flex flex-wrap gap-4">
      <Link
        href="https://t.me/vapc_manager"
        target="_blank"
        rel="noopener noreferrer"
        className={cn(
          'group relative inline-flex items-center justify-center gap-3 overflow-hidden',
          'px-8 py-4 rounded-xl font-semibold text-lg',
          'bg-gradient-to-r from-cyan-500 to-purple-600 text-white',
          'transition-all duration-300',
          'shadow-lg shadow-cyan-600/20 hover:shadow-xl hover:shadow-purple-600/30',
          'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cyan-500 focus-visible:ring-offset-2 focus-visible:ring-offset-black'
        )}
        aria-label="Написать в Telegram"
      >
        <svg className="w-6 h-6 relative z-10" viewBox="0 0 24 24" fill="currentColor">
          <path d="M11.944 0A12 12 0 0 0 0 12a12 12 0 0 0 12 12 12 12 0 0 0 12-12A12 12 0 0 0 12 0a12 12 0 0 0-.056 0zm4.962 7.224c.1-.002.321.023.465.14a.506.506 0 0 1 .171.325c.016.093.036.306.02.472-.18 1.898-.962 6.502-1.36 8.627-.168.9-.499 1.201-.82 1.23-.696.065-1.225-.46-1.9-.902-1.056-.693-1.653-1.124-2.678-1.8-1.185-.78-.417-1.21.258-1.91.177-.184 3.247-2.977 3.307-3.23.007-.032.014-.15-.056-.212s-.174-.041-.249-.024c-.106.024-1.793 1.14-5.061 3.345-.48.33-.913.49-1.302.48-.428-.008-1.252-.241-1.865-.44-.752-.245-1.349-.374-1.297-.789.027-.216.325-.437.893-.663 3.498-1.524 5.83-2.529 6.998-3.014 3.332-1.386 4.025-1.627 4.476-1.635z"/>
        </svg>
        <span className="relative z-10">Связаться</span>
      </Link>

      <Link
        href="/catalog"
        className={cn(
          'group relative inline-flex items-center justify-center gap-2 overflow-hidden',
          'px-6 py-4 rounded-xl font-semibold text-lg',
          'bg-white/5 border border-white/10 text-white',
          'transition-all duration-300',
          'hover:bg-white/10 hover:border-white/20',
          'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/50'
        )}
      >
        <span>Каталог</span>
        <svg className="w-5 h-5 group-hover:translate-x-1 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
        </svg>
      </Link>
    </div>
  );

  if (!visible) return null;

  if (shouldReduceMotion) {
    return <div className="mb-8">{buttons}</div>;
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, delay: 0.3 }}
      className="mb-8"
    >
      {buttons}
    </motion.div>
  );
});

// Trust metrics data
const TRUST_METRICS = [
  { value: '250K+', label: 'YouTube', color: 'text-red-400' },
  { value: '15K+', label: 'VK', color: 'text-blue-400' },
  { value: '2000+', label: 'ПК собрано', color: 'text-cyan-400' },
];

// Energy Ring Component - Rotating energy effect behind PC
const EnergyRing = memo(function EnergyRing({ reducedMotion }: { reducedMotion: boolean }) {
  return (
    <motion.div
      className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] rounded-full pointer-events-none -z-10"
      style={{
        background: 'conic-gradient(from 0deg, rgba(0,200,255,0.15), rgba(124,58,237,0.12), rgba(217,70,239,0.10), rgba(0,200,255,0.15))',
        filter: 'blur(60px)',
      }}
      initial={{ opacity: 0, rotate: 0, scale: 0.9 }}
      animate={
        reducedMotion
          ? { opacity: 0.4, rotate: 0, scale: 1 }
          : {
              opacity: 0.5,
              rotate: 360,
              scale: [0.9, 1.05, 0.9],
            }
      }
      transition={
        reducedMotion
          ? { duration: 0.8 }
          : {
              rotate: { duration: 50, repeat: Infinity, ease: 'linear' },
              scale: { duration: 5, repeat: Infinity, ease: 'easeInOut' },
              opacity: { duration: 1.2 },
            }
      }
    />
  );
});

// Spec Badge Component - Floating badges around PC
const SpecBadge = memo(function SpecBadge({ 
  text, 
  position, 
  color,
  delay,
  reducedMotion,
}: { 
  text: string; 
  position: string; 
  color: string;
  delay: number;
  reducedMotion: boolean;
}) {
  // Determine border color based on text color
  const getBorderColor = () => {
    if (color.includes('emerald')) return 'border-emerald-400/30';
    if (color.includes('cyan')) return 'border-cyan-400/30';
    if (color.includes('purple')) return 'border-purple-400/30';
    return 'border-white/20';
  };

  return (
    <motion.div 
      initial={{ opacity: 0, y: 8, scale: 0.95 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{ delay, duration: reducedMotion ? 0 : 0.4 }}
      className={cn('absolute z-20', position)}
    >
      <div className={cn('px-3 py-1.5 rounded-lg bg-black/60 border backdrop-blur-sm', getBorderColor())}>
        <span className={cn('text-sm font-semibold', color)}>{text}</span>
      </div>
    </motion.div>
  );
});

// Trust Metric Component
const TrustMetric = memo(function TrustMetric({
  metric,
  index,
}: {
  metric: { value: string; label: string; color: string };
  index: number;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.6 + index * 0.1 }}
      className="flex items-center gap-2 text-white/40"
    >
      <span className={cn('font-bold', metric.color)}>{metric.value}</span>
      <span className="text-sm">{metric.label}</span>
    </motion.div>
  );
});

// Main Hero component with cosmic power-on effect
export function Hero() {
  const ref = useRef<HTMLElement>(null);
  const shouldReduceMotion = useReducedMotion();
  
  // Animation stages:
  // 0 - Total darkness
  // 1 - PC starting to glow (power on sequence) 
  // 2 - PC fully lit, content reveals
  const [stage, setStage] = useState(0);
  
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ['start start', 'end start'],
  });

  const opacity = useTransform(scrollYProgress, [0, 0.5], [1, 0]);
  
  // Start animation sequence on mount
  useEffect(() => {
    if (shouldReduceMotion) {
      setStage(2);
      return;
    }
    
    // Stage 1: PC starts glowing
    const t1 = setTimeout(() => setStage(1), 400);
    // Stage 2: Full reveal
    const t2 = setTimeout(() => setStage(2), 2000);
    
    return () => {
      clearTimeout(t1);
      clearTimeout(t2);
    };
  }, [shouldReduceMotion]);

  return (
    <section
      ref={ref}
      className="relative min-h-screen flex items-center overflow-hidden"
      aria-label="Главный баннер"
    >
      {/* DARKNESS OVERLAY - fades out as PC lights up */}
      <motion.div
        className="absolute inset-0 z-40 bg-black pointer-events-none"
        initial={{ opacity: 1 }}
        animate={{ opacity: stage === 0 ? 1 : 0 }}
        transition={{ duration: 1.2, ease: 'easeOut' }}
      />
      
      {/* Background - Deep space black */}
      <div className="absolute inset-0 bg-[#030308]" />
      
      {/* Subtle noise texture */}
      <div 
        className="absolute inset-0 opacity-[0.02]"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E")`,
        }}
      />
      
      {/* CYAN/BLUE GLOW from PC - the main light source */}
      <motion.div
        className="absolute right-[10%] top-1/2 -translate-y-1/2 w-[1000px] h-[1000px] pointer-events-none"
        style={{
          background: `
            radial-gradient(ellipse at center, 
              rgba(0, 200, 255, 0.5) 0%, 
              rgba(0, 150, 255, 0.3) 20%, 
              rgba(100, 0, 255, 0.15) 40%, 
              transparent 70%
            )
          `,
          filter: 'blur(80px)',
        }}
        initial={{ opacity: 0, scale: 0.3 }}
        animate={{ 
          opacity: stage >= 1 ? [0, 0.2, 0.6, 0.4] : 0,
          scale: stage >= 1 ? [0.3, 0.6, 1.2, 1] : 0.3,
        }}
        transition={{ 
          duration: 1.5, 
          ease: 'easeOut',
          times: [0, 0.3, 0.7, 1]
        }}
      />
      
      {/* Secondary purple glow - left side */}
      <motion.div
        className="absolute left-[20%] top-[30%] w-[500px] h-[500px] pointer-events-none"
        style={{
          background: 'radial-gradient(circle, rgba(139, 92, 246, 0.3) 0%, transparent 60%)',
          filter: 'blur(100px)',
        }}
        initial={{ opacity: 0 }}
        animate={{ opacity: stage >= 1 ? 0.4 : 0 }}
        transition={{ duration: 1.5, delay: 0.3 }}
      />
      
      {/* Electric arcs during power-on */}
      <AnimatePresence>
        {stage === 1 && (
          <>
            {[...Array(4)].map((_, i) => (
              <motion.div
                key={`arc-${i}`}
                className="absolute right-[25%] top-1/2 pointer-events-none"
                initial={{ opacity: 0, scale: 0 }}
                animate={{ 
                  opacity: [0, 1, 0],
                  scale: [0.5, 1.5, 0.5],
                }}
                exit={{ opacity: 0 }}
                transition={{ 
                  duration: 0.25,
                  delay: 0.2 + i * 0.15,
                  ease: 'easeOut'
                }}
              >
                <div 
                  className="w-32 h-1 rounded-full"
                  style={{
                    background: 'linear-gradient(90deg, transparent, cyan, white, cyan, transparent)',
                    boxShadow: '0 0 20px cyan, 0 0 40px cyan',
                    transform: `rotate(${i * 90}deg)`,
                  }}
                />
              </motion.div>
            ))}
          </>
        )}
      </AnimatePresence>
      
      {/* Floor reflection glow */}
      <motion.div
        className="absolute bottom-0 left-0 right-0 h-[35%] pointer-events-none"
        style={{
          background: `
            linear-gradient(to top, 
              rgba(0, 200, 255, 0.1) 0%, 
              rgba(0, 150, 255, 0.03) 30%, 
              transparent 100%
            )
          `,
        }}
        initial={{ opacity: 0 }}
        animate={{ opacity: stage >= 1 ? 1 : 0 }}
        transition={{ duration: 1.5, delay: 0.3 }}
      />

      {/* Main content */}
      <motion.div
        className="container mx-auto px-4 relative z-10"
        style={{ opacity: shouldReduceMotion ? 1 : opacity }}
      >
        <div className="grid lg:grid-cols-2 gap-8 lg:gap-16 items-center min-h-screen py-24">
          
          {/* LEFT: Text content */}
          <div className="text-center lg:text-left order-2 lg:order-1 relative z-20">
            
            {/* Content appears after PC lights */}
            <AnimatePresence>
              {stage >= 2 && (
                <motion.div
                  initial={{ opacity: 0, y: 30, filter: 'blur(8px)' }}
                  animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
                  transition={{ duration: 0.8, ease: 'easeOut' }}
                >
                  {/* Badge */}
          <motion.div 
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: 0.2, duration: 0.5 }}
                    className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-cyan-500/10 border border-cyan-500/20 mb-6 backdrop-blur-sm"
                  >
                    <motion.span 
                      className="w-2 h-2 rounded-full bg-green-400"
                      animate={{ 
                        opacity: [1, 0.4, 1],
                        scale: [1, 1.2, 1]
                      }}
                      transition={{ duration: 1.5, repeat: Infinity }}
                    />
                    <span className="text-sm font-medium text-cyan-300">Мастерская открыта</span>
                  </motion.div>
                  
                  {/* Main headline */}
                  <h1 
                    className="font-inter font-black text-4xl md:text-5xl lg:text-6xl xl:text-7xl mb-6 leading-[1.1]"
                    style={{
                      background: 'linear-gradient(135deg, #00d4ff 0%, #7c3aed 50%, #c026d3 100%)',
                      WebkitBackgroundClip: 'text',
                      WebkitTextFillColor: 'transparent',
                      backgroundClip: 'text',
                    }}
                  >
                    СБОРКА КОМПЬЮТЕРОВ ЛЮБОГО УРОВНЯ
                  </h1>
                  
                  {/* Description */}
                  <motion.p 
                    className="text-lg md:text-xl text-white/50 mb-8 max-w-lg mx-auto lg:mx-0 leading-relaxed"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.3 }}
                  >
                    Собираем мощные игровые ПК с видеокартами{' '}
                    <span className="text-cyan-400 font-medium">RTX 4070 / 4080 / 4090</span>.
                    {' '}Полная настройка, гарантия и поддержка 24/7.
                  </motion.p>
                  
                  {/* CTA Buttons */}
                  <CTAButtons visible={stage >= 2} />
            
            {/* Trust metrics strip */}
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.5 }}
                    className="flex flex-wrap justify-center lg:justify-start gap-3"
                  >
              {TRUST_METRICS.map((metric, index) => (
                      <TrustMetric key={metric.label} metric={metric} index={index} />
              ))}
                  </motion.div>
                </motion.div>
              )}
            </AnimatePresence>
            </div>

          {/* RIGHT: PC Image with cosmic power-on effect */}
          <div className="relative flex justify-center lg:justify-end order-1 lg:order-2">
            
            {/* Energy ring effect */}
            {stage >= 1 && <EnergyRing reducedMotion={shouldReduceMotion ?? false} />}
            
            {/* Animated energy blob - pulsating energy core */}
            {stage >= 1 && (
              <>
                {/* Outer energy waves */}
                <motion.div
                  className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] rounded-full pointer-events-none"
                  style={{
                    background: 'radial-gradient(circle, rgba(0, 200, 255, 0.2) 0%, rgba(124, 58, 237, 0.15) 30%, transparent 60%)',
                    filter: 'blur(60px)',
                  }}
                  animate={
                    shouldReduceMotion
                      ? { opacity: 0.3, scale: 1 }
                      : {
                          opacity: [0.2, 0.4, 0.2],
                          scale: [1, 1.2, 1],
                        }
                  }
                  transition={{
                    duration: 3,
                    repeat: Infinity,
                    ease: 'easeInOut',
                  }}
                />
                
                {/* Middle energy layer */}
                <motion.div
                  className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] rounded-full pointer-events-none"
                  style={{
                    background: 'radial-gradient(circle, rgba(217, 70, 239, 0.25) 0%, rgba(0, 200, 255, 0.2) 40%, transparent 70%)',
                    filter: 'blur(50px)',
                  }}
                  animate={
                    shouldReduceMotion
                      ? { opacity: 0.35, scale: 1 }
                      : {
                          opacity: [0.25, 0.5, 0.25],
                          scale: [0.9, 1.1, 0.9],
                        }
                  }
                  transition={{
                    duration: 2.5,
                    repeat: Infinity,
                    ease: 'easeInOut',
                    delay: 0.3,
                  }}
                />
                
                {/* Inner core energy blob */}
                <motion.div
                  className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-[400px] h-[400px] rounded-full pointer-events-none"
                  style={{
                    background: 'radial-gradient(circle, rgba(0, 200, 255, 0.5) 0%, rgba(124, 58, 237, 0.3) 50%, transparent 80%)',
                    filter: 'blur(40px)',
                  }}
                  animate={
                    shouldReduceMotion
                      ? { opacity: 0.4, scale: 1 }
                      : {
                          opacity: [0.3, 0.7, 0.3],
                          scale: [0.95, 1.15, 0.95],
                        }
                  }
                  transition={{
                    duration: 2,
                    repeat: Infinity,
                    ease: 'easeInOut',
                    delay: 0.6,
                  }}
                />
              </>
            )}
            
            {/* Glowing ring behind PC */}
            <motion.div
              className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] rounded-full pointer-events-none"
              style={{
                border: '2px solid transparent',
                background: `
                  linear-gradient(#030308, #030308) padding-box,
                  linear-gradient(135deg, cyan, #6366f1, #8b5cf6, cyan) border-box
                `,
                boxShadow: stage >= 1 
                  ? '0 0 60px rgba(0, 200, 255, 0.3), 0 0 120px rgba(100, 100, 255, 0.2), inset 0 0 60px rgba(0, 200, 255, 0.1)'
                  : 'none',
              }}
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ 
                opacity: stage >= 1 ? [0, 0.4, 0.8] : 0,
                scale: stage >= 1 ? [0.8, 1.05, 1] : 0.8,
                rotate: stage >= 1 ? [0, 3, 0] : 0,
              }}
              transition={{ duration: 1.5, ease: 'easeOut' }}
            />
            
            {/* Pulsing core glow */}
            <motion.div
              className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-[350px] h-[350px] rounded-full pointer-events-none"
              style={{
                background: 'radial-gradient(circle, rgba(0, 200, 255, 0.4) 0%, transparent 70%)',
                filter: 'blur(40px)',
              }}
              animate={stage >= 1 ? {
                scale: [1, 1.15, 1],
                opacity: [0.4, 0.7, 0.4],
              } : {}}
              transition={{ 
                duration: 2.5, 
                repeat: Infinity, 
                ease: 'easeInOut' 
              }}
            />
            
            {/* THE PC - HERO IMAGE */}
            <motion.div
              className="relative z-10"
              initial={{ 
                filter: 'brightness(0) saturate(0)', 
                scale: 0.9,
                y: 20
              }}
              animate={{ 
                filter: stage >= 1 
                  ? 'brightness(1) saturate(1.2)' 
                  : 'brightness(0) saturate(0)',
                scale: stage >= 1 ? 1 : 0.9,
                y: stage >= 1 ? 0 : 20,
              }}
              transition={{ 
                duration: 1.5, 
                ease: [0.4, 0, 0.2, 1] 
              }}
            >
              <Image
                src="/Hero.png"
                alt="Премиальный игровой компьютер VA-PC с RGB подсветкой"
                width={600}
                height={700}
                className="object-contain"
                style={{
                  filter: stage >= 1 
                    ? 'drop-shadow(0 0 40px rgba(0, 200, 255, 0.6)) drop-shadow(0 0 80px rgba(100, 100, 255, 0.4)) drop-shadow(0 20px 40px rgba(0, 0, 0, 0.8))'
                    : 'drop-shadow(0 20px 40px rgba(0, 0, 0, 0.8))',
                  transition: 'filter 1.5s ease-out',
                }}
                priority
                fetchPriority="high"
                sizes="(max-width: 768px) 100vw, 50vw"
                unoptimized
              />
              
              {/* Scan line effect during boot */}
              <AnimatePresence>
                {stage === 1 && (
          <motion.div 
                    className="absolute inset-0 pointer-events-none overflow-hidden"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                  >
                    <motion.div
                      className="absolute left-0 right-0 h-[3px]"
                      style={{
                        background: 'linear-gradient(90deg, transparent, cyan, white, cyan, transparent)',
                        boxShadow: '0 0 20px cyan, 0 0 40px rgba(0, 200, 255, 0.5)',
                      }}
                      initial={{ top: '-5%' }}
                      animate={{ top: '105%' }}
                      transition={{ 
                        duration: 1.2, 
                        ease: 'linear',
                      }}
                    />
                  </motion.div>
                )}
              </AnimatePresence>
          </motion.div>
            
            {/* Floating spec badges */}
            {stage >= 2 && (
              <>
                <SpecBadge 
                  text="RTX 4090" 
                  position="top-8 right-0" 
                  color="text-emerald-400"
                  delay={0}
                  reducedMotion={shouldReduceMotion ?? false}
                />
                <SpecBadge 
                  text="i9-14900K" 
                  position="top-1/3 left-0" 
                  color="text-white/80"
                  delay={0.1}
                  reducedMotion={shouldReduceMotion ?? false}
                />
                <SpecBadge 
                  text="64GB DDR5" 
                  position="bottom-1/4 right-0" 
                  color="text-purple-300"
                  delay={0.2}
                  reducedMotion={shouldReduceMotion ?? false}
                />
              </>
            )}

            {/* Floor reflection of PC */}
            <motion.div
              className="absolute bottom-0 left-1/2 -translate-x-1/2 w-[70%] h-8 pointer-events-none"
              style={{
                background: 'radial-gradient(ellipse at center, rgba(0, 200, 255, 0.4) 0%, transparent 70%)',
                filter: 'blur(15px)',
              }}
              initial={{ opacity: 0, scaleX: 0.5 }}
              animate={{ 
                opacity: stage >= 1 ? 1 : 0,
                scaleX: stage >= 1 ? 1 : 0.5
              }}
              transition={{ duration: 1.2, delay: 0.3 }}
            />
            
            {/* Floating particles after PC lights up */}
            {stage >= 2 && (
              <div className="absolute inset-0 pointer-events-none overflow-visible">
                {[...Array(12)].map((_, i) => (
                  <motion.div
                    key={i}
                    className="absolute rounded-full"
                    style={{
                      width: 2 + Math.random() * 3,
                      height: 2 + Math.random() * 3,
                      background: i % 3 === 0 ? 'cyan' : i % 3 === 1 ? '#8b5cf6' : 'white',
                      left: `${15 + Math.random() * 70}%`,
                      bottom: '25%',
                      boxShadow: `0 0 ${4 + Math.random() * 6}px currentColor`,
                    }}
                    animate={{
                      y: [0, -250 - Math.random() * 150],
                      x: [0, (Math.random() - 0.5) * 80],
                      opacity: [0, 1, 0],
                      scale: [0, 1, 0.3],
                    }}
                    transition={{
                      duration: 3.5 + Math.random() * 2,
                      repeat: Infinity,
                      delay: Math.random() * 3,
                      ease: 'easeOut',
                    }}
                  />
                ))}
              </div>
            )}
          </div>
        </div>
      </motion.div>

      {/* Bottom gradient fade */}
      <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-[#0a0a0f] to-transparent pointer-events-none z-20" />
    </section>
  );
}
