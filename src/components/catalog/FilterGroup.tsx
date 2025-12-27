'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronDown } from 'lucide-react';
import { cn } from '@/lib/cn';

interface FilterOption {
  value: string;
  label: string;
}

interface FilterGroupProps {
  title: string;
  options: FilterOption[];
  selected: string[];
  onChange: (selected: string[]) => void;
  defaultOpen?: boolean;
}

export function FilterGroup({
  title,
  options,
  selected,
  onChange,
  defaultOpen = true,
}: FilterGroupProps) {
  const [isOpen, setIsOpen] = useState(defaultOpen);

  const toggleOption = (value: string) => {
    if (selected.includes(value)) {
      onChange(selected.filter((v) => v !== value));
    } else {
      onChange([...selected, value]);
    }
  };

  return (
    <div className="border-b border-neon-purple-500/20 pb-4">
      {/* Header */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-full flex items-center justify-between py-3 group"
      >
        <span className="font-display text-sm font-semibold uppercase tracking-wider text-white/90 group-hover:text-neon-cyan-400 transition-colors">
          {title}
        </span>
        <motion.div
          animate={{ rotate: isOpen ? 180 : 0 }}
          transition={{ duration: 0.2 }}
        >
          <ChevronDown className="w-4 h-4 text-neon-purple-400 group-hover:text-neon-cyan-400 transition-colors" />
        </motion.div>
      </button>

      {/* Options */}
      <AnimatePresence initial={false}>
        {isOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="overflow-hidden"
          >
            <div className="space-y-2 pt-1">
              {options.map((option) => {
                const isSelected = selected.includes(option.value);
                return (
                  <label
                    key={option.value}
                    className={cn(
                      'flex items-center gap-3 cursor-pointer group/option py-1.5 px-2 rounded-lg transition-all duration-200',
                      isSelected
                        ? 'bg-neon-purple-500/10'
                        : 'hover:bg-white/5'
                    )}
                  >
                    {/* Custom checkbox */}
                    <div
                      className={cn(
                        'relative w-5 h-5 rounded border-2 transition-all duration-300 flex items-center justify-center',
                        isSelected
                          ? 'bg-gradient-to-br from-neon-purple-500 to-neon-cyan-500 border-neon-cyan-400 shadow-neon-cyan'
                          : 'border-neon-purple-500/40 group-hover/option:border-neon-purple-400'
                      )}
                    >
                      <input
                        type="checkbox"
                        checked={isSelected}
                        onChange={() => toggleOption(option.value)}
                        className="absolute inset-0 opacity-0 cursor-pointer"
                      />
                      {isSelected && (
                        <motion.svg
                          initial={{ scale: 0 }}
                          animate={{ scale: 1 }}
                          className="w-3 h-3 text-white"
                          viewBox="0 0 12 12"
                          fill="none"
                        >
                          <path
                            d="M2 6L5 9L10 3"
                            stroke="currentColor"
                            strokeWidth="2"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                          />
                        </motion.svg>
                      )}
                    </div>
                    
                    {/* Label */}
                    <span
                      className={cn(
                        'text-sm font-body transition-colors duration-200',
                        isSelected
                          ? 'text-white'
                          : 'text-white/60 group-hover/option:text-white/90'
                      )}
                    >
                      {option.label}
                    </span>
                  </label>
                );
              })}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
