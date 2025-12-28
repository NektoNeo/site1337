'use client';

import { motion, useMotionValue, useSpring, useTransform } from 'framer-motion';
import { useRef, ReactNode } from 'react';
import { cn } from '@/lib/cn';

interface GlowCardProps {
  children: ReactNode;
  className?: string;
  variant?: 'default' | 'premium' | 'cyber';
  enableTilt?: boolean;
  tiltIntensity?: number;
  enableGlow?: boolean;
  glowColor?: string;
  enableBorder?: boolean;
  enableShine?: boolean;
  enableParticles?: boolean;
  onClick?: () => void;
}

export function GlowCard({
  children,
  className,
  variant = 'default',
  enableTilt = true,
  tiltIntensity = 6,
  enableGlow = true,
  glowColor: _glowColor,
  enableBorder: _enableBorder = false,
  enableShine: _enableShine = false,
  enableParticles: _enableParticles = false,
  onClick,
}: GlowCardProps) {
  const ref = useRef<HTMLDivElement>(null);
  const x = useMotionValue(0);
  const y = useMotionValue(0);

  const springConfig = { damping: 20, stiffness: 300 };
  const xSpring = useSpring(x, springConfig);
  const ySpring = useSpring(y, springConfig);

  // 3D tilt transforms
  const rotateX = useTransform(ySpring, [-0.5, 0.5], [tiltIntensity, -tiltIntensity]);
  const rotateY = useTransform(xSpring, [-0.5, 0.5], [-tiltIntensity, tiltIntensity]);

  // Glow position based on mouse
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);
  const glowX = useTransform(mouseX, (value) => `${value}px`);
  const glowY = useTransform(mouseY, (value) => `${value}px`);

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!ref.current) return;

    const rect = ref.current.getBoundingClientRect();
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;

    const normalizedX = (e.clientX - centerX) / (rect.width / 2);
    const normalizedY = (e.clientY - centerY) / (rect.height / 2);

    if (enableTilt) {
      x.set(normalizedX * 0.5);
      y.set(normalizedY * 0.5);
    }
  };

  const handleMouseLeave = () => {
    x.set(0);
    y.set(0);
  };

  const variantStyles = {
    default: 'bg-[#0f0f12] border-white/10',
    premium: 'bg-[#0d0d10] border-white/12',
    cyber: 'bg-[#0b0b0d] border-white/14',
  };

  const hoverStyles = enableGlow
    ? 'hover:border-white/25 hover:shadow-[0_20px_45px_rgba(0,0,0,0.55)]'
    : '';

  return (
    <motion.div
      ref={ref}
      className={cn('relative group', className)}
      style={{
        perspective: enableTilt ? 1000 : undefined,
        transformStyle: enableTilt ? 'preserve-3d' : undefined,
      }}
      onMouseMove={enableTilt ? handleMouseMove : undefined}
      onMouseLeave={handleMouseLeave}
      onClick={onClick}
    >
      <motion.div
        className={cn(
          'relative rounded-2xl border overflow-hidden transition-all duration-300 backdrop-blur-md',
          variantStyles[variant],
          hoverStyles,
          className
        )}
        style={{
          rotateX: enableTilt ? rotateX : 0,
          rotateY: enableTilt ? rotateY : 0,
          transformStyle: enableTilt ? 'preserve-3d' : undefined,
        }}
      >
        <div className="relative z-10">
          {children}
        </div>
      </motion.div>
    </motion.div>
  );
}

// Product card preset with all premium features
export function PremiumProductCard({
  children,
  className
}: {
  children: ReactNode;
  className?: string;
}) {
  return (
    <GlowCard
      variant="premium"
      enableTilt={true}
      tiltIntensity={6}
      enableGlow={true}
      enableBorder={true}
      enableShine={true}
      enableParticles={true}
      className={className}
    >
      {children}
    </GlowCard>
  );
}

// Service card preset
export function ServiceCard({
  children,
  className
}: {
  children: ReactNode;
  className?: string;
}) {
  return (
    <GlowCard
      variant="default"
      enableTilt={true}
      tiltIntensity={5}
      enableGlow={true}
      enableBorder={true}
      enableShine={true}
      enableParticles={false}
      className={className}
    >
      {children}
    </GlowCard>
  );
}

// Cyber-style card for tech specs
export function CyberCard({
  children,
  className
}: {
  children: ReactNode;
  className?: string;
}) {
  return (
    <GlowCard
      variant="cyber"
      enableTilt={true}
      tiltIntensity={4}
      enableGlow={true}
      enableBorder={true}
      enableShine={true}
      enableParticles={false}
      className={className}
    >
      {children}
    </GlowCard>
  );
}
