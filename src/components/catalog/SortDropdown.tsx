'use client';

import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronDown, Check } from 'lucide-react';
import { SortOption } from '@/types/product';
import { sortOptions } from '@/lib/mock-data';
import { cn } from '@/lib/cn';

interface SortDropdownProps {
  value: SortOption;
  onChange: (value: SortOption) => void;
}

export function SortDropdown({ value, onChange }: SortDropdownProps) {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const selectedOption = sortOptions.find((opt) => opt.value === value);

  // Close on outside click
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <div ref={dropdownRef} className="relative">
      {/* Trigger button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className={cn(
          'flex items-center gap-3 px-4 py-2.5 rounded-xl',
          'bg-void-300 border border-neon-purple-500/20',
          'hover:border-neon-purple-500/40 hover:bg-void-400',
          'transition-all duration-200',
          isOpen && 'border-neon-purple-400/50 bg-void-400'
        )}
      >
        <span className="text-sm text-white/60">Сортировка:</span>
        <span className="text-sm font-medium text-white">{selectedOption?.label}</span>
        <motion.div
          animate={{ rotate: isOpen ? 180 : 0 }}
          transition={{ duration: 0.2 }}
        >
          <ChevronDown className="w-4 h-4 text-neon-purple-400" />
        </motion.div>
      </button>

      {/* Dropdown menu */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: -10, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -10, scale: 0.95 }}
            transition={{ duration: 0.15 }}
            className="absolute right-0 mt-2 w-56 z-50"
          >
            {/* Glass background */}
            <div className="glass-panel rounded-xl overflow-hidden py-2">
              {sortOptions.map((option) => {
                const isSelected = option.value === value;
                return (
                  <button
                    key={option.value}
                    onClick={() => {
                      onChange(option.value as SortOption);
                      setIsOpen(false);
                    }}
                    className={cn(
                      'w-full flex items-center justify-between px-4 py-2.5',
                      'text-sm transition-colors duration-150',
                      isSelected
                        ? 'bg-neon-purple-500/20 text-neon-purple-300'
                        : 'text-white/70 hover:bg-white/5 hover:text-white'
                    )}
                  >
                    <span>{option.label}</span>
                    {isSelected && (
                      <motion.div
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        transition={{ type: 'spring', stiffness: 500 }}
                      >
                        <Check className="w-4 h-4 text-neon-purple-400" />
                      </motion.div>
                    )}
                  </button>
                );
              })}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
