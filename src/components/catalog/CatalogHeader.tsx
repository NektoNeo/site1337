'use client';

import { motion } from 'framer-motion';
import Link from 'next/link';
import { Home, ChevronRight, Grid3X3, LayoutGrid, SlidersHorizontal } from 'lucide-react';
import { SortDropdown } from './SortDropdown';
import { SortOption } from '@/types/product';
import { cn } from '@/lib/cn';

interface CatalogHeaderProps {
  productCount: number;
  sort: SortOption;
  onSortChange: (sort: SortOption) => void;
  onOpenFilters?: () => void;
}

export function CatalogHeader({
  productCount,
  sort,
  onSortChange,
  onOpenFilters,
}: CatalogHeaderProps) {
  return (
    <div className="mb-8">
      {/* Breadcrumbs */}
      <nav className="flex items-center gap-2 mb-6">
        <Link
          href="/"
          className="flex items-center gap-1.5 text-white/50 hover:text-neon-cyan-400 transition-colors text-sm"
        >
          <Home className="w-4 h-4" />
          <span>Главная</span>
        </Link>
        
        <ChevronRight className="w-4 h-4 text-neon-purple-500/50" />
        
        <span className="text-sm text-white font-medium">Каталог</span>
      </nav>

      {/* Title row */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-6">
        <div>
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="font-display text-4xl md:text-5xl font-black text-white tracking-tight"
          >
            <span className="text-transparent bg-gradient-to-r from-white via-white to-neon-purple-300 bg-clip-text">
              Каталог
            </span>
            <span className="text-transparent bg-gradient-to-r from-neon-cyan-400 to-neon-purple-500 bg-clip-text ml-3">
              ПК
            </span>
          </motion.h1>
          
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2 }}
            className="text-white/50 mt-2 text-lg"
          >
            Найдено{' '}
            <motion.span
              key={productCount}
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              className="font-mono text-neon-cyan-400 font-semibold"
            >
              {productCount}
            </motion.span>{' '}
            {getProductWord(productCount)}
          </motion.p>
        </div>

        {/* Decorative line */}
        <div className="hidden md:block flex-1 mx-8">
          <div className="h-px bg-gradient-to-r from-neon-purple-500/50 via-neon-cyan-500/30 to-transparent" />
        </div>
      </div>

      {/* Controls row */}
      <div className="flex items-center justify-between gap-4">
        {/* Mobile filter button */}
        <button
          onClick={onOpenFilters}
          className="lg:hidden flex items-center gap-2 px-4 py-2.5 rounded-xl bg-void-300 border border-neon-purple-500/20 text-white/80 hover:border-neon-purple-500/40 transition-colors"
        >
          <SlidersHorizontal className="w-4 h-4 text-neon-purple-400" />
          <span className="text-sm font-medium">Фильтры</span>
        </button>

        {/* View mode toggle (placeholder for future) */}
        <div className="hidden sm:flex items-center gap-1 p-1 rounded-lg bg-void-300 border border-neon-purple-500/10">
          <button
            className={cn(
              'p-2 rounded-md transition-colors',
              'bg-neon-purple-500/20 text-neon-cyan-400'
            )}
          >
            <Grid3X3 className="w-4 h-4" />
          </button>
          <button
            className={cn(
              'p-2 rounded-md transition-colors',
              'text-white/40 hover:text-white/60'
            )}
          >
            <LayoutGrid className="w-4 h-4" />
          </button>
        </div>

        {/* Spacer */}
        <div className="flex-1" />

        {/* Sort dropdown */}
        <SortDropdown value={sort} onChange={onSortChange} />
      </div>
    </div>
  );
}

// Helper function for Russian pluralization
function getProductWord(count: number): string {
  const lastTwo = count % 100;
  const lastOne = count % 10;

  if (lastTwo >= 11 && lastTwo <= 19) {
    return 'товаров';
  }

  if (lastOne === 1) {
    return 'товар';
  }

  if (lastOne >= 2 && lastOne <= 4) {
    return 'товара';
  }

  return 'товаров';
}
