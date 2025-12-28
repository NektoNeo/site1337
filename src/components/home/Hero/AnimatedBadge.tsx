'use client';

import { motion } from 'framer-motion';
import { memo } from 'react';

/**
 * Animated badge component showing "Premium Gaming PCs NEW 2025"
 * Memoized to prevent unnecessary re-renders
 */
export const AnimatedBadge = memo(function AnimatedBadge() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20, scale: 0.9 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{ duration: 0.6, delay: 0.2 }}
      className="inline-flex items-center gap-3 px-5 py-2.5 rounded-full bg-gradient-to-r from-purple-500/10 to-cyan-500/10 border border-purple-500/30 backdrop-blur-md mb-8"
    >
      <motion.span className="relative flex h-3 w-3">
        <motion.span
          className="absolute inline-flex h-full w-full rounded-full bg-cyan-400"
          animate={{
            scale: [1, 1.5, 1],
            opacity: [1, 0, 1],
          }}
          transition={{ duration: 2, repeat: Infinity }}
        />
        <span className="relative inline-flex rounded-full h-3 w-3 bg-cyan-400 shadow-[0_0_10px_#22D3EE]" />
      </motion.span>
      <span className="text-sm font-semibold bg-gradient-to-r from-purple-300 to-cyan-300 bg-clip-text text-transparent">
        Premium Gaming PCs
      </span>
      <motion.span
        className="px-2 py-0.5 rounded-full bg-purple-500/20 text-xs font-bold text-purple-300"
        animate={{ scale: [1, 1.05, 1] }}
        transition={{ duration: 2, repeat: Infinity }}
      >
        NEW 2025
      </motion.span>
    </motion.div>
  );
});
