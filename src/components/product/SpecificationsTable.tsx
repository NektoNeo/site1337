'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ProductSpecCategory } from '@/types/product';

interface SpecificationsTableProps {
  specifications: ProductSpecCategory[];
}

// Category icons mapping
const CategoryIcons: Record<string, JSX.Element> = {
  processor: (
    <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
      <rect x="4" y="4" width="16" height="16" rx="2" />
      <rect x="9" y="9" width="6" height="6" />
      <path d="M9 1v3M15 1v3M9 20v3M15 20v3M1 9h3M1 15h3M20 9h3M20 15h3" />
    </svg>
  ),
  graphics: (
    <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
      <rect x="2" y="6" width="20" height="12" rx="2" />
      <circle cx="7" cy="12" r="2" />
      <circle cx="12" cy="12" r="2" />
      <circle cx="17" cy="12" r="2" />
    </svg>
  ),
  memory: (
    <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
      <rect x="2" y="8" width="20" height="8" rx="1" />
      <path d="M6 8V6M10 8V6M14 8V6M18 8V6M6 16v2M10 16v2M14 16v2M18 16v2" />
    </svg>
  ),
  storage: (
    <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
      <rect x="3" y="3" width="18" height="18" rx="2" />
      <circle cx="12" cy="12" r="4" />
      <circle cx="12" cy="12" r="1" />
    </svg>
  ),
  motherboard: (
    <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
      <rect x="3" y="3" width="18" height="18" rx="2" />
      <rect x="7" y="7" width="4" height="4" />
      <rect x="13" y="7" width="4" height="4" />
      <rect x="7" y="13" width="10" height="4" />
    </svg>
  ),
  power: (
    <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
      <path d="M13 2L3 14h9l-1 8 10-12h-9l1-8z" />
    </svg>
  ),
  case: (
    <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
      <rect x="4" y="2" width="16" height="20" rx="2" />
      <circle cx="12" cy="8" r="3" />
      <line x1="8" y1="14" x2="16" y2="14" />
      <line x1="8" y1="17" x2="16" y2="17" />
    </svg>
  ),
  software: (
    <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
      <rect x="2" y="3" width="20" height="14" rx="2" />
      <path d="M8 21h8M12 17v4" />
      <path d="M7 8l3 3-3 3M12 14h4" />
    </svg>
  ),
  cooling: (
    <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
      <circle cx="12" cy="12" r="9" />
      <circle cx="12" cy="12" r="3" />
      <path d="M12 3v6M12 15v6M3 12h6M15 12h6" />
    </svg>
  ),
};

function getCategoryIcon(category: string): JSX.Element {
  const lowerCategory = category.toLowerCase();
  for (const [key, icon] of Object.entries(CategoryIcons)) {
    if (lowerCategory.includes(key)) {
      return icon;
    }
  }
  // Default icon
  return (
    <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
      <circle cx="12" cy="12" r="10" />
      <path d="M12 16v-4M12 8h.01" />
    </svg>
  );
}

function SpecCategory({ category, isOpen, onToggle }: {
  category: ProductSpecCategory;
  isOpen: boolean;
  onToggle: () => void;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="border border-gray-800 rounded-xl overflow-hidden hover:border-purple-500/30 transition-colors"
    >
      {/* Category Header */}
      <button
        onClick={onToggle}
        className="w-full flex items-center justify-between p-4 bg-gradient-to-r from-gray-900/80 to-gray-800/50 hover:from-gray-800/80 hover:to-gray-700/50 transition-colors"
      >
        <div className="flex items-center gap-3">
          <span className="text-cyan-400">
            {getCategoryIcon(category.category)}
          </span>
          <span className="font-orbitron font-semibold text-white uppercase tracking-wider text-sm">
            {category.category}
          </span>
          <span className="text-xs text-gray-500 bg-gray-800 px-2 py-0.5 rounded-full">
            {category.specs.length} specs
          </span>
        </div>
        <motion.div
          animate={{ rotate: isOpen ? 180 : 0 }}
          transition={{ duration: 0.2 }}
        >
          <svg className="w-5 h-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
          </svg>
        </motion.div>
      </button>

      {/* Specs List */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3 }}
          >
            <div className="bg-black/40 divide-y divide-gray-800/50">
              {category.specs.map((spec, index) => (
                <motion.div
                  key={spec.label}
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.05 }}
                  className="flex items-center justify-between px-4 py-3 hover:bg-purple-500/5 transition-colors group"
                >
                  <span className="text-gray-400 text-sm group-hover:text-gray-300 transition-colors">
                    {spec.label}
                  </span>
                  <span className="text-white text-sm font-medium text-right max-w-[60%]">
                    {spec.value}
                  </span>
                </motion.div>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}

export function SpecificationsTable({ specifications }: SpecificationsTableProps) {
  const [openCategories, setOpenCategories] = useState<Set<string>>(
    new Set(specifications.map(s => s.category)) // All open by default
  );

  const toggleCategory = (category: string) => {
    setOpenCategories((prev) => {
      const next = new Set(prev);
      if (next.has(category)) {
        next.delete(category);
      } else {
        next.add(category);
      }
      return next;
    });
  };

  const expandAll = () => {
    setOpenCategories(new Set(specifications.map(s => s.category)));
  };

  const collapseAll = () => {
    setOpenCategories(new Set());
  };

  return (
    <motion.section
      initial={{ opacity: 0, y: 40 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, delay: 0.3 }}
      className="mt-16"
    >
      {/* Section Header */}
      <div className="flex items-center justify-between mb-8">
        <div className="flex items-center gap-4">
          <div className="w-1 h-8 bg-gradient-to-b from-purple-500 to-cyan-400 rounded-full" />
          <h2 className="font-orbitron text-2xl md:text-3xl font-bold text-white uppercase tracking-wider">
            Full Specifications
          </h2>
        </div>

        <div className="flex gap-2">
          <button
            onClick={expandAll}
            className="text-xs text-gray-400 hover:text-cyan-400 transition-colors px-3 py-1.5 rounded-lg border border-gray-700 hover:border-cyan-400/50"
          >
            Expand All
          </button>
          <button
            onClick={collapseAll}
            className="text-xs text-gray-400 hover:text-purple-400 transition-colors px-3 py-1.5 rounded-lg border border-gray-700 hover:border-purple-400/50"
          >
            Collapse All
          </button>
        </div>
      </div>

      {/* Specifications Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {specifications.map((category, index) => (
          <motion.div
            key={category.category}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
          >
            <SpecCategory
              category={category}
              isOpen={openCategories.has(category.category)}
              onToggle={() => toggleCategory(category.category)}
            />
          </motion.div>
        ))}
      </div>

      {/* Download Specs PDF Button */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.6 }}
        className="mt-8 flex justify-center"
      >
        <button className="group flex items-center gap-3 px-6 py-3 rounded-xl border border-gray-700 hover:border-purple-500/50 bg-gray-900/50 hover:bg-purple-500/10 transition-all">
          <svg className="w-5 h-5 text-gray-400 group-hover:text-purple-400 transition-colors" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5M16.5 12L12 16.5m0 0L7.5 12m4.5 4.5V3" />
          </svg>
          <span className="text-gray-300 group-hover:text-white transition-colors text-sm font-medium">
            Download Full Specs (PDF)
          </span>
        </button>
      </motion.div>
    </motion.section>
  );
}
