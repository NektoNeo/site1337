'use client';

import { motion } from 'framer-motion';
import { memo } from 'react';
import { AnimatedCounter } from '@/components/ui/TextReveal';

interface StatItem {
  value: number;
  suffix: string;
  label: string;
}

const stats: StatItem[] = [
  { value: 500, suffix: '+', label: 'собранных ПК' },
  { value: 12, suffix: '+', label: 'месяцев гарантии' },
  { value: 24, suffix: '/7', label: 'поддержка' },
];

/**
 * Animated stats section showing key numbers
 * Memoized to prevent unnecessary re-renders
 */
export const Stats = memo(function Stats() {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.7, delay: 0.9 }}
      className="flex flex-wrap gap-10"
    >
      {stats.map((stat, index) => (
        <motion.div
          key={index}
          className="relative group"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1 + index * 0.1 }}
        >
          {/* Glow on hover */}
          <motion.div
            className="absolute -inset-4 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity duration-300"
            style={{
              background: 'radial-gradient(circle, rgba(139,92,246,0.2), transparent 70%)',
            }}
          />

          <div className="relative">
            <div className="font-display font-black text-4xl md:text-5xl bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
              <AnimatedCounter value={stat.value} suffix={stat.suffix} duration={2} delay={1 + index * 0.2} />
            </div>
            <div className="text-white/50 text-sm mt-1 font-medium">{stat.label}</div>
          </div>
        </motion.div>
      ))}
    </motion.div>
  );
});
