'use client';

import { motion, useMotionValue, useSpring, useTransform } from 'framer-motion';
import { useRef, useState, ReactNode } from 'react';
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
  tiltIntensity = 8,
  enableGlow = true,
  glowColor,
  enableBorder = true,
  enableShine = true,
  enableParticles = false,
  onClick,
}: GlowCardProps) {
  const ref = useRef<HTMLDivElement>(null);
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

  // Glow position based on mouse
  const glowX = useTransform(mouseX, (value) => `${value}px`);
  const glowY = useTransform(mouseY, (value) => `${value}px`);

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!ref.current) return;

    const rect = ref.current.getBoundingClientRect();
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;

    // For tilt effect
    const normalizedX = (e.clientX - centerX) / (rect.width / 2);
    const normalizedY = (e.clientY - centerY) / (rect.height / 2);

    if (enableTilt) {
      x.set(normalizedX * 0.5);
      y.set(normalizedY * 0.5);
    }

    // For glow following
    mouseX.set(e.clientX - rect.left);
    mouseY.set(e.clientY - rect.top);
  };

  const handleMouseLeave = () => {
    x.set(0);
    y.set(0);
    setIsHovered(false);
  };

  const variantStyles = {
    default: {
      base: 'bg-white/[0.03] border-white/[0.08]',
      glow: 'rgba(139, 92, 246, 0.4)',
      glowDim: 'rgba(139, 92, 246, 0.15)',
      glowBright: 'rgba(139, 92, 246, 0.8)',
      borderGradient: 'rgba(139, 92, 246, 0.5), rgba(6, 182, 212, 0.5), rgba(139, 92, 246, 0.5)',
    },
    premium: {
      base: 'bg-gradient-to-br from-purple-900/20 via-black/40 to-cyan-900/20 border-purple-500/20',
      glow: 'rgba(139, 92, 246, 0.6)',
      glowDim: 'rgba(139, 92, 246, 0.15)',
      glowBright: 'rgba(139, 92, 246, 0.8)',
      borderGradient: 'rgba(139, 92, 246, 1), rgba(236, 72, 153, 1), rgba(6, 182, 212, 1)',
    },
    cyber: {
      base: 'bg-black/60 border-cyan-500/30',
      glow: 'rgba(6, 182, 212, 0.5)',
      glowDim: 'rgba(6, 182, 212, 0.15)',
      glowBright: 'rgba(6, 182, 212, 0.8)',
      borderGradient: 'rgba(34, 211, 238, 1), rgba(139, 92, 246, 1), rgba(34, 211, 238, 1)',
    },
  };

  const currentVariant = variantStyles[variant];
  const currentGlowColor = glowColor || currentVariant.glow;

  return (
    <motion.div
      ref={ref}
      className={cn('relative group', className)}
      style={{
        perspective: 1000,
        transformStyle: 'preserve-3d',
      }}
      onMouseMove={handleMouseMove}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={handleMouseLeave}
      onClick={onClick}
    >
      {/* Animated gradient border */}
      {enableBorder && (
        <motion.div
          className="absolute -inset-[1px] rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500 -z-10"
          style={{
            background: `linear-gradient(135deg, ${currentVariant.borderGradient})`,
            backgroundSize: '200% 200%',
          }}
          animate={isHovered ? {
            backgroundPosition: ['0% 0%', '100% 100%', '0% 0%'],
          } : {}}
          transition={{
            duration: 3,
            repeat: Infinity,
            ease: 'linear',
          }}
        />
      )}

      {/* Glow effect following mouse */}
      {enableGlow && isHovered && (
        <motion.div
          className="absolute inset-0 rounded-2xl pointer-events-none -z-10"
          style={{
            background: `radial-gradient(circle 200px at ${glowX} ${glowY}, ${currentGlowColor}, transparent 70%)`,
          }}
        />
      )}

      {/* Main card container with 3D effect */}
      <motion.div
        className={cn(
          'relative rounded-2xl border backdrop-blur-xl overflow-hidden transition-all duration-300',
          currentVariant.base,
          'hover:shadow-[0_0_40px_rgba(139,92,246,0.2),0_0_80px_rgba(6,182,212,0.1)]'
        )}
        style={{
          rotateX: enableTilt ? rotateX : 0,
          rotateY: enableTilt ? rotateY : 0,
          transformStyle: 'preserve-3d',
        }}
      >
        {/* Top inner glow */}
        <div
          className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none"
          style={{
            background: `radial-gradient(ellipse 80% 50% at 50% 0%, ${currentVariant.glowDim}, transparent 70%)`,
          }}
        />

        {/* Shine sweep effect */}
        {enableShine && (
          <motion.div
            className="absolute inset-0 pointer-events-none z-20"
            style={{
              background: 'linear-gradient(105deg, transparent 40%, rgba(255,255,255,0.15) 50%, transparent 60%)',
            }}
            initial={{ x: '-100%' }}
            animate={isHovered ? { x: '200%' } : { x: '-100%' }}
            transition={{ duration: 0.8, ease: 'easeInOut' }}
          />
        )}

        {/* Holographic scanlines */}
        <div className="absolute inset-0 pointer-events-none opacity-[0.03] group-hover:opacity-[0.05] transition-opacity">
          <div
            className="w-full h-full"
            style={{
              backgroundImage: 'repeating-linear-gradient(0deg, transparent, transparent 2px, rgba(255,255,255,0.1) 2px, rgba(255,255,255,0.1) 4px)',
            }}
          />
        </div>

        {/* Content */}
        <div className="relative z-10">
          {children}
        </div>

        {/* Bottom reflection glow */}
        <motion.div
          className="absolute bottom-0 left-0 right-0 h-px opacity-50 group-hover:opacity-100 transition-opacity"
          style={{
            background: `linear-gradient(90deg, transparent, ${currentVariant.glowBright}, transparent)`,
          }}
        />
      </motion.div>

      {/* Floating particles on hover */}
      {enableParticles && isHovered && (
        <div className="absolute inset-0 pointer-events-none overflow-hidden rounded-2xl">
          {[...Array(6)].map((_, i) => (
            <motion.div
              key={i}
              className="absolute w-1 h-1 rounded-full"
              style={{
                left: `${15 + (i % 3) * 30}%`,
                top: `${20 + Math.floor(i / 3) * 50}%`,
                background: i % 2 === 0 ? '#8B5CF6' : '#06B6D4',
                boxShadow: i % 2 === 0
                  ? '0 0 8px #8B5CF6, 0 0 16px #8B5CF6'
                  : '0 0 8px #06B6D4, 0 0 16px #06B6D4',
              }}
              animate={{
                y: [0, -20, 0],
                opacity: [0, 1, 0],
                scale: [0.5, 1.2, 0.5],
              }}
              transition={{
                duration: 1.5,
                repeat: Infinity,
                delay: i * 0.2,
                ease: 'easeOut',
              }}
            />
          ))}
        </div>
      )}

      {/* Corner accents */}
      <div className="absolute top-0 left-0 w-8 h-8 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none">
        <div className="absolute top-0 left-0 w-full h-[2px] bg-gradient-to-r from-purple-500 to-transparent" />
        <div className="absolute top-0 left-0 w-[2px] h-full bg-gradient-to-b from-purple-500 to-transparent" />
      </div>
      <div className="absolute top-0 right-0 w-8 h-8 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none">
        <div className="absolute top-0 right-0 w-full h-[2px] bg-gradient-to-l from-cyan-500 to-transparent" />
        <div className="absolute top-0 right-0 w-[2px] h-full bg-gradient-to-b from-cyan-500 to-transparent" />
      </div>
      <div className="absolute bottom-0 left-0 w-8 h-8 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none">
        <div className="absolute bottom-0 left-0 w-full h-[2px] bg-gradient-to-r from-cyan-500 to-transparent" />
        <div className="absolute bottom-0 left-0 w-[2px] h-full bg-gradient-to-t from-cyan-500 to-transparent" />
      </div>
      <div className="absolute bottom-0 right-0 w-8 h-8 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none">
        <div className="absolute bottom-0 right-0 w-full h-[2px] bg-gradient-to-l from-purple-500 to-transparent" />
        <div className="absolute bottom-0 right-0 w-[2px] h-full bg-gradient-to-t from-purple-500 to-transparent" />
      </div>
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
