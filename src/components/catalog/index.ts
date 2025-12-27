// Core catalog components
export { CatalogHeader } from './CatalogHeader';
export { FilterSidebar } from './FilterSidebar';
export { FilterGroup } from './FilterGroup';
export { PriceRangeSlider } from './PriceRangeSlider';
export { ProductCard } from './ProductCard';
export { ProductGrid } from './ProductGrid';
export { Pagination } from './Pagination';
export { SortDropdown } from './SortDropdown';

// VK-integrated catalog components
export { VKProductCard } from './VKProductCard';
export { VKProductGrid, EmptyState, ErrorState, ProductCount } from './VKProductGrid';
export { ProductSkeleton, ProductSkeletonGrid } from './ProductSkeleton';

// New filter components
export { ProductFilters, MobileFilterBar } from './ProductFilters';
export { CategoryTabs, CategoryTabsCompact, CategoryPills } from './CategoryTabs';

// Performance-optimized components
export { OptimizedProductCard } from './OptimizedProductCard';
export { VirtualizedProductList } from './VirtualizedProductList';

// Lazy-loaded components for code splitting
export {
  LazyFilterSidebar,
  LazyVirtualizedProductList,
  LazyProductGrid,
  LazySortDropdown,
  LazyPriceRangeSlider,
  LazyFilterSidebarWithSuspense,
  LazyProductGridWithSuspense,
} from './LazyComponents';
