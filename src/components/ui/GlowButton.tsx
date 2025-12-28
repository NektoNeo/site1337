'use client';

import { motion } from 'framer-motion';
import { ReactNode } from 'react';

interface GlowButtonProps {
  children: ReactNode;
  variant?: 'primary' | 'secondary' | 'outline';
  size?: 'sm' | 'md' | 'lg';
  className?: string;
  onClick?: () => void;
  href?: string;
}

export function GlowButton({
  children,
  variant = 'primary',
  size = 'md',
  className = '',
  onClick,
  href,
}: GlowButtonProps) {
  const sizeStyles = {
    sm: 'px-4 py-2 text-sm',
    md: 'px-6 py-3 text-base',
    lg: 'px-8 py-4 text-lg',
  };
  
  const variantStyles = {
    primary: `
      bg-gradient-to-r from-purple-600 to-purple-500
      hover:from-purple-500 hover:to-purple-400
      text-white font-semibold
      shadow-[0_0_20px_rgba(139,92,246,0.4)]
      hover:shadow-[0_0_30px_rgba(139,92,246,0.6),0_0_60px_rgba(139,92,246,0.3)]
    `,
    secondary: `
      bg-gradient-to-r from-magenta-600 to-magenta-500
      hover:from-magenta-500 hover:to-magenta-400
      text-white font-semibold
      shadow-[0_0_20px_rgba(6,182,212,0.4)]
      hover:shadow-[0_0_30px_rgba(6,182,212,0.6),0_0_60px_rgba(6,182,212,0.3)]
    `,
    outline: `
      bg-transparent
      border-2 border-purple-500/50
      hover:border-purple-400
      text-purple-400 hover:text-purple-300
      hover:shadow-[0_0_20px_rgba(139,92,246,0.3)]
    `,
  };

  const ButtonContent = (
    <motion.span
      className={`
        relative inline-flex items-center justify-center gap-2
        rounded-xl font-display tracking-wide
        transition-all duration-300 cursor-pointer
        ${sizeStyles[size]}
        ${variantStyles[variant]}
        ${className}
      `}
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.98 }}
      transition={{ type: 'spring', stiffness: 400, damping: 17 }}
    >
      {/* Animated border gradient for primary/secondary */}
      {variant !== 'outline' && (
        <motion.span
          className="absolute inset-0 rounded-xl opacity-0 hover:opacity-100 transition-opacity duration-300"
          style={{
            background: variant === 'primary'
              ? 'linear-gradient(90deg, transparent, rgba(255,255,255,0.1), transparent)'
              : 'linear-gradient(90deg, transparent, rgba(255,255,255,0.1), transparent)',
            backgroundSize: '200% 100%',
          }}
          animate={{
            backgroundPosition: ['200% 0', '-200% 0'],
          }}
          transition={{
            duration: 1.5,
            repeat: Infinity,
            ease: 'linear',
          }}
        />
      )}
      
      <span className="relative z-10">{children}</span>
    </motion.span>
  );

  if (href) {
    return (
      <a href={href} target={href.startsWith('http') ? '_blank' : undefined} rel="noopener noreferrer">
        {ButtonContent}
      </a>
    );
  }

  return (
    <button onClick={onClick} type="button">
      {ButtonContent}
    </button>
  );
}
