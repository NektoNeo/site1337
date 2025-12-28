'use client';

import { motion, useMotionValue, useSpring, useTransform } from 'framer-motion';
import { useRef, useState, memo } from 'react';
import Image from 'next/image';

/**
 * Hero PC Image with 3D tilt effects and floating spec badges
 * This is the main visual element of the hero section
 * Memoized to prevent unnecessary re-renders
 */
export const HeroPCImage = memo(function HeroPCImage() {
  const ref = useRef<HTMLDivElement>(null);
  const [isHovered, setIsHovered] = useState(false);

  const x = useMotionValue(0);
  const y = useMotionValue(0);

  const springConfig = { damping: 20, stiffness: 300 };
  const xSpring = useSpring(x, springConfig);
  const ySpring = useSpring(y, springConfig);

  const rotateX = useTransform(ySpring, [-0.5, 0.5], [10, -10]);
  const rotateY = useTransform(xSpring, [-0.5, 0.5], [-10, 10]);

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!ref.current) return;
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

  return (
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
      {/* Multi-layer glow effects */}
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

      {/* RGB spinning border */}
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

      {/* Main image with 3D tilt */}
      <motion.div
        className="relative z-10 will-change-transform"
        style={{
          rotateX,
          rotateY,
          transformStyle: 'preserve-3d',
        }}
        animate={{ y: [0, -20, 0] }}
        transition={{ duration: 5, repeat: Infinity, ease: 'easeInOut' }}
      >
        {/* Image with explicit dimensions for CLS */}
        <Image
          src="/gaming-pc-hero.png"
          alt="Игровой компьютер VA-PC с RGB подсветкой"
          width={600}
          height={700}
          className="relative z-10 drop-shadow-2xl"
          priority
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 600px"
        />

        {/* Holographic overlay */}
        <motion.div
          className="absolute inset-0 z-20 pointer-events-none rounded-3xl overflow-hidden"
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

        {/* Shine effect */}
        <motion.div
          className="absolute inset-0 z-30 pointer-events-none"
          style={{
            background: 'linear-gradient(105deg, transparent 40%, rgba(255,255,255,0.2) 50%, transparent 60%)',
          }}
          initial={{ x: '-100%' }}
          animate={isHovered ? { x: '100%' } : { x: '-100%' }}
          transition={{ duration: 0.8, ease: 'easeInOut' }}
        />
      </motion.div>

      {/* Floating spec badges */}
      <FloatingBadge
        position="-top-4 -right-4"
        delay={0.2}
        borderColor="border-purple-500/50"
        shadowColor="shadow-purple-500/20"
      >
        <span className="text-sm font-bold bg-gradient-to-r from-green-400 to-cyan-400 bg-clip-text text-transparent">
          RTX 4090
        </span>
      </FloatingBadge>

      <FloatingBadge
        position="top-1/3 -left-8"
        delay={0.6}
        borderColor="border-cyan-500/50"
        shadowColor="shadow-cyan-500/20"
      >
        <span className="text-sm font-bold text-cyan-400">Intel i9-14900K</span>
      </FloatingBadge>

      <FloatingBadge
        position="bottom-1/4 -right-4"
        delay={1}
        borderColor="border-purple-500/50"
        shadowColor="shadow-purple-500/20"
      >
        <span className="text-sm font-bold text-purple-400">64GB DDR5</span>
      </FloatingBadge>

      {/* Bottom reflection */}
      <motion.div
        className="absolute -bottom-8 left-1/2 -translate-x-1/2 w-3/4 h-16 rounded-full -z-10"
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
    </motion.div>
  );
});

// Floating badge sub-component
interface FloatingBadgeProps {
  children: React.ReactNode;
  position: string;
  delay: number;
  borderColor: string;
  shadowColor: string;
}

const FloatingBadge = memo(function FloatingBadge({
  children,
  position,
  delay,
  borderColor,
  shadowColor,
}: FloatingBadgeProps) {
  return (
    <motion.div
      className={`absolute ${position} z-30`}
      animate={{ y: [0, -10, 0] }}
      transition={{ duration: 3, repeat: Infinity, delay }}
    >
      <div className={`px-4 py-2 rounded-xl bg-black/80 backdrop-blur-md border ${borderColor} shadow-lg ${shadowColor}`}>
        {children}
      </div>
    </motion.div>
  );
});
