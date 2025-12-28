'use client';

/**
 * Product Filters Component
 * Responsive filter panel for catalog page
 * Desktop: Sidebar, Mobile: Sheet (slide-out panel)
 */

import { useState, useCallback } from 'react';
import { Search, X, SlidersHorizontal, RotateCcw } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
  SheetFooter,
  SheetClose,
} from '@/components/ui/sheet';
import { PriceRangeSlider } from './PriceRangeSlider';
import {
  CatalogFilters,
  CatalogSort,
  PriceRange,
  CATALOG_SORT_OPTIONS,
  DEFAULT_PRICE_BOUNDS,
} from '@/types/catalog';

/**
 * Filter section wrapper component
 */
interface FilterSectionProps {
  title: string;
  children: React.ReactNode;
  className?: string;
}

function FilterSection({ title, children, className }: FilterSectionProps) {
  return (
    <div className={cn('space-y-3', className)}>
      <h3 className="text-sm font-medium text-zinc-300 uppercase tracking-wider font-inter">
        {title}
      </h3>
      {children}
    </div>
  );
}

/**
 * Category checkbox component
 */
interface CategoryCheckboxProps {
  id: string;
  name: string;
  checked: boolean;
  onChange: (checked: boolean) => void;
  count?: number;
}

function CategoryCheckbox({
  id,
  name,
  checked,
  onChange,
  count,
}: CategoryCheckboxProps) {
  return (
    <label
      htmlFor={id}
      className={cn(
        'flex items-center gap-3 px-3 py-2.5 rounded-lg cursor-pointer',
        'transition-all duration-200',
        'hover:bg-white/5',
        checked && 'bg-[#8B5CF6]/10 border border-[#8B5CF6]/30'
      )}
    >
      <div className="relative">
        <input
          type="checkbox"
          id={id}
          checked={checked}
          onChange={(e) => onChange(e.target.checked)}
          className="sr-only"
        />
        <div
          className={cn(
            'size-5 rounded border-2 flex items-center justify-center',
            'transition-all duration-200',
            checked
              ? 'bg-[#8B5CF6] border-[#8B5CF6] shadow-[0_0_10px_rgba(139,92,246,0.5)]'
              : 'border-zinc-600 hover:border-zinc-500'
          )}
        >
          {checked && (
            <svg
              className="size-3 text-white"
              viewBox="0 0 12 12"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M2 6l3 3 5-5" />
            </svg>
          )}
        </div>
      </div>
      <span className="flex-1 text-sm text-zinc-300">{name}</span>
      {count !== undefined && (
        <span className="text-xs text-zinc-500 font-mono">{count}</span>
      )}
    </label>
  );
}

/**
 * Filter content (shared between desktop and mobile)
 */
interface FilterContentProps {
  filters: CatalogFilters;
  onSearchChange: (value: string) => void;
  onCategoryToggle: (id: string) => void;
  onPriceRangeChange: (min: number, max: number) => void;
  onSortChange: (sort: CatalogSort) => void;
  onReset: () => void;
  categories: Array<{ id: string; name: string; count?: number }>;
  priceBounds?: PriceRange;
  filtersCount: number;
}

