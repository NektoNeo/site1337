'use client';

import { motion } from 'framer-motion';
import { memo, useCallback } from 'react';

/**
 * Scroll indicator at the bottom of the hero section
 * Memoized to prevent unnecessary re-renders
 */
export const ScrollIndicator = memo(function ScrollIndicator() {
  const handleClick = useCallback(() => {
    window.scrollBy({ top: window.innerHeight, behavior: 'smooth' });
  }, []);

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ delay: 2 }}
      className="absolute bottom-8 left-1/2 -translate-x-1/2 z-20"
    >
      <motion.div
        className="flex flex-col items-center gap-2 cursor-pointer group"
        animate={{ y: [0, 8, 0] }}
        transition={{ duration: 2, repeat: Infinity }}
        onClick={handleClick}
      >
        <span className="text-xs text-white/40 group-hover:text-white/60 transition-colors">
          Scroll
        </span>
        <div className="w-6 h-10 rounded-full border-2 border-white/20 flex justify-center pt-2 group-hover:border-purple-500/50 transition-colors">
          <motion.div
            className="w-1.5 h-3 rounded-full bg-gradient-to-b from-purple-400 to-cyan-400"
            animate={{ y: [0, 8, 0], opacity: [1, 0.3, 1] }}
            transition={{ duration: 2, repeat: Infinity }}
          />
        </div>
      </motion.div>
    </motion.div>
  );
});
