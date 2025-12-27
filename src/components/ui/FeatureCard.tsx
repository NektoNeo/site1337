'use client';

import { motion } from 'framer-motion';
import { ReactNode } from 'react';

interface FeatureCardProps {
  icon: ReactNode;
  title: string;
  description: string;
  index?: number;
}

export function FeatureCard({ icon, title, description, index = 0 }: FeatureCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-30px' }}
      transition={{ 
        duration: 0.5, 
        delay: index * 0.1,
        ease: [0.25, 0.46, 0.45, 0.94]
      }}
      className="group relative"
    >
      <div className="relative p-6 rounded-2xl bg-white/[0.02] border border-white/[0.06] hover:border-purple-500/30 transition-all duration-500 hover:bg-white/[0.04]">
        {/* Glow effect on hover */}
        <div className="absolute inset-0 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none">
          <div className="absolute inset-0 rounded-2xl bg-gradient-to-b from-purple-500/10 to-transparent" />
        </div>
        
        {/* Icon container with pulse effect */}
        <div className="relative mb-4">
          <motion.div
            className="w-14 h-14 rounded-xl bg-gradient-to-br from-purple-600/20 to-cyan-600/20 border border-purple-500/20
              flex items-center justify-center text-purple-400 group-hover:text-purple-300 transition-colors duration-300"
            whileHover={{ scale: 1.1, rotate: 5 }}
            transition={{ type: 'spring', stiffness: 300, damping: 15 }}
          >
            {icon}
          </motion.div>
          
          {/* Pulse ring */}
          <div className="absolute inset-0 w-14 h-14 rounded-xl border border-purple-500/30 opacity-0 group-hover:opacity-100 group-hover:animate-ping pointer-events-none" 
            style={{ animationDuration: '2s' }}
          />
        </div>
        
        {/* Content */}
        <h3 className="font-display font-semibold text-lg text-white mb-2 group-hover:text-purple-200 transition-colors duration-300">
          {title}
        </h3>
        <p className="text-white/50 text-sm leading-relaxed group-hover:text-white/60 transition-colors duration-300">
          {description}
        </p>
      </div>
    </motion.div>
  );
}
