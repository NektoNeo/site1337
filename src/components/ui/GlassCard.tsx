'use client';

import { motion, HTMLMotionProps } from 'framer-motion';
import { ReactNode } from 'react';
import { cn } from '@/lib/utils';

interface GlassCardProps extends Omit<HTMLMotionProps<'div'>, 'children'> {
  children: ReactNode;
  className?: string;
  /** Enable UV glow effect on hover */
  glow?: boolean;
  /** Enable hover lift animation */
  hoverable?: boolean;
  /** Padding preset */
  padding?: 'none' | 'sm' | 'md' | 'lg';
  /** Glass intensity level */
  intensity?: 'light' | 'medium' | 'strong';
  /** Use fuchsia glow instead of purple */
  fuchsiaGlow?: boolean;
}

const paddingStyles = {
  none: '',
  sm: 'p-4',
  md: 'p-6',
  lg: 'p-8',
};

const intensityStyles = {
  light: 'bg-[var(--glass-bg)] backdrop-blur-sm border-[var(--glass-border)]',
  medium: 'bg-[var(--color-bg-card)] backdrop-blur-md border-[var(--glass-border)]',
  strong: 'bg-[var(--color-bg-elevated)] backdrop-blur-lg border-[var(--color-border-glow)]',
};

/**
 * GlassCard Component
 *
 * A unified glass-morphism card component with optional UV glow effects.
 * Uses CSS variables from the design system for consistent theming.
 *
 * @example
 * ```tsx
 * // Basic card
 * <GlassCard padding="md">Content</GlassCard>
 *
 * // With glow and hover
 * <GlassCard glow hoverable padding="lg">Premium Content</GlassCard>
 *
 * // Fuchsia glow variant
 * <GlassCard glow fuchsiaGlow padding="md">Special Content</GlassCard>
 * ```
 */
export function GlassCard({
  children,
  className = '',
  glow = false,
  hoverable = false,
  padding = 'md',
  intensity = 'medium',
  fuchsiaGlow = false,
  ...props
}: GlassCardProps) {
  const glowClass = glow
    ? fuchsiaGlow
      ? 'uv-glow-fuchsia'
      : 'uv-glow'
    : '';

  const hoverClass = hoverable
    ? 'hover:border-[var(--color-border-glow)] hover:shadow-[0_18px_40px_rgba(0,0,0,0.45)]'
    : '';

  return (
    <motion.div
      className={cn(
        // Base styles
        'relative rounded-2xl border overflow-hidden',
        'transition-all duration-300',
        // Intensity
        intensityStyles[intensity],
        // Padding
        paddingStyles[padding],
        // Optional effects
        glowClass,
        hoverClass,
        className
      )}
      whileHover={hoverable ? { y: -4 } : undefined}
      {...props}
    >
      <div className="relative z-10">
        {children}
      </div>
    </motion.div>
  );
}

/**
 * GlassCardHeader - Header section for GlassCard
 */
export function GlassCardHeader({
  children,
  className,
}: {
  children: ReactNode;
  className?: string;
}) {
  return (
    <div className={cn('mb-4', className)}>
      {children}
    </div>
  );
}

/**
 * GlassCardTitle - Title text for GlassCard
 */
export function GlassCardTitle({
  children,
  className,
}: {
  children: ReactNode;
  className?: string;
}) {
  return (
    <h3 className={cn('text-lg font-semibold text-[var(--color-text-primary)]', className)}>
      {children}
    </h3>
  );
}

/**
 * GlassCardDescription - Description text for GlassCard
 */
export function GlassCardDescription({
  children,
  className,
}: {
  children: ReactNode;
  className?: string;
}) {
  return (
    <p className={cn('text-sm text-[var(--color-text-secondary)]', className)}>
      {children}
    </p>
  );
}

/**
 * GlassCardContent - Main content area for GlassCard
 */
export function GlassCardContent({
  children,
  className,
}: {
  children: ReactNode;
  className?: string;
}) {
  return (
    <div className={cn('', className)}>
      {children}
    </div>
  );
}

/**
 * GlassCardFooter - Footer section for GlassCard
 */
export function GlassCardFooter({
  children,
  className,
}: {
  children: ReactNode;
  className?: string;
}) {
  return (
    <div className={cn('mt-4 flex items-center', className)}>
      {children}
    </div>
  );
}
