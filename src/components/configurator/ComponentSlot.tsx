'use client';

import { motion } from 'motion/react';
import { 
  Cpu, 
  CircuitBoard, 
  Monitor, 
  MemoryStick, 
  HardDrive, 
  Zap, 
  Box, 
  Fan,
  Plus,
  Check,
  AlertTriangle
} from 'lucide-react';
import { ComponentCategory, PCComponent, CATEGORY_LABELS } from './types';
import { formatPrice } from './data';

interface ComponentSlotProps {
  category: ComponentCategory;
  selected: PCComponent | null;
  onSelect: () => void;
  compatibilityStatus?: 'compatible' | 'warning' | 'error' | 'none';
}

const CATEGORY_ICONS: Record<ComponentCategory, React.ReactNode> = {
  cpu: <Cpu className="w-5 h-5" />,
  motherboard: <CircuitBoard className="w-5 h-5" />,
  gpu: <Monitor className="w-5 h-5" />,
  ram: <MemoryStick className="w-5 h-5" />,
  storage: <HardDrive className="w-5 h-5" />,
  psu: <Zap className="w-5 h-5" />,
  case: <Box className="w-5 h-5" />,
  cooling: <Fan className="w-5 h-5" />,
};

export function ComponentSlot({ 
  category, 
  selected, 
  onSelect, 
  compatibilityStatus = 'none' 
}: ComponentSlotProps) {
  const hasSelection = !!selected;
  
  const statusColors = {
    compatible: 'border-emerald-500/50 shadow-[0_0_15px_rgba(16,185,129,0.3)]',
    warning: 'border-amber-500/50 shadow-[0_0_15px_rgba(245,158,11,0.3)]',
    error: 'border-red-500/50 shadow-[0_0_15px_rgba(239,68,68,0.3)]',
    none: hasSelection 
      ? 'border-purple-500/40 shadow-[0_0_20px_rgba(139,92,246,0.2)]' 
      : 'border-white/10',
  };

  const glowVariants = {
    idle: {
      boxShadow: hasSelection 
        ? '0 0 20px rgba(139, 92, 246, 0.2), inset 0 0 30px rgba(139, 92, 246, 0.05)'
        : '0 0 0px rgba(139, 92, 246, 0)',
    },
    hover: {
      boxShadow: '0 0 30px rgba(139, 92, 246, 0.4), inset 0 0 40px rgba(139, 92, 246, 0.1)',
    },
  };

  return (
    <motion.button
      onClick={onSelect}
      className={`
        relative w-full p-4 rounded-lg
        bg-black/40 backdrop-blur-xl
        border ${statusColors[compatibilityStatus]}
        transition-colors duration-300
        group cursor-pointer
        overflow-hidden
      `}
      initial="idle"
      whileHover="hover"
      variants={glowVariants}
      whileTap={{ scale: 0.98 }}
    >
      {/* Scan line effect */}
      <motion.div
        className="absolute inset-0 pointer-events-none opacity-0 group-hover:opacity-100"
        initial={{ y: '-100%' }}
        animate={{ y: '100%' }}
        transition={{ 
          duration: 2, 
          repeat: Infinity, 
          ease: 'linear',
          repeatDelay: 1
        }}
      >
        <div className="h-[2px] w-full bg-gradient-to-r from-transparent via-purple-400/50 to-transparent" />
      </motion.div>

      {/* Corner cuts decoration */}
      <div className="absolute top-0 left-0 w-3 h-3 border-l-2 border-t-2 border-purple-500/50" />
      <div className="absolute top-0 right-0 w-3 h-3 border-r-2 border-t-2 border-purple-500/50" />
      <div className="absolute bottom-0 left-0 w-3 h-3 border-l-2 border-b-2 border-purple-500/50" />
      <div className="absolute bottom-0 right-0 w-3 h-3 border-r-2 border-b-2 border-purple-500/50" />

      <div className="flex items-start gap-4">
        {/* Icon container */}
        <div className={`
          relative p-3 rounded-lg
          ${hasSelection 
            ? 'bg-gradient-to-br from-purple-500/20 to-purple-500/20' 
            : 'bg-white/5'}
          border border-white/10
          transition-all duration-300
          group-hover:border-purple-500/30
        `}>
          <motion.div
            className={hasSelection ? 'text-purple-400' : 'text-white/50'}
            animate={hasSelection ? { 
              rotate: [0, 5, -5, 0],
            } : {}}
            transition={{ duration: 0.5 }}
          >
            {CATEGORY_ICONS[category]}
          </motion.div>
          
          {/* Status indicator */}
          {compatibilityStatus !== 'none' && (
            <div className={`
              absolute -top-1 -right-1 w-4 h-4 rounded-full
              flex items-center justify-center
              ${compatibilityStatus === 'compatible' ? 'bg-emerald-500' : ''}
              ${compatibilityStatus === 'warning' ? 'bg-amber-500' : ''}
              ${compatibilityStatus === 'error' ? 'bg-red-500' : ''}
            `}>
              {compatibilityStatus === 'compatible' && <Check className="w-3 h-3 text-white" />}
              {compatibilityStatus === 'warning' && <AlertTriangle className="w-2.5 h-2.5 text-white" />}
              {compatibilityStatus === 'error' && <AlertTriangle className="w-2.5 h-2.5 text-white" />}
            </div>
          )}
        </div>

        {/* Content */}
        <div className="flex-1 text-left min-w-0">
          <div className="flex items-center justify-between mb-1">
            <span className="text-xs font-medium text-white/50 uppercase tracking-wider font-inter">
              {CATEGORY_LABELS[category]}
            </span>
            {category === 'psu' && selected?.specs.wattage && (
              <span className="text-xs text-purple-400 font-mono">
                {selected.specs.wattage}W
              </span>
            )}
            {category === 'gpu' && selected?.specs.powerDraw && (
              <span className="text-xs text-amber-400 font-mono">
                {selected.specs.powerDraw}W TDP
              </span>
            )}
            {category === 'cpu' && selected?.specs.socket && (
              <span className="text-xs text-purple-400 font-mono">
                {selected.specs.socket}
              </span>
            )}
          </div>

          {hasSelection ? (
            <>
              <h4 className="text-sm font-medium text-white truncate group-hover:text-purple-100 transition-colors">
                {selected.name}
              </h4>
              <div className="flex items-center justify-between mt-2">
                <span className="text-xs text-white/40">{selected.brand}</span>
                <span className="text-sm font-semibold text-gradient-purple font-inter">
                  {formatPrice(selected.price)}
                </span>
              </div>
            </>
          ) : (
            <div className="flex items-center gap-2 py-2">
              <Plus className="w-4 h-4 text-white/30 group-hover:text-purple-400 transition-colors" />
              <span className="text-sm text-white/30 group-hover:text-white/60 transition-colors">
                Выбрать компонент
              </span>
            </div>
          )}
        </div>
      </div>

      {/* Hover glow effect */}
      <motion.div
        className="absolute inset-0 bg-gradient-to-r from-purple-500/0 via-purple-500/5 to-purple-500/0 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none"
        initial={false}
      />
    </motion.button>
  );
}
