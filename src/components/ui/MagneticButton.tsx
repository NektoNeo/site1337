'use client';

import { motion, useMotionValue, useSpring, useTransform, useReducedMotion } from 'framer-motion';
import { useRef, useState, useMemo, memo } from 'react';
import Link from 'next/link';
import { cn } from '@/lib/cn';
import { useParticleBurstPositions } from '@/hooks/useAnimationOptimization';

// ============================================
// PERFORMANCE OPTIMIZED MAGNETIC BUTTON
// ============================================
// Optimizations applied:
// 1. useReducedMotion support
// 2. Pre-computed particle burst positions (useMemo)
// 3. will-change CSS for GPU acceleration
// 4. Conditional rendering of effects
// 5. React.memo for the component
// 6. Reduced particle count (6 -> 4)
// ============================================

interface MagneticButtonProps {
  children: React.ReactNode;
  href?: string;
  onClick?: () => void;
  variant?: 'primary' | 'secondary' | 'ghost';
  size?: 'sm' | 'md' | 'lg';
  className?: string;
  magneticStrength?: number;
  glowColor?: string;
}

// Pre-computed particle positions for burst effect
const PARTICLE_COUNT = 4;
const PARTICLE_RADIUS = 40;

function MagneticButtonComponent({
  children,
  href,
  onClick,
  variant = 'primary',
  size = 'md',
  className,
  magneticStrength = 0.3,
  glowColor = 'rgba(139, 92, 246, 0.6)',
}: MagneticButtonProps) {
  const ref = useRef<HTMLDivElement>(null);
  const [isHovered, setIsHovered] = useState(false);
  const shouldReduceMotion = useReducedMotion();

  // Pre-computed particle positions
  const particlePositions = useParticleBurstPositions(PARTICLE_COUNT, PARTICLE_RADIUS);

  const x = useMotionValue(0);
  const y = useMotionValue(0);

  const springConfig = { damping: 15, stiffness: 150 };
  const xSpring = useSpring(x, springConfig);
  const ySpring = useSpring(y, springConfig);

  // Glow effect transforms
  const glowOpacity = useTransform(
    [xSpring, ySpring],
    ([latestX, latestY]: number[]) => {
      const distance = Math.sqrt(latestX * latestX + latestY * latestY);
      return Math.min(1, distance / 50 + 0.5);
    }
  );

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!ref.current || shouldReduceMotion) return;

    const rect = ref.current.getBoundingClientRect();
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;

    const deltaX = (e.clientX - centerX) * magneticStrength;
    const deltaY = (e.clientY - centerY) * magneticStrength;

    x.set(deltaX);
    y.set(deltaY);
  };

  const handleMouseLeave = () => {
    x.set(0);
    y.set(0);
    setIsHovered(false);
  };

  const sizeStyles = {
    sm: 'px-4 py-2 text-sm',
    md: 'px-6 py-3 text-base',
    lg: 'px-8 py-4 text-lg',
  };

  const variantStyles = {
    primary: `
      bg-gradient-to-r from-purple-600 via-purple-500 to-cyan-500
      text-white font-bold
      shadow-[0_0_20px_rgba(139,92,246,0.4)]
      hover:shadow-[0_0_40px_rgba(139,92,246,0.6),0_0_60px_rgba(6,182,212,0.3)]
    `,
    secondary: `
      bg-transparent border-2 border-purple-500/50
      text-purple-400 font-semibold
      hover:border-purple-400 hover:text-purple-300
      hover:shadow-[0_0_30px_rgba(139,92,246,0.3)]
    `,
    ghost: `
      bg-white/5 backdrop-blur-sm
      text-white/80 font-medium
      hover:bg-white/10 hover:text-white
    `,
  };

  // Determine if animations should be shown
  const shouldAnimate = !shouldReduceMotion;

  const ButtonContent = (
    <motion.div
      ref={ref}
      className={cn(
        'relative inline-flex items-center justify-center gap-2 rounded-xl cursor-pointer overflow-hidden transition-colors duration-300 will-change-transform',
        sizeStyles[size],
        variantStyles[variant],
        className
      )}
      style={{
        x: shouldAnimate ? xSpring : 0,
        y: shouldAnimate ? ySpring : 0,
      }}
      onMouseMove={handleMouseMove}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={handleMouseLeave}
      onClick={onClick}
      whileTap={shouldAnimate ? { scale: 0.95 } : undefined}
    >
      {/* Animated gradient border - only for primary variant and when animating */}
      {variant === 'primary' && shouldAnimate && (
        <motion.div
          className="absolute inset-0 rounded-xl will-change-transform"
          style={{
            background: `conic-gradient(from 0deg, #8B5CF6, #06B6D4, #EC4899, #8B5CF6)`,
            opacity: isHovered ? 0.3 : 0,
          }}
          animate={{
            rotate: isHovered ? 360 : 0,
          }}
          transition={{
            duration: 3,
            repeat: Infinity,
            ease: 'linear',
          }}
        />
      )}

      {/* Shimmer effect */}
      {shouldAnimate && (
        <motion.div
          className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent"
          initial={{ x: '-100%' }}
          animate={isHovered ? { x: '100%' } : { x: '-100%' }}
          transition={{ duration: 0.6, ease: 'easeInOut' }}
        />
      )}

      {/* Ripple effect on hover */}
      {isHovered && shouldAnimate && (
        <motion.div
          className="absolute inset-0 rounded-xl"
          style={{ background: glowColor }}
          initial={{ scale: 0, opacity: 0.5 }}
          animate={{ scale: 2, opacity: 0 }}
          transition={{ duration: 0.6 }}
        />
      )}

      {/* Glow backdrop */}
      {shouldAnimate && (
        <motion.div
          className="absolute -inset-2 rounded-xl blur-xl -z-10 will-change-opacity"
          style={{
            background: variant === 'primary'
              ? 'linear-gradient(135deg, rgba(139,92,246,0.4), rgba(6,182,212,0.3))'
              : 'rgba(139,92,246,0.2)',
            opacity: glowOpacity,
          }}
        />
      )}

      {/* Button text */}
      <span className="relative z-10 flex items-center gap-2">
        {children}
      </span>

      {/* Particle burst on hover - using pre-computed positions */}
      {isHovered && variant === 'primary' && shouldAnimate && (
        <>
          {particlePositions.map((pos, i) => (
            <motion.div
              key={i}
              className="absolute w-1 h-1 rounded-full bg-cyan-400 will-change-transform"
              initial={{
                x: 0,
                y: 0,
                opacity: 1,
                scale: 1
              }}
              animate={{
                x: pos.x,
                y: pos.y,
                opacity: 0,
                scale: 0,
              }}
              transition={{
                duration: 0.5,
                delay: i * 0.05,
              }}
            />
          ))}
        </>
      )}
    </motion.div>
  );

  if (href) {
    return <Link href={href}>{ButtonContent}</Link>;
  }

  return ButtonContent;
}

// Export memoized component
export const MagneticButton = memo(MagneticButtonComponent);

// Preset variants for common use cases
export function PrimaryCTAButton({ children, ...props }: Omit<MagneticButtonProps, 'variant'>) {
  return (
    <MagneticButton variant="primary" size="lg" magneticStrength={0.4} {...props}>
      {children}
    </MagneticButton>
  );
}

export function SecondaryCTAButton({ children, ...props }: Omit<MagneticButtonProps, 'variant'>) {
  return (
    <MagneticButton variant="secondary" size="lg" magneticStrength={0.3} {...props}>
      {children}
    </MagneticButton>
  );
}
