'use client';

import { motion, useReducedMotion, Variants } from 'framer-motion';
import { useEffect, useMemo, useRef, useState, memo } from 'react';
import { cn } from '@/lib/cn';
import {
  useAnimationVisibility,
  useGlobalMousePosition,
  seededRandom,
} from '@/hooks/useAnimationOptimization';

// ============================================
// PERFORMANCE OPTIMIZED PARTICLE FIELD
// ============================================
// Optimizations applied:
// 1. Pre-computed animation values (no Math.random() during render)
// 2. useReducedMotion support
// 3. Intersection Observer to pause off-screen
// 4. RAF-throttled mouse position tracking
// 5. Reduced default particle count (30 -> 15)
// 6. Reduced SVG line count (20 -> 5)
// 7. Memoized particle objects
// 8. will-change CSS for GPU acceleration
// 9. React.memo to prevent unnecessary re-renders
// ============================================

interface Particle {
  id: number;
  x: number;
  y: number;
  size: number;
  color: string;
  duration: number;
  delay: number;
  path: 'float' | 'orbit' | 'pulse' | 'drift';
  // Pre-computed random values for animation
  floatX: number;
  driftX: number;
  driftY: number;
}

interface ParticleFieldProps {
  className?: string;
  particleCount?: number;
  colors?: string[];
  minSize?: number;
  maxSize?: number;
  speed?: number;
  interactive?: boolean;
}

// Animation variants defined OUTSIDE component to prevent recreation
const getAnimationVariants = (particle: Particle): Variants => {
  switch (particle.path) {
    case 'float':
      return {
        animate: {
          y: [0, -50, 0],
          x: [0, particle.floatX, 0],
          opacity: [0.2, 0.8, 0.2],
          scale: [0.8, 1.2, 0.8],
        },
      };
    case 'orbit':
      return {
        animate: {
          x: [0, 30, 0, -30, 0],
          y: [0, -15, -30, -15, 0],
          opacity: [0.3, 0.7, 0.3],
          rotate: [0, 360],
        },
      };
    case 'pulse':
      return {
        animate: {
          scale: [0.5, 1.5, 0.5],
          opacity: [0.2, 1, 0.2],
        },
      };
    case 'drift':
      return {
        animate: {
          x: [0, particle.driftX],
          y: [0, particle.driftY],
          opacity: [0, 0.8, 0],
          scale: [0.5, 1, 0.5],
        },
      };
    default:
      return { animate: {} };
  }
};

// Memoized particle component
const ParticleElement = memo(function ParticleElement({
  particle,
  shouldAnimate,
}: {
  particle: Particle;
  shouldAnimate: boolean;
}) {
  const variants = useMemo(() => getAnimationVariants(particle), [particle]);

  return (
    <motion.div
      className="absolute rounded-full will-change-transform"
      style={{
        left: `${particle.x}%`,
        top: `${particle.y}%`,
        width: particle.size,
        height: particle.size,
        background: particle.color,
        boxShadow: `0 0 ${particle.size * 2}px ${particle.color}, 0 0 ${particle.size * 4}px ${particle.color}`,
      }}
      variants={variants}
      animate={shouldAnimate ? 'animate' : undefined}
      transition={{
        duration: particle.duration,
        repeat: Infinity,
        delay: particle.delay,
        ease: 'easeInOut',
      }}
    />
  );
});

// Memoized connection lines component
const ConnectionLines = memo(function ConnectionLines({
  particles,
  shouldAnimate,
}: {
  particles: Particle[];
  shouldAnimate: boolean;
}) {
  // Only render 5 lines max for performance
  const lineParticles = particles.slice(0, 5);

  if (!shouldAnimate) return null;

  return (
    <svg className="absolute inset-0 w-full h-full pointer-events-none">
      <defs>
        <linearGradient id="lineGradient" x1="0%" y1="0%" x2="100%" y2="0%">
          <stop offset="0%" stopColor="#8B5CF6" stopOpacity="0" />
          <stop offset="50%" stopColor="#8B5CF6" stopOpacity="0.3" />
          <stop offset="100%" stopColor="#8B5CF6" stopOpacity="0" />
        </linearGradient>
      </defs>
      {lineParticles.map((p1, i) => {
        const p2 = lineParticles[(i + 1) % lineParticles.length];
        return (
          <motion.line
            key={i}
            x1={`${p1.x}%`}
            y1={`${p1.y}%`}
            x2={`${p2.x}%`}
            y2={`${p2.y}%`}
            stroke="url(#lineGradient)"
            strokeWidth="0.5"
            initial={{ pathLength: 0, opacity: 0 }}
            animate={{
              pathLength: [0, 1, 0],
              opacity: [0, 0.3, 0],
            }}
            transition={{
              duration: 5,
              repeat: Infinity,
              delay: i * 0.8,
              ease: 'easeInOut',
            }}
          />
        );
      })}
    </svg>
  );
});

