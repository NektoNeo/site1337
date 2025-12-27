'use client';

import { motion, HTMLMotionProps } from 'framer-motion';
import { ReactNode } from 'react';

interface GlassCardProps extends Omit<HTMLMotionProps<'div'>, 'children'> {
  children: ReactNode;
  className?: string;
  hoverGlow?: 'purple' | 'cyan' | 'mixed';
  intensity?: 'light' | 'medium' | 'strong';
}

export function GlassCard({ 
  children, 
  className = '', 
  hoverGlow = 'purple',
  intensity = 'medium',
  ...props 
}: GlassCardProps) {
  const intensityStyles = {
    light: 'bg-white/[0.02] backdrop-blur-sm border-white/[0.05]',
    medium: 'bg-white/[0.03] backdrop-blur-md border-white/[0.08]',
    strong: 'bg-white/[0.06] backdrop-blur-xl border-white/[0.12]',
  };
  
  const glowColors = {
    purple: 'hover:shadow-[0_0_30px_rgba(139,92,246,0.3),0_0_60px_rgba(139,92,246,0.15)]',
    cyan: 'hover:shadow-[0_0_30px_rgba(6,182,212,0.3),0_0_60px_rgba(6,182,212,0.15)]',
    mixed: 'hover:shadow-[0_0_30px_rgba(139,92,246,0.25),0_0_60px_rgba(6,182,212,0.15)]',
  };
  
  const borderGlow = {
    purple: 'hover:border-purple-500/30',
    cyan: 'hover:border-cyan-400/30',
    mixed: 'hover:border-purple-400/20',
  };

  return (
    <motion.div
      className={`
        relative rounded-2xl border overflow-hidden
        ${intensityStyles[intensity]}
        ${glowColors[hoverGlow]}
        ${borderGlow[hoverGlow]}
        transition-all duration-500
        ${className}
      `}
      whileHover={{ scale: 1.02 }}
      transition={{ type: 'spring', stiffness: 300, damping: 20 }}
      {...props}
    >
      {/* Inner glow effect */}
      <div className="absolute inset-0 opacity-0 hover:opacity-100 transition-opacity duration-500 pointer-events-none">
        <div 
          className="absolute inset-0"
          style={{
            background: hoverGlow === 'purple' 
              ? 'radial-gradient(circle at 50% 0%, rgba(139,92,246,0.1) 0%, transparent 50%)'
              : hoverGlow === 'cyan'
              ? 'radial-gradient(circle at 50% 0%, rgba(6,182,212,0.1) 0%, transparent 50%)'
              : 'radial-gradient(circle at 50% 0%, rgba(139,92,246,0.08) 0%, transparent 40%), radial-gradient(circle at 50% 100%, rgba(6,182,212,0.08) 0%, transparent 40%)',
          }}
        />
      </div>
      
      {/* Content */}
      <div className="relative z-10">
        {children}
      </div>
    </motion.div>
  );
}
