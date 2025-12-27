'use client';

import { motion, useScroll, useTransform } from 'framer-motion';
import { useRef } from 'react';
import Link from 'next/link';

// Glowing CTA Button with RGB effects
function GlowingButton({ 
  children, 
  href, 
  variant = 'primary' 
}: { 
  children: React.ReactNode; 
  href: string;
  variant?: 'primary' | 'secondary';
}) {
  const isPrimary = variant === 'primary';
  
  return (
    <Link href={href}>
      <motion.span
        className={`
          relative inline-flex items-center justify-center gap-2
          px-8 py-4 rounded-xl font-display font-bold tracking-wide
          transition-all duration-300 cursor-pointer overflow-hidden
          ${isPrimary 
            ? 'bg-gradient-to-r from-purple-600 to-purple-500 text-white shadow-[0_0_30px_rgba(139,92,246,0.5)]' 
            : 'bg-transparent border-2 border-purple-500/50 text-purple-400'
          }
        `}
        whileHover={{ 
          scale: 1.05,
          boxShadow: isPrimary 
            ? '0 0 50px rgba(139,92,246,0.7), 0 0 100px rgba(6,182,212,0.3)' 
            : '0 0 30px rgba(139,92,246,0.4)'
        }}
        whileTap={{ scale: 0.98 }}
      >
        {/* Animated shimmer */}
        {isPrimary && (
          <motion.span
            className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent"
            initial={{ x: '-100%' }}
            animate={{ x: '100%' }}
            transition={{ duration: 2, repeat: Infinity, repeatDelay: 3 }}
          />
        )}
        <span className="relative z-10">{children}</span>
      </motion.span>
    </Link>
  );
}

