'use client';

import { motion, useMotionValue, useSpring, useTransform } from 'framer-motion';
import { useRef, ReactNode, useCallback, useState } from 'react';
import { cn } from '@/lib/cn';
import { useReducedMotion } from '@/hooks/useReducedMotion';

interface GlowCardProps {
  children: ReactNode;
  className?: string;
  variant?: 'default' | 'premium' | 'cyber' | 'cosmic';
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
  glowColor = 'rgba(168, 85, 247, 0.4)',
  enableBorder = false,
  enableShine = false,
  enableParticles: _enableParticles = false,
  onClick,
}: GlowCardProps) {
  const ref = useRef<HTMLDivElement>(null);
  const reducedMotion = useReducedMotion();
  const [isHovered, setIsHovered] = useState(false);
  
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);

  const springConfig = { damping: 20, stiffness: 300 };
  const xSpring = useSpring(x, springConfig);
  const ySpring = useSpring(y, springConfig);

  // 3D tilt transforms
  const rotateX = useTransform(ySpring, [-0.5, 0.5], [tiltIntensity, -tiltIntensity]);
  const rotateY = useTransform(xSpring, [-0.5, 0.5], [-tiltIntensity, tiltIntensity]);

  // Shine effect position
  const shineX = useSpring(mouseX, { damping: 30, stiffness: 200 });
  const shineY = useSpring(mouseY, { damping: 30, stiffness: 200 });

  const handleMouseMove = useCallback((e: React.MouseEvent) => {
    if (!ref.current || reducedMotion) return;

    const rect = ref.current.getBoundingClientRect();
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;

    const normalizedX = (e.clientX - centerX) / (rect.width / 2);
    const normalizedY = (e.clientY - centerY) / (rect.height / 2);

    if (enableTilt) {
      x.set(normalizedX * 0.5);
      y.set(normalizedY * 0.5);
    }
    
    // Update mouse position for shine/glow
    mouseX.set(e.clientX - rect.left);
    mouseY.set(e.clientY - rect.top);
  }, [enableTilt, x, y, mouseX, mouseY, reducedMotion]);

  const handleMouseEnter = useCallback(() => {
    setIsHovered(true);
  }, []);

  const handleMouseLeave = useCallback(() => {
    x.set(0);
    y.set(0);
    setIsHovered(false);
  }, [x, y]);

  const variantStyles = {
    default: 'bg-[#0f0f12]/90 border-white/10',
    premium: 'bg-[#0d0d10]/95 border-purple-500/20',
    cyber: 'bg-[#0b0b0d]/95 border-purple-500/15',
    cosmic: 'bg-[#0a0a0f]/90 border-purple-500/25 backdrop-blur-xl',
  };

  const hoverBorderStyles = {
    default: 'hover:border-white/25',
    premium: 'hover:border-purple-500/40',
    cyber: 'hover:border-purple-400/35',
    cosmic: 'hover:border-purple-400/50',
  };

  // Disable effects if reduced motion is preferred
  const shouldAnimate = !reducedMotion;
  const effectiveTilt = shouldAnimate && enableTilt;
  const effectiveGlow = shouldAnimate && enableGlow;
  const effectiveShine = shouldAnimate && enableShine;

  return (
    <motion.div
      ref={ref}
      className={cn('relative group', className)}
      style={{
        perspective: effectiveTilt ? 1000 : undefined,
        transformStyle: effectiveTilt ? 'preserve-3d' : undefined,
      }}
      onMouseMove={handleMouseMove}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      onClick={onClick}
    >
      <motion.div
        className={cn(
          'relative rounded-2xl border overflow-hidden transition-all duration-300 backdrop-blur-md',
          variantStyles[variant],
          hoverBorderStyles[variant],
          enableBorder && 'border',
          className
        )}
        style={{
          rotateX: effectiveTilt ? rotateX : 0,
          rotateY: effectiveTilt ? rotateY : 0,
          transformStyle: effectiveTilt ? 'preserve-3d' : undefined,
        }}
      >
        {/* Glow effect that follows cursor */}
        {effectiveGlow && (
          <motion.div
            className="absolute inset-0 pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity duration-300"
            style={{
              background: `radial-gradient(400px circle at ${shineX.get()}px ${shineY.get()}px, ${glowColor}, transparent 60%)`,
            }}
          />
        )}
        
        {/* Shine effect - sweeping gradient */}
        {effectiveShine && isHovered && (
          <motion.div
            className="absolute inset-0 pointer-events-none z-20"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            style={{
              background: `radial-gradient(300px circle at ${shineX.get()}px ${shineY.get()}px, rgba(255,255,255,0.1), transparent 50%)`,
              mixBlendMode: 'overlay',
            }}
          />
        )}
        
        {/* Border glow on hover */}
        {enableBorder && (
          <div 
            className="absolute inset-0 rounded-2xl pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity duration-500"
            style={{
              boxShadow: `inset 0 0 0 1px ${glowColor.replace('0.4', '0.3')}, 0 0 20px ${glowColor}`,
            }}
          />
        )}

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

// Cosmic card preset for enhanced visual effects
export function CosmicCard({
  children,
  className
}: {
  children: ReactNode;
  className?: string;
}) {
  return (
    <GlowCard
      variant="cosmic"
      enableTilt={true}
      tiltIntensity={8}
      enableGlow={true}
      glowColor="rgba(168, 85, 247, 0.5)"
      enableBorder={true}
      enableShine={true}
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
