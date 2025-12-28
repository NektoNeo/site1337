'use client';

import { motion } from 'framer-motion';
import { SlidersHorizontal, X, RotateCcw } from 'lucide-react';
import { FilterGroup } from './FilterGroup';
import { PriceRangeSlider } from './PriceRangeSlider';
import { FilterState } from '@/types/product';
import { filterOptions } from '@/lib/mock-data';

interface FilterSidebarProps {
  filters: FilterState;
  onFiltersChange: (filters: FilterState) => void;
  isOpen?: boolean;
  onClose?: () => void;
}

export function FilterSidebar({
  filters,
  onFiltersChange,
  isOpen = true,
  onClose,
}: FilterSidebarProps) {
  const updateFilter = <K extends keyof FilterState>(
    key: K,
    value: FilterState[K]
  ) => {
    onFiltersChange({ ...filters, [key]: value });
  };

  const resetFilters = () => {
    onFiltersChange({
      categories: [],
      priceRange: [filterOptions.priceRange.min, filterOptions.priceRange.max],
      processors: [],
      graphics: [],
      ram: [],
    });
  };

  const hasActiveFilters =
    filters.categories.length > 0 ||
    filters.processors.length > 0 ||
    filters.graphics.length > 0 ||
    filters.ram.length > 0 ||
    filters.priceRange[0] !== filterOptions.priceRange.min ||
    filters.priceRange[1] !== filterOptions.priceRange.max;

  return (
    <>
      {/* Mobile overlay */}
      {isOpen && onClose && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          className="fixed inset-0 bg-black/80 backdrop-blur-sm z-40 lg:hidden"
        />
      )}

      {/* Sidebar */}
      <motion.aside
        initial={{ x: -100, opacity: 0 }}
        animate={{ x: 0, opacity: 1 }}
        transition={{ type: 'spring', damping: 25, stiffness: 200 }}
        className={`
          fixed lg:sticky top-0 left-0 z-50 lg:z-auto
          h-screen lg:h-auto lg:max-h-[calc(100vh-2rem)]
          w-[320px] lg:w-[280px] xl:w-[300px]
          overflow-y-auto
          ${isOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
          transition-transform lg:transition-none duration-300
        `}
      >
        {/* Glassmorphism panel */}
        <div className="relative m-4 lg:m-0 rounded-2xl overflow-hidden">
          {/* Animated border */}
          <div className="absolute inset-0 rounded-2xl border-gradient-animated" />
          
          {/* Glass background */}
          <div className="relative glass-panel rounded-2xl p-5">
            {/* Header */}
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-neon-purple-500/20 to-neon-purple-500/20 flex items-center justify-center border border-neon-purple-500/30">
                  <SlidersHorizontal className="w-5 h-5 text-neon-purple-400" />
                </div>
                <div>
                  <h3 className="font-inter text-lg font-bold text-white uppercase tracking-wider">
                    Фильтры
                  </h3>
                  <p className="text-xs text-white/40 font-mono">Настрой поиск</p>
                </div>
              </div>
              
              {/* Mobile close button */}
              {onClose && (
                <button
                  onClick={onClose}
                  className="lg:hidden w-8 h-8 rounded-lg bg-white/5 flex items-center justify-center hover:bg-white/10 transition-colors"
                >
                  <X className="w-4 h-4 text-white/60" />
                </button>
              )}
            </div>

            {/* Reset button */}
            {hasActiveFilters && (
              <motion.button
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                onClick={resetFilters}
                className="w-full mb-4 py-2.5 px-4 rounded-xl border border-neon-purple-500/30 bg-neon-purple-500/10 
                  flex items-center justify-center gap-2 text-sm font-medium text-neon-purple-300
                  hover:bg-neon-purple-500/20 hover:border-neon-purple-400/50 transition-all duration-200 group"
              >
                <RotateCcw className="w-4 h-4 group-hover:rotate-[-360deg] transition-transform duration-500" />
                <span>Сбросить фильтры</span>
              </motion.button>
            )}

            {/* Divider */}
            <div className="h-px bg-gradient-to-r from-transparent via-neon-purple-500/30 to-transparent mb-4" />

            {/* Filter groups */}
            <div className="space-y-1">
              {/* Category */}
              <FilterGroup
                title="Категория"
                options={filterOptions.categories}
                selected={filters.categories}
                onChange={(value) => updateFilter('categories', value)}
              />

              {/* Price Range */}
              <div className="border-b border-neon-purple-500/20 pb-4">
                <h4 className="py-3 font-inter text-sm font-semibold uppercase tracking-wider text-white/90">
                  Цена
                </h4>
                <PriceRangeSlider
                  min={filterOptions.priceRange.min}
                  max={filterOptions.priceRange.max}
                  value={filters.priceRange}
                  onChange={(value) => updateFilter('priceRange', value)}
                />
              </div>

              {/* Processor */}
              <FilterGroup
                title="Процессор"
                options={filterOptions.processors}
                selected={filters.processors}
                onChange={(value) => updateFilter('processors', value)}
                defaultOpen={false}
              />

              {/* Graphics */}
              <FilterGroup
                title="Видеокарта"
                options={filterOptions.graphics}
                selected={filters.graphics}
                onChange={(value) => updateFilter('graphics', value)}
                defaultOpen={false}
              />

              {/* RAM */}
              <FilterGroup
                title="Оперативная память"
                options={filterOptions.ram}
                selected={filters.ram}
                onChange={(value) => updateFilter('ram', value)}
                defaultOpen={false}
              />
            </div>

            {/* Bottom decoration */}
            <div className="mt-6 pt-4 border-t border-neon-purple-500/20">
              <div className="flex items-center gap-2 text-xs text-white/30">
                <div className="w-2 h-2 rounded-full bg-neon-purple-500 animate-pulse" />
                <span className="font-mono">VA-PC SYSTEMS</span>
              </div>
            </div>
          </div>
        </div>
      </motion.aside>
    </>
  );
}
