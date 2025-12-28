'use client';

import { motion } from 'framer-motion';
import { memo } from 'react';

/**
 * Subheadline with RTX highlights
 * Memoized to prevent unnecessary re-renders
 */
export const SubHeadline = memo(function SubHeadline() {
  return (
    <motion.p
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.7, delay: 0.6 }}
      className="text-lg md:text-xl lg:text-2xl text-white/60 mb-10 max-w-2xl leading-relaxed"
    >
      Мощные игровые компьютеры с видеокартами{' '}
      <span className="text-transparent bg-clip-text bg-gradient-to-r from-green-400 to-cyan-400 font-bold">
        RTX 4070/4080/4090
      </span>
      .{' '}
      <motion.span
        className="inline-flex items-center gap-1 text-cyan-400 font-semibold"
        whileHover={{ scale: 1.05 }}
      >
        <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
          <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
        </svg>
        Гарантия 12+ месяцев
      </motion.span>
      , полная настройка и активация Windows.
    </motion.p>
  );
});
