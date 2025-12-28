'use client';

import { motion, AnimatePresence } from 'motion/react';
import { Minus, Plus } from 'lucide-react';

interface QuantitySelectorProps {
  quantity: number;
  onIncrease: () => void;
  onDecrease: () => void;
  min?: number;
  max?: number;
  disabled?: boolean;
}

export function QuantitySelector({
  quantity,
  onIncrease,
  onDecrease,
  min = 1,
  max = 99,
  disabled = false,
}: QuantitySelectorProps) {
  const canDecrease = quantity > min && !disabled;
  const canIncrease = quantity < max && !disabled;

  return (
    <div className="flex items-center gap-1">
      {/* Decrease Button */}
      <motion.button
        type="button"
        onClick={onDecrease}
        disabled={!canDecrease}
        className={`
          relative w-8 h-8 rounded-lg
          flex items-center justify-center
          transition-all duration-300
          ${canDecrease
            ? 'bg-white/5 hover:bg-purple-500/20 text-white hover:text-purple-400 hover:shadow-[0_0_15px_rgba(139,92,246,0.3)]'
            : 'bg-white/5 text-white/20 cursor-not-allowed'
          }
          border border-white/10
        `}
        whileHover={canDecrease ? { scale: 1.05 } : undefined}
        whileTap={canDecrease ? { scale: 0.95 } : undefined}
      >
        <Minus className="w-4 h-4" />
        
        {/* Glow effect on hover */}
        {canDecrease && (
          <motion.div
            className="absolute inset-0 rounded-lg opacity-0 group-hover:opacity-100"
            style={{
              background: 'radial-gradient(circle, rgba(139,92,246,0.2) 0%, transparent 70%)',
            }}
          />
        )}
      </motion.button>

      {/* Quantity Display */}
      <div className="relative w-12 h-8 flex items-center justify-center overflow-hidden">
        <AnimatePresence mode="popLayout">
          <motion.span
            key={quantity}
            initial={{ y: -20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: 20, opacity: 0 }}
            transition={{ 
              type: 'spring',
              stiffness: 300,
              damping: 25,
              duration: 0.2 
            }}
            className="absolute font-mono text-lg font-bold text-white tabular-nums"
          >
            {quantity}
          </motion.span>
        </AnimatePresence>
        
        {/* Scan line decoration */}
        <div className="absolute inset-x-0 top-1/2 h-px bg-gradient-to-r from-transparent via-purple-500/20 to-transparent" />
      </div>

      {/* Increase Button */}
      <motion.button
        type="button"
        onClick={onIncrease}
        disabled={!canIncrease}
        className={`
          relative w-8 h-8 rounded-lg
          flex items-center justify-center
          transition-all duration-300
          ${canIncrease
            ? 'bg-white/5 hover:bg-magenta-500/20 text-white hover:text-magenta-400 hover:shadow-[0_0_15px_rgba(6,182,212,0.3)]'
            : 'bg-white/5 text-white/20 cursor-not-allowed'
          }
          border border-white/10
        `}
        whileHover={canIncrease ? { scale: 1.05 } : undefined}
        whileTap={canIncrease ? { scale: 0.95 } : undefined}
      >
        <Plus className="w-4 h-4" />
      </motion.button>
    </div>
  );
}
