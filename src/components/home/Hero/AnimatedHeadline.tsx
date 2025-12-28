'use client';

import { motion } from 'framer-motion';
import { memo } from 'react';

/**
 * Animated headline with gradient text effect
 * Memoized to prevent unnecessary re-renders
 */
export const AnimatedHeadline = memo(function AnimatedHeadline() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.8, delay: 0.3 }}
      className="mb-8"
    >
      <h1 className="font-display font-black text-5xl sm:text-6xl md:text-7xl lg:text-8xl leading-[0.9] tracking-tight">
        <motion.span
          className="block text-white mb-2"
          initial={{ opacity: 0, x: -30 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6, delay: 0.4 }}
        >
          Собери свой
        </motion.span>
        <motion.span
          className="relative block"
          initial={{ opacity: 0, x: -30 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6, delay: 0.5 }}
        >
          {/* Animated gradient text */}
          <motion.span
            className="bg-gradient-to-r from-purple-400 via-pink-400 to-purple-400 bg-clip-text text-transparent bg-[length:200%_auto] will-change-transform"
            animate={{
              backgroundPosition: ['0% center', '200% center'],
            }}
            transition={{
              duration: 3,
              repeat: Infinity,
              ease: 'linear',
            }}
          >
            идеальный ПК
          </motion.span>

          {/* Underline glow effect */}
          <motion.div
            className="absolute -bottom-2 left-0 h-1 rounded-full bg-gradient-to-r from-purple-500 via-pink-500 to-purple-500"
            initial={{ width: 0 }}
            animate={{ width: '100%' }}
            transition={{ duration: 1, delay: 1 }}
            style={{
              boxShadow: '0 0 20px rgba(139,92,246,0.5), 0 0 40px rgba(255,30,142,0.3)',
            }}
          />
        </motion.span>
      </h1>
    </motion.div>
  );
});
