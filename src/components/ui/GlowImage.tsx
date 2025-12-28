'use client';

import { motion, useMotionValue, useSpring, useTransform, useReducedMotion } from 'framer-motion';
import { useRef, useState, useMemo, memo } from 'react';
import Image from 'next/image';
import { cn } from '@/lib/cn';
import { useAnimationVisibility } from '@/hooks/useAnimationOptimization';

// ============================================
// PERFORMANCE OPTIMIZED GLOW IMAGE
// ============================================
// Optimizations applied:
// 1. useReducedMotion support
// 2. Intersection Observer to pause off-screen
// 3. Reduced hover particles (8 -> 4)
// 4. will-change CSS for GPU acceleration
// 5. Memoized particle positions
// 6. Conditional animation rendering
// 7. React.memo for sub-components
// ============================================

interface GlowImageProps {
  src: string;
  alt: string;
  width: number;
  height: number;
  className?: string;
  glowColor?: string;
  glowIntensity?: number;
  enableTilt?: boolean;
  tiltIntensity?: number;
  enableFloat?: boolean;
  floatIntensity?: number;
  priority?: boolean;
}

// Pre-computed particle positions for hover effect
const PARTICLE_POSITIONS = [
  { left: '20%', top: '20%', color: '#8B5CF6', delay: 0 },
  { left: '80%', top: '20%', color: '#06B6D4', delay: 0.2 },
  { left: '20%', top: '80%', color: '#06B6D4', delay: 0.4 },
  { left: '80%', top: '80%', color: '#8B5CF6', delay: 0.6 },
];

// Memoized hover particle component
const HoverParticle = memo(function HoverParticle({
  position,
}: {
  position: typeof PARTICLE_POSITIONS[0];
}) {
  return (
    <motion.div
      className="absolute w-1 h-1 rounded-full will-change-transform"
      style={{
        left: position.left,
        top: position.top,
        background: position.color,
        boxShadow: `0 0 10px ${position.color}, 0 0 20px ${position.color}`,
      }}
      animate={{
        y: [0, -30, 0],
        opacity: [0, 1, 0],
        scale: [0, 1.5, 0],
      }}
      transition={{
        duration: 2,
        repeat: Infinity,
        delay: position.delay,
        ease: 'easeOut',
      }}
    />
  );
});

