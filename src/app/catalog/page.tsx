'use client';

import { useState, useMemo, useCallback } from 'react';
import { motion } from 'framer-motion';
import {
  CatalogHeader,
  FilterSidebar,
  ProductGrid,
  Pagination,
} from '@/components/catalog';
import { FilterState, SortOption } from '@/types/product';
import { mockProducts, filterOptions } from '@/lib/mock-data';

const PRODUCTS_PER_PAGE = 9;

// Animated background orbs
function BackgroundEffects() {
  return (
    <div className="fixed inset-0 pointer-events-none overflow-hidden">
      {/* Base dark gradient */}
      <div className="absolute inset-0 bg-gradient-to-b from-black via-[#0a0a0f] to-black" />
      
      {/* Grid pattern */}
      <div 
        className="absolute inset-0 opacity-[0.03]"
        style={{
          backgroundImage: `
            linear-gradient(rgba(139, 92, 246, 0.3) 1px, transparent 1px),
            linear-gradient(90deg, rgba(139, 92, 246, 0.3) 1px, transparent 1px)
          `,
          backgroundSize: '60px 60px',
        }}
      />
      
      {/* Ambient glow orbs */}
      <motion.div 
        className="absolute top-1/4 -left-32 w-96 h-96 bg-purple-600/20 rounded-full blur-[120px]"
        animate={{
          x: [0, 50, 0],
          y: [0, 30, 0],
          scale: [1, 1.1, 1],
        }}
        transition={{ duration: 15, repeat: Infinity, ease: 'easeInOut' }}
      />
      <motion.div 
        className="absolute bottom-1/4 -right-32 w-96 h-96 bg-cyan-600/15 rounded-full blur-[120px]"
        animate={{
          x: [0, -50, 0],
          y: [0, -30, 0],
          scale: [1, 1.2, 1],
        }}
        transition={{ duration: 18, repeat: Infinity, ease: 'easeInOut' }}
      />
      <motion.div 
        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-purple-500/5 rounded-full blur-[150px]"
        animate={{
          scale: [1, 1.3, 1],
          opacity: [0.3, 0.5, 0.3],
        }}
        transition={{ duration: 10, repeat: Infinity, ease: 'easeInOut' }}
      />
      
      {/* Bottom gradient */}
      <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-purple-900/20 to-transparent" />
    </div>
  );
}

// Page title with animation
function PageTitle() {
  return (
    <motion.div 
      className="mb-8"
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <motion.div
        className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-purple-500/10 border border-purple-500/20 mb-4"
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: 0.2 }}
      >
        <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 animate-pulse" />
        <span className="text-xs font-mono text-purple-300 uppercase tracking-wider">VA-PC Collection</span>
      </motion.div>
      
      <h1 className="font-display font-black text-4xl md:text-5xl lg:text-6xl">
        <span className="text-white">Каталог </span>
        <span className="bg-gradient-to-r from-purple-400 to-cyan-400 bg-clip-text text-transparent">
          игровых ПК
        </span>
      </h1>
      <p className="text-white/50 mt-4 max-w-2xl text-lg">
        Выберите идеальный компьютер для ваших задач. Все системы протестированы и готовы к работе.
      </p>
    </motion.div>
  );
}

export default function CatalogPage() {
  // Filter state
  const [filters, setFilters] = useState<FilterState>({
    categories: [],
    priceRange: [filterOptions.priceRange.min, filterOptions.priceRange.max],
    processors: [],
    graphics: [],
    ram: [],
  });

  // Sort state
  const [sort, setSort] = useState<SortOption>('popularity');

  // Pagination state
  const [currentPage, setCurrentPage] = useState(1);

  // Mobile filter sidebar state
  const [isFilterOpen, setIsFilterOpen] = useState(false);

  // Filter and sort products
  const filteredProducts = useMemo(() => {
    let result = [...mockProducts];

    // Filter by category
    if (filters.categories.length > 0) {
      result = result.filter((p) => filters.categories.includes(p.category));
    }

    // Filter by price range
    result = result.filter((p) => {
      const price = p.salePrice || p.price;
      return price >= filters.priceRange[0] && price <= filters.priceRange[1];
    });

    // Filter by processor
    if (filters.processors.length > 0) {
      result = result.filter((p) =>
        filters.processors.some((proc) => p.specs.processor.includes(proc))
      );
    }

    // Filter by graphics
    if (filters.graphics.length > 0) {
      result = result.filter((p) =>
        filters.graphics.some((gpu) => p.specs.graphics.includes(gpu))
      );
    }

    // Filter by RAM
    if (filters.ram.length > 0) {
      result = result.filter((p) =>
        filters.ram.some((ram) => p.specs.ram.includes(ram))
      );
    }

    // Sort
    switch (sort) {
      case 'price-asc':
        result.sort((a, b) => (a.salePrice || a.price) - (b.salePrice || b.price));
        break;
      case 'price-desc':
        result.sort((a, b) => (b.salePrice || b.price) - (a.salePrice || a.price));
        break;
      case 'popularity':
        result.sort((a, b) => b.popularity - a.popularity);
        break;
      case 'newest':
        result.sort((a, b) => parseInt(b.id) - parseInt(a.id));
        break;
    }

    return result;
  }, [filters, sort]);

  // Paginate products
  const totalPages = Math.ceil(filteredProducts.length / PRODUCTS_PER_PAGE);
  const paginatedProducts = useMemo(() => {
    const start = (currentPage - 1) * PRODUCTS_PER_PAGE;
    return filteredProducts.slice(start, start + PRODUCTS_PER_PAGE);
  }, [filteredProducts, currentPage]);

  // Handle filter changes - reset to page 1
  const handleFiltersChange = useCallback((newFilters: FilterState) => {
    setFilters(newFilters);
    setCurrentPage(1);
  }, []);

  // Handle sort changes - reset to page 1
  const handleSortChange = useCallback((newSort: SortOption) => {
    setSort(newSort);
    setCurrentPage(1);
  }, []);

  return (
    <div className="min-h-screen relative">
      {/* Background effects */}
      <BackgroundEffects />

      {/* Content */}
      <div className="relative z-10 max-w-[1800px] mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Page Title */}
        <PageTitle />
        
        <div className="flex gap-8">
          {/* Sidebar */}
          <FilterSidebar
            filters={filters}
            onFiltersChange={handleFiltersChange}
            isOpen={isFilterOpen}
            onClose={() => setIsFilterOpen(false)}
          />

          {/* Main content */}
          <div className="flex-1 min-w-0">
            {/* Header with sort and filter controls */}
            <CatalogHeader
              productCount={filteredProducts.length}
              sort={sort}
              onSortChange={handleSortChange}
              onOpenFilters={() => setIsFilterOpen(true)}
            />

            {/* Product grid */}
            <ProductGrid products={paginatedProducts} />

            {/* Pagination */}
            {totalPages > 1 && (
              <Pagination
                currentPage={currentPage}
                totalPages={totalPages}
                onPageChange={setCurrentPage}
              />
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
