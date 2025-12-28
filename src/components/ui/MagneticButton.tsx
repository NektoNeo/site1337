'use client';

import { motion, useMotionValue, useSpring, useTransform, useReducedMotion } from 'framer-motion';
import { useRef, useState, memo } from 'react';
import Link from 'next/link';
import { cn } from '@/lib/cn';

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
function MagneticButtonComponent({
  children,
  href,
  onClick,
  variant = 'primary',
  size = 'md',
  className,
  magneticStrength = 0.3,
  glowColor: _glowColor = 'rgba(139, 92, 246, 0.6)',
}: MagneticButtonProps) {
  const ref = useRef<HTMLDivElement>(null);
  const [isHovered, setIsHovered] = useState(false);
  const shouldReduceMotion = useReducedMotion();

  const x = useMotionValue(0);
  const y = useMotionValue(0);

  const springConfig = { damping: 15, stiffness: 150 };
  const xSpring = useSpring(x, springConfig);
  const ySpring = useSpring(y, springConfig);

  // Glow effect transforms
  const glowOpacity = useTransform([xSpring, ySpring], ([latestX, latestY]: number[]) => {
    const distance = Math.sqrt(latestX * latestX + latestY * latestY);
    return Math.min(1, distance / 60 + 0.4);
  });

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
      bg-white text-black font-semibold
      border border-white/10
      hover:bg-white/90
    `,
    secondary: `
      bg-transparent border border-white/20
      text-white/80 font-medium
      hover:border-white/40 hover:text-white
    `,
    ghost: `
      bg-white/5 backdrop-blur-sm
      text-white/70 font-medium
      hover:bg-white/10 hover:text-white
    `,
  };

  // Determine if animations should be shown
  const shouldAnimate = !shouldReduceMotion;

  const ButtonContent = (
    <motion.div
      ref={ref}
      className={cn(
        'relative inline-flex items-center justify-center gap-2 rounded-xl cursor-pointer transition-colors duration-300 will-change-transform',
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
      {/* Glow backdrop */}
      {shouldAnimate && (
        <motion.div
          className="absolute -inset-2 rounded-xl blur-xl -z-10 will-change-opacity"
          style={{
            background:
              variant === 'primary'
                ? 'linear-gradient(135deg, rgba(255,255,255,0.5), rgba(255,255,255,0.2))'
                : 'rgba(255,255,255,0.08)',
            opacity: glowOpacity,
          }}
        />
      )}

      {/* Button text */}
      <span className="relative z-10 flex items-center gap-2">
        {children}
      </span>
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
