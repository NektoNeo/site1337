'use client';

import { motion, useScroll, useTransform } from 'framer-motion';
import { useRef } from 'react';
import { AnimatedBackground } from '@/components/ui/AnimatedBackground';
import { Hero } from '@/components/home/Hero';
import { Services } from '@/components/home/Services';
import { FeaturedProducts } from '@/components/home/FeaturedProducts';
import { Payment } from '@/components/home/Payment';
import { Stages } from '@/components/home/Stages';
import { Gifts } from '@/components/home/Gifts';
import { Advantages } from '@/components/home/Advantages';
import { Socials } from '@/components/home/Socials';
import { Cases } from '@/components/home/Cases';
import { Live } from '@/components/home/Live';
import { CTASection } from '@/components/home/CTASection';

// Floating RGB particles component for extra visual flair
function FloatingParticles() {
  return (
    <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden">
      {[...Array(20)].map((_, i) => (
        <motion.div
          key={i}
          className="absolute w-1 h-1 rounded-full"
          style={{
            left: `${Math.random() * 100}%`,
            top: `${Math.random() * 100}%`,
            background: i % 2 === 0 ? '#8B5CF6' : '#06B6D4',
            boxShadow: i % 2 === 0
              ? '0 0 10px #8B5CF6, 0 0 20px #8B5CF6'
              : '0 0 10px #06B6D4, 0 0 20px #06B6D4',
          }}
          animate={{
            y: [0, -100, 0],
            x: [0, Math.random() * 50 - 25, 0],
            opacity: [0, 1, 0],
            scale: [0, 1, 0],
          }}
          transition={{
            duration: 5 + Math.random() * 5,
            repeat: Infinity,
            delay: Math.random() * 5,
            ease: 'easeInOut',
          }}
        />
      ))}
    </div>
  );
}

// Section divider with RGB line
function SectionDivider() {
  return (
    <div className="relative h-px w-full max-w-4xl mx-auto my-8">
      <motion.div
        className="absolute inset-0 bg-gradient-to-r from-transparent via-purple-500 to-transparent"
        initial={{ scaleX: 0, opacity: 0 }}
        whileInView={{ scaleX: 1, opacity: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 1, ease: 'easeOut' }}
      />
      <motion.div
        className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-3 h-3"
        initial={{ scale: 0, rotate: 0 }}
        whileInView={{ scale: 1, rotate: 45 }}
        viewport={{ once: true }}
        transition={{ duration: 0.5, delay: 0.5 }}
      >
        <div className="w-full h-full bg-gradient-to-br from-purple-500 to-cyan-500 rounded-sm" />
      </motion.div>
    </div>
  );
}

// Scroll progress indicator
function ScrollProgress() {
  const { scrollYProgress } = useScroll();

  return (
    <motion.div
      className="fixed top-20 left-0 right-0 h-[2px] bg-gradient-to-r from-purple-600 via-cyan-500 to-purple-600 origin-left z-50"
      style={{ scaleX: scrollYProgress }}
    />
  );
}

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
    <div ref={containerRef} className="relative min-h-screen overflow-hidden">
      {/* Scroll Progress Indicator */}
      <ScrollProgress />

      {/* Global animated background with parallax */}
      <motion.div style={{ y: bgY, opacity: bgOpacity }}>
        <AnimatedBackground />
      </motion.div>

      {/* Floating RGB Particles */}
      <FloatingParticles />

      {/* Main content - Section order from original va-pc.ru */}
      <div className="relative z-10">
        {/* 1. Hero Section - Main headline and featured PC (NewsBlock equivalent) */}
        <Hero />

        <SectionDivider />

        {/* 2. Services - "НАШИ УСЛУГИ" */}
        <Services />

        <SectionDivider />

        {/* 3. Products - "ЛУЧШЕЕ РЕШЕНИЕ ДЛЯ ВАС" */}
        <FeaturedProducts />

        <SectionDivider />

        {/* 4. Payment - "РАССРОЧКА" */}
        <Payment />

        <SectionDivider />

        {/* 5. Stages - "ЭТАПЫ РАБОТЫ" */}
        <Stages />

        <SectionDivider />

        {/* 6. Gifts - "ВМЕСТЕ С ПК ВЫ ПОЛУЧИТЕ" */}
        <Gifts />

        <SectionDivider />

        {/* 7. Advantages - "НАШИ ПРЕИМУЩЕСТВА" */}
        <Advantages />

        <SectionDivider />

        {/* 8. Socials - "НАШИ СОЦИАЛЬНЫЕ СЕТИ" */}
        <Socials />

        <SectionDivider />

        {/* 9. Cases - "НАШИ КЕЙСЫ" */}
        <Cases />

        <SectionDivider />

        {/* 10. Live - "LIVE ЛЕНТА" */}
        <Live />

        <SectionDivider />

        {/* 11. Form - Contact / CTA Section */}
        <CTASection />
      </div>

      {/* Bottom gradient fade */}
      <div className="fixed bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-black via-black/50 to-transparent pointer-events-none z-20" />
    </div>
  );
}