function ParticleFieldComponent({
  className,
  particleCount = 15, // Reduced from 30 for performance
  colors = ['#8B5CF6', '#8B5CF6', '#EC4899', '#A78BFA'],
  minSize = 2,
  maxSize = 6,
  speed = 1,
  interactive = true,
}: ParticleFieldProps) {
  const [mounted, setMounted] = useState(false);
  const shouldReduceMotion = useReducedMotion();

  // Use visibility-based animation pausing
  const { ref, shouldAnimate } = useAnimationVisibility<HTMLDivElement>();

  // Use RAF-throttled mouse position
  const mousePosition = useGlobalMousePosition(interactive && shouldAnimate);

  useEffect(() => {
    setMounted(true);
  }, []);

  // Generate particles with pre-computed random values
  const particles = useMemo(() => {
    if (!mounted) return [];

    // Use seeded random for consistent values
    const random = seededRandom(42); // Fixed seed for consistency
    const paths: Array<Particle['path']> = ['float', 'orbit', 'pulse', 'drift'];

    return Array.from({ length: particleCount }, (_, i): Particle => {
      const path = paths[Math.floor(random() * paths.length)];
      return {
        id: i,
        x: random() * 100,
        y: random() * 100,
        size: minSize + random() * (maxSize - minSize),
        color: colors[Math.floor(random() * colors.length)],
        duration: (5 + random() * 10) / speed,
        delay: random() * 5,
        path,
        // Pre-compute random animation values
        floatX: random() * 30 - 15,
        driftX: random() * 100 - 50,
        driftY: -100,
      };
    });
  }, [mounted, particleCount, colors, minSize, maxSize, speed]);

  // Don't render if reduced motion or not mounted
  if (!mounted || shouldReduceMotion) return null;

  return (
    <div
      ref={ref}
      className={cn('absolute inset-0 overflow-hidden pointer-events-none', className)}
    >
      {/* Particles */}
      {particles.map((particle) => (
        <ParticleElement
          key={particle.id}
          particle={particle}
          shouldAnimate={shouldAnimate}
        />
      ))}

      {/* Interactive glow following mouse - only when visible and interactive */}
      {interactive && shouldAnimate && (
        <motion.div
          className="absolute w-64 h-64 rounded-full pointer-events-none will-change-transform"
          style={{
            background: 'radial-gradient(circle, rgba(139,92,246,0.15) 0%, transparent 70%)',
            x: mousePosition.x - 128,
            y: mousePosition.y - 128,
          }}
          animate={{
            scale: [1, 1.1, 1],
          }}
          transition={{
            duration: 2,
            repeat: Infinity,
            ease: 'easeInOut',
          }}
        />
      )}

      {/* Connection lines - reduced count */}
      <ConnectionLines particles={particles} shouldAnimate={shouldAnimate} />
    </div>
  );
}

// Export memoized component
export const ParticleField = memo(ParticleFieldComponent);

// Preset for hero background - reduced particle count
export function HeroParticles() {
  return (
    <ParticleField
      particleCount={20} // Reduced from 40 for performance
      colors={['#8B5CF6', '#8B5CF6', '#A78BFA', '#A78BFA']}
      minSize={2}
      maxSize={5}
      speed={0.8}
      interactive={true}
    />
  );
}

// Preset for subtle section background
export function SectionParticles() {
  return (
    <ParticleField
      particleCount={10} // Reduced from 15 for performance
      colors={['#8B5CF6', '#8B5CF6']}
      minSize={1}
      maxSize={3}
      speed={0.5}
      interactive={false}
    />
  );
}