// Animated PC Case Visualization
function PCVisualization() {
  return (
    <motion.div
      className="relative w-full max-w-lg mx-auto aspect-square"
      initial={{ opacity: 0, scale: 0.8, rotateY: -20 }}
      animate={{ opacity: 1, scale: 1, rotateY: 0 }}
      transition={{ duration: 1, delay: 0.4, ease: [0.25, 0.46, 0.45, 0.94] }}
    >
      {/* Multi-layer glow effect */}
      <div className="absolute inset-0 rounded-full bg-purple-600/20 blur-3xl animate-pulse" />
      <motion.div 
        className="absolute inset-10 rounded-full blur-2xl"
        style={{
          background: 'linear-gradient(135deg, rgba(139, 92, 246, 0.4), rgba(6, 182, 212, 0.3))',
        }}
        animate={{
          scale: [1, 1.1, 1],
          opacity: [0.5, 0.8, 0.5],
        }}
        transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut' }}
      />
      
      {/* PC Case */}
      <motion.div
        className="relative z-10 w-full h-full flex items-center justify-center"
        animate={{ y: [0, -15, 0] }}
        transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut' }}
      >
        <div className="relative">
          {/* Main case shape */}
          <div className="w-64 h-80 md:w-72 md:h-96 bg-gradient-to-br from-gray-800 to-gray-900 rounded-2xl border border-gray-700/50 shadow-2xl relative overflow-hidden">
            {/* Glass panel */}
            <div className="absolute left-2 top-2 bottom-2 right-1/3 bg-gradient-to-br from-gray-900/80 to-black/90 rounded-xl border border-gray-600/30 overflow-hidden">
              {/* RGB strips */}
              <motion.div 
                className="absolute left-0 top-0 bottom-0 w-1"
                style={{
                  background: 'linear-gradient(to bottom, #8B5CF6, #06B6D4, #8B5CF6)',
                  backgroundSize: '100% 200%',
                }}
                animate={{
                  backgroundPosition: ['0% 0%', '0% 100%', '0% 0%'],
                }}
                transition={{ duration: 3, repeat: Infinity, ease: 'linear' }}
              />
              <motion.div 
                className="absolute right-2 top-4 bottom-4 w-1"
                style={{
                  background: 'linear-gradient(to bottom, #06B6D4, #8B5CF6, #06B6D4)',
                  backgroundSize: '100% 200%',
                }}
                animate={{
                  backgroundPosition: ['0% 100%', '0% 0%', '0% 100%'],
                }}
                transition={{ duration: 3, repeat: Infinity, ease: 'linear' }}
              />
              
              {/* Fan grills with spinning animation */}
              <div className="absolute left-6 top-8 w-16 h-16 rounded-full border-2 border-purple-500/50 flex items-center justify-center">
                <motion.div 
                  className="w-12 h-12 rounded-full border-2 border-cyan-400/50 flex items-center justify-center"
                  animate={{ rotate: 360 }}
                  transition={{ duration: 3, repeat: Infinity, ease: 'linear' }}
                >
                  <div className="w-2 h-2 rounded-full bg-purple-500" />
                </motion.div>
              </div>
              <div className="absolute left-6 top-28 w-16 h-16 rounded-full border-2 border-cyan-500/50 flex items-center justify-center">
                <motion.div 
                  className="w-12 h-12 rounded-full border-2 border-purple-400/50 flex items-center justify-center"
                  animate={{ rotate: -360 }}
                  transition={{ duration: 2.5, repeat: Infinity, ease: 'linear' }}
                >
                  <div className="w-2 h-2 rounded-full bg-cyan-500" />
                </motion.div>
              </div>
              
              {/* GPU glow */}
              <motion.div 
                className="absolute bottom-8 left-4 right-4 h-16 rounded-lg border border-white/10"
                style={{
                  background: 'linear-gradient(90deg, rgba(139,92,246,0.3), rgba(6,182,212,0.4), rgba(139,92,246,0.3))',
                  backgroundSize: '200% 100%',
                }}
                animate={{
                  backgroundPosition: ['0% 0%', '100% 0%', '0% 0%'],
                }}
                transition={{ duration: 2, repeat: Infinity, ease: 'linear' }}
              />
            </div>
            
            {/* IO Panel */}
            <div className="absolute right-2 top-4 w-12 space-y-2">
              <div className="w-6 h-6 rounded-full bg-gray-700 border border-gray-600" />
              <div className="w-full h-1 bg-gray-700 rounded" />
              <div className="w-full h-1 bg-gray-700 rounded" />
            </div>
          </div>
          
          {/* Reflection/glow under case */}
          <motion.div 
            className="absolute -bottom-4 left-1/2 -translate-x-1/2 w-3/4 h-8 rounded-full blur-xl"
            style={{
              background: 'linear-gradient(90deg, rgba(139, 92, 246, 0.5), rgba(6, 182, 212, 0.5))',
            }}
            animate={{
              opacity: [0.5, 0.8, 0.5],
            }}
            transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
          />
        </div>
      </motion.div>
      
      {/* Floating specs badges */}
      <motion.div
        className="absolute top-4 right-0 px-4 py-2 rounded-lg bg-black/70 backdrop-blur-sm border border-purple-500/40 shadow-lg shadow-purple-500/20"
        animate={{ y: [0, -8, 0] }}
        transition={{ duration: 2.5, repeat: Infinity, ease: 'easeInOut', delay: 0.2 }}
      >
        <span className="text-sm font-display font-bold text-gradient-purple">RTX 4090</span>
      </motion.div>
      
      <motion.div
        className="absolute bottom-24 -left-4 px-4 py-2 rounded-lg bg-black/70 backdrop-blur-sm border border-cyan-500/40 shadow-lg shadow-cyan-500/20"
        animate={{ y: [0, -8, 0] }}
        transition={{ duration: 2.5, repeat: Infinity, ease: 'easeInOut', delay: 0.6 }}
      >
        <span className="text-sm font-display font-bold text-cyan-400">Intel i9-14900K</span>
      </motion.div>
      
      <motion.div
        className="absolute bottom-8 right-8 px-4 py-2 rounded-lg bg-black/70 backdrop-blur-sm border border-purple-500/40 shadow-lg shadow-purple-500/20"
        animate={{ y: [0, -8, 0] }}
        transition={{ duration: 2.5, repeat: Infinity, ease: 'easeInOut', delay: 1 }}
      >
        <span className="text-sm font-display font-bold text-purple-400">64GB DDR5</span>
      </motion.div>
    </motion.div>
  );
}

// Stat Item with animated counter effect
function StatItem({ value, label }: { value: string; label: string }) {
  return (
    <motion.div 
      className="text-center lg:text-left"
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
    >
      <div className="font-display font-black text-3xl md:text-4xl bg-gradient-to-r from-purple-400 to-cyan-400 bg-clip-text text-transparent">
        {value}
      </div>
      <div className="text-white/50 text-sm mt-1">{label}</div>
    </motion.div>
  );
}