function GlowImageComponent({
  src,
  alt,
  width,
  height,
  className,
  glowColor = 'rgba(139, 92, 246, 0.5)',
  glowIntensity = 1,
  enableTilt = true,
  tiltIntensity = 15,
  enableFloat = true,
  floatIntensity = 15,
  priority = false,
}: GlowImageProps) {
  const ref = useRef<HTMLDivElement>(null);
  const [isHovered, setIsHovered] = useState(false);
  const shouldReduceMotion = useReducedMotion();

  // Use visibility-based animation pausing
  const { ref: visibilityRef, shouldAnimate } = useAnimationVisibility<HTMLDivElement>();

  const x = useMotionValue(0);
  const y = useMotionValue(0);

  const springConfig = { damping: 20, stiffness: 300 };
  const xSpring = useSpring(x, springConfig);
  const ySpring = useSpring(y, springConfig);

  // 3D tilt transforms
  const rotateX = useTransform(ySpring, [-0.5, 0.5], [tiltIntensity, -tiltIntensity]);
  const rotateY = useTransform(xSpring, [-0.5, 0.5], [-tiltIntensity, tiltIntensity]);

  // Glow position
  const glowX = useTransform(xSpring, [-0.5, 0.5], ['20%', '80%']);
  const glowY = useTransform(ySpring, [-0.5, 0.5], ['20%', '80%']);

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!ref.current || !enableTilt || shouldReduceMotion) return;

    const rect = ref.current.getBoundingClientRect();
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;

    const normalizedX = (e.clientX - centerX) / (rect.width / 2);
    const normalizedY = (e.clientY - centerY) / (rect.height / 2);

    x.set(normalizedX * 0.5);
    y.set(normalizedY * 0.5);
  };

  const handleMouseLeave = () => {
    x.set(0);
    y.set(0);
    setIsHovered(false);
  };

  // Skip complex animations if reduced motion is preferred
  const shouldAnimateEffects = shouldAnimate && !shouldReduceMotion;
  const shouldShowFloat = enableFloat && shouldAnimateEffects;
  const shouldShowTilt = enableTilt && shouldAnimateEffects;

  return (
    <div ref={visibilityRef}>
      <motion.div
        ref={ref}
        className={cn('relative will-change-transform', className)}
        onMouseMove={handleMouseMove}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={handleMouseLeave}
        style={{
          perspective: 1000,
          transformStyle: 'preserve-3d',
        }}
        animate={shouldShowFloat ? {
          y: [0, -floatIntensity, 0],
        } : undefined}
        transition={shouldShowFloat ? {
          duration: 4,
          repeat: Infinity,
          ease: 'easeInOut',
        } : undefined}
      >
        {/* Multi-layer glow effect - simplified */}
        {shouldAnimateEffects && (
          <motion.div
            className="absolute inset-0 rounded-2xl blur-3xl -z-10 will-change-opacity"
            style={{
              background: `radial-gradient(circle at 50% 50%, ${glowColor}, transparent 70%)`,
              opacity: isHovered ? glowIntensity : glowIntensity * 0.5,
            }}
            animate={{
              scale: isHovered ? 1.1 : 1,
            }}
            transition={{ duration: 0.3 }}
          />
        )}

        {/* RGB animated border glow - only when visible */}
        {shouldAnimateEffects && (
          <motion.div
            className="absolute -inset-1 rounded-2xl -z-10 opacity-50 will-change-transform"
            style={{
              background: 'conic-gradient(from 0deg, #8B5CF6, #06B6D4, #EC4899, #8B5CF6)',
              filter: 'blur(20px)',
            }}
            animate={{
              rotate: [0, 360],
              opacity: isHovered ? 0.8 : 0.3,
            }}
            transition={{
              rotate: { duration: 8, repeat: Infinity, ease: 'linear' },
              opacity: { duration: 0.3 },
            }}
          />
        )}

        {/* Main image container with 3D effect */}
        <motion.div
          className="relative rounded-2xl overflow-hidden"
          style={{
            rotateX: shouldShowTilt ? rotateX : 0,
            rotateY: shouldShowTilt ? rotateY : 0,
            transformStyle: 'preserve-3d',
          }}
        >
          {/* Holographic overlay - simplified, only on hover */}
          {isHovered && shouldAnimateEffects && (
            <motion.div
              className="absolute inset-0 z-10 pointer-events-none will-change-auto"
              style={{
                background: `linear-gradient(
                  135deg,
                  transparent 0%,
                  rgba(139, 92, 246, 0.1) 25%,
                  transparent 50%,
                  rgba(6, 182, 212, 0.1) 75%,
                  transparent 100%
                )`,
                backgroundSize: '400% 400%',
              }}
              animate={{
                backgroundPosition: ['0% 0%', '100% 100%', '0% 0%'],
              }}
              transition={{
                duration: 3,
                repeat: Infinity,
                ease: 'linear',
              }}
            />
          )}

          {/* Shine effect on hover */}
          {shouldAnimateEffects && (
            <motion.div
              className="absolute inset-0 z-20 pointer-events-none"
              style={{
                background: 'linear-gradient(105deg, transparent 40%, rgba(255,255,255,0.3) 50%, transparent 60%)',
              }}
              initial={{ x: '-100%' }}
              animate={isHovered ? { x: '100%' } : { x: '-100%' }}
              transition={{ duration: 0.6, ease: 'easeInOut' }}
            />
          )}

          {/* The actual image */}
          <Image
            src={src}
            alt={alt}
            width={width}
            height={height}
            className="relative z-0 object-contain"
            priority={priority}
          />

          {/* Reflection effect at bottom - static, no animation */}
          <div
            className="absolute bottom-0 left-0 right-0 h-1/3 z-10 pointer-events-none"
            style={{
              background: 'linear-gradient(to top, rgba(0,0,0,0.8), transparent)',
            }}
          />
        </motion.div>

        {/* Floating particles around image - reduced from 8 to 4 */}
        {isHovered && shouldAnimateEffects && (
          <div className="absolute inset-0 pointer-events-none">
            {PARTICLE_POSITIONS.map((position, i) => (
              <HoverParticle key={i} position={position} />
            ))}
          </div>
        )}

        {/* Bottom reflection/glow - only when visible */}
        {shouldAnimateEffects && (
          <motion.div
            className="absolute -bottom-4 left-1/2 -translate-x-1/2 w-3/4 h-8 rounded-full blur-xl -z-10 will-change-opacity"
            style={{
              background: 'linear-gradient(90deg, rgba(139,92,246,0.5), rgba(6,182,212,0.5))',
            }}
            animate={{
              opacity: [0.3, 0.6, 0.3],
              scaleX: [0.8, 1, 0.8],
            }}
            transition={{
              duration: 3,
              repeat: Infinity,
              ease: 'easeInOut',
            }}
          />
        )}
      </motion.div>
    </div>
  );
}

// Export memoized component
export const GlowImage = memo(GlowImageComponent);

// Preset for hero PC image
export function HeroPCImage({ className }: { className?: string }) {
  return (
    <GlowImage
      src="/2 (2) 1.png"
      alt="Gaming PC with RGB lighting"
      width={600}
      height={700}
      className={className}
      glowColor="rgba(139, 92, 246, 0.6)"
      glowIntensity={1.2}
      enableTilt={true}
      tiltIntensity={10}
      enableFloat={true}
      floatIntensity={20}
      priority={true}
    />
  );
}