function FilterContent({
  filters,
  onSearchChange,
  onCategoryToggle,
  onPriceRangeChange,
  onSortChange,
  onReset,
  categories,
  priceBounds = DEFAULT_PRICE_BOUNDS,
  filtersCount,
}: FilterContentProps) {
  const priceValue: [number, number] = filters.priceRange
    ? [filters.priceRange.min, filters.priceRange.max]
    : [priceBounds.min, priceBounds.max];

  return (
    <div className="space-y-6">
      {/* Search */}
      <FilterSection title="Поиск">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-zinc-500" />
          <Input
            type="text"
            placeholder="Найти компьютер..."
            value={filters.search}
            onChange={(e) => onSearchChange(e.target.value)}
            className="pl-10"
            variant="glass"
          />
          {filters.search && (
            <button
              type="button"
              onClick={() => onSearchChange('')}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-zinc-500 hover:text-white transition-colors"
            >
              <X className="size-4" />
            </button>
          )}
        </div>
      </FilterSection>

      {/* Sort */}
      <FilterSection title="Сортировка">
        <Select value={filters.sort} onValueChange={(v) => onSortChange(v as CatalogSort)}>
          <SelectTrigger variant="glass">
            <SelectValue placeholder="Выберите сортировку" />
          </SelectTrigger>
          <SelectContent>
            {CATALOG_SORT_OPTIONS.map((option) => (
              <SelectItem key={option.value} value={option.value}>
                {option.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </FilterSection>

      {/* Categories */}
      <FilterSection title="Платформа">
        <div className="space-y-1">
          {categories.map((category) => (
            <CategoryCheckbox
              key={category.id}
              id={`category-${category.id}`}
              name={category.name}
              checked={filters.categoryIds.includes(category.id)}
              onChange={() => onCategoryToggle(category.id)}
              count={category.count}
            />
          ))}
        </div>
      </FilterSection>

      {/* Price Range */}
      <FilterSection title="Цена">
        <PriceRangeSlider
          min={priceBounds.min}
          max={priceBounds.max}
          value={priceValue}
          onChange={([min, max]) => onPriceRangeChange(min, max)}
        />
      </FilterSection>

      {/* Reset Button */}
      {filtersCount > 0 && (
        <Button
          variant="ghost"
          onClick={onReset}
          className="w-full justify-center gap-2 text-zinc-400 hover:text-white"
        >
          <RotateCcw className="size-4" />
          Сбросить фильтры ({filtersCount})
        </Button>
      )}
    </div>
  );
}

/**
 * ProductFilters Props
 */
export interface ProductFiltersProps {
  filters: CatalogFilters;
  onSearchChange: (value: string) => void;
  onCategoryToggle: (id: string) => void;
  onPriceRangeChange: (min: number, max: number) => void;
  onSortChange: (sort: CatalogSort) => void;
  onReset: () => void;
  categories?: Array<{ id: string; name: string; count?: number }>;
  priceBounds?: PriceRange;
  filtersCount?: number;
  className?: string;
}

/**
 * Default categories for AMD/Intel
 */
const DEFAULT_CATEGORIES = [
  { id: 'amd', name: 'AMD Ryzen', count: 0 },
  { id: 'intel', name: 'Intel Core', count: 0 },
];

/**
 * Product Filters Component
 * Displays as sidebar on desktop, sheet on mobile
 */
export function ProductFilters({
  filters,
  onSearchChange,
  onCategoryToggle,
  onPriceRangeChange,
  onSortChange,
  onReset,
  categories = DEFAULT_CATEGORIES,
  priceBounds = DEFAULT_PRICE_BOUNDS,
  filtersCount = 0,
  className,
}: ProductFiltersProps) {
  const [isOpen, setIsOpen] = useState(false);

  const filterContentProps: FilterContentProps = {
    filters,
    onSearchChange,
    onCategoryToggle,
    onPriceRangeChange,
    onSortChange,
    onReset,
    categories,
    priceBounds,
    filtersCount,
  };

  return (
    <>
      {/* Mobile: Filter Button + Sheet */}
      <div className="lg:hidden">
        <Sheet open={isOpen} onOpenChange={setIsOpen}>
          <SheetTrigger asChild>
            <Button
              variant="outline"
              className="gap-2"
            >
              <SlidersHorizontal className="size-4" />
              Фильтры
              {filtersCount > 0 && (
                <span className="ml-1 px-2 py-0.5 text-xs bg-[#8B5CF6] rounded-full">
                  {filtersCount}
                </span>
              )}
            </Button>
          </SheetTrigger>
          <SheetContent side="left" glowColor="purple">
            <SheetHeader>
              <SheetTitle>Фильтры</SheetTitle>
            </SheetHeader>
            <div className="flex-1 overflow-y-auto py-6 px-1">
              <FilterContent {...filterContentProps} />
            </div>
            <SheetFooter>
              <SheetClose asChild>
                <Button variant="default" className="w-full">
                  Применить
                </Button>
              </SheetClose>
            </SheetFooter>
          </SheetContent>
        </Sheet>
      </div>

      {/* Desktop: Sidebar */}
      <aside
        className={cn(
          'hidden lg:block',
          'w-72 shrink-0',
          'p-6 rounded-xl',
          'bg-[#0a0a0a]/80 backdrop-blur-sm',
          'border border-zinc-800/50',
          className
        )}
      >
        <div className="sticky top-24">
          <h2 className="text-lg font-bold text-white mb-6 font-orbitron tracking-wide">
            Фильтры
          </h2>
          <FilterContent {...filterContentProps} />
        </div>
      </aside>
    </>
  );
}

/**
 * Mobile Filter Bar Component
 * Sticky bar with quick filters for mobile
 */
export interface MobileFilterBarProps {
  filters: CatalogFilters;
  onSortChange: (sort: CatalogSort) => void;
  onOpenFilters: () => void;
  filtersCount: number;
  totalProducts: number;
}

export function MobileFilterBar({
  filters,
  onSortChange,
  onOpenFilters,
  filtersCount,
  totalProducts,
}: MobileFilterBarProps) {
  return (
    <div className="lg:hidden sticky top-16 z-40 -mx-4 px-4 py-3 bg-[#0a0a0a]/90 backdrop-blur-md border-b border-zinc-800/50">
      <div className="flex items-center justify-between gap-3">
        {/* Products count */}
        <span className="text-sm text-zinc-400">
          <span className="text-white font-medium">{totalProducts}</span> товаров
        </span>

        {/* Quick sort */}
        <Select value={filters.sort} onValueChange={(v) => onSortChange(v as CatalogSort)}>
          <SelectTrigger variant="glass" size="sm" className="w-40">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            {CATALOG_SORT_OPTIONS.map((option) => (
              <SelectItem key={option.value} value={option.value}>
                {option.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        {/* Filter button */}
        <Button
          variant="ghost"
          size="sm"
          onClick={onOpenFilters}
          className="gap-1.5"
        >
          <SlidersHorizontal className="size-4" />
          {filtersCount > 0 && (
            <span className="px-1.5 py-0.5 text-xs bg-[#8B5CF6] rounded-full">
              {filtersCount}
            </span>
          )}
        </Button>
      </div>
    </div>
  );
}

export default ProductFilters;