export function Hero() {
  const ref = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ['start start', 'end start'],
  });
  
  const y = useTransform(scrollYProgress, [0, 1], ['0%', '30%']);
  const opacity = useTransform(scrollYProgress, [0, 0.5], [1, 0]);

  return (
    <section ref={ref} className="relative min-h-screen flex items-center justify-center overflow-hidden pt-10 pb-32">
      {/* Hero-specific background effects */}
      <div className="absolute inset-0 pointer-events-none">
        {/* Central glow */}
        <motion.div 
          className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] rounded-full opacity-30"
          style={{
            background: 'radial-gradient(circle, rgba(139, 92, 246, 0.4) 0%, transparent 60%)',
            filter: 'blur(60px)',
            y,
          }}
        />
        
        {/* Animated scan lines */}
        <motion.div
          className="absolute inset-0 opacity-[0.03]"
          style={{
            backgroundImage: 'repeating-linear-gradient(0deg, transparent, transparent 2px, rgba(139, 92, 246, 0.5) 2px, rgba(139, 92, 246, 0.5) 4px)',
            backgroundSize: '100% 4px',
          }}
          animate={{ y: ['0%', '100%'] }}
          transition={{ duration: 10, repeat: Infinity, ease: 'linear' }}
        />
      </div>
      
      <motion.div className="container mx-auto px-4 relative z-10" style={{ opacity }}>
        <div className="flex flex-col lg:flex-row items-center gap-12 lg:gap-20">
          {/* Text Content */}
          <div className="flex-1 text-center lg:text-left">
            {/* Badge */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-purple-500/10 border border-purple-500/30 mb-6 backdrop-blur-sm"
            >
              <motion.span 
                className="w-2 h-2 rounded-full bg-cyan-400"
                animate={{ 
                  boxShadow: ['0 0 0 0 rgba(34,211,238,0.4)', '0 0 0 8px rgba(34,211,238,0)', '0 0 0 0 rgba(34,211,238,0.4)'],
                }}
                transition={{ duration: 2, repeat: Infinity }}
              />
              <span className="text-sm font-medium text-purple-300">Premium Gaming PCs</span>
            </motion.div>
            
            {/* Main Headline */}
            <motion.h1
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.3 }}
              className="font-display font-black text-4xl sm:text-5xl md:text-6xl lg:text-7xl mb-6 leading-tight"
            >
              <span className="block text-white">Собери свой</span>
              <motion.span 
                className="block bg-gradient-to-r from-purple-400 via-cyan-400 to-purple-400 bg-clip-text text-transparent bg-[length:200%_auto]"
                animate={{ backgroundPosition: ['0% center', '200% center'] }}
                transition={{ duration: 3, repeat: Infinity, ease: 'linear' }}
              >
                идеальный PC
              </motion.span>
            </motion.h1>
            
            {/* Subheadline */}
            <motion.p
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.4 }}
              className="text-lg md:text-xl text-white/60 mb-8 max-w-xl mx-auto lg:mx-0 leading-relaxed"
            >
              Мощные игровые компьютеры с видеокартами RTX 4070/4080/4090.
              <span className="text-cyan-400 font-semibold"> Гарантия 12+ месяцев</span>, полная настройка и активация Windows.
            </motion.p>
            
            {/* CTA Buttons */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.5 }}
              className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start"
            >
              <GlowingButton href="/catalog" variant="primary">
                Смотреть каталог
              </GlowingButton>
              <GlowingButton href="/configurator" variant="secondary">
                Собрать свой PC
              </GlowingButton>
            </motion.div>
            
            {/* Stats */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.7, delay: 0.7 }}
              className="flex flex-wrap gap-8 mt-12 justify-center lg:justify-start"
            >
              <StatItem value="500+" label="собранных ПК" />
              <StatItem value="12+" label="месяцев гарантии" />
              <StatItem value="24/7" label="поддержка" />
            </motion.div>
          </div>
          
          {/* PC Visualization */}
          <div className="flex-1 relative">
            <PCVisualization />
          </div>
        </div>
      </motion.div>
      
      {/* Scroll indicator */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.5 }}
        className="absolute bottom-8 left-1/2 -translate-x-1/2"
      >
        <motion.div
          className="w-6 h-10 rounded-full border-2 border-white/20 flex justify-center pt-2"
          animate={{ y: [0, 5, 0] }}
          transition={{ duration: 1.5, repeat: Infinity }}
        >
          <motion.div
            className="w-1.5 h-3 rounded-full bg-gradient-to-b from-purple-400 to-cyan-400"
            animate={{ opacity: [1, 0.3, 1], y: [0, 4, 0] }}
            transition={{ duration: 1.5, repeat: Infinity }}
          />
        </motion.div>
      </motion.div>
    </section>
  );
}
