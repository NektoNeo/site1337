// Product data hooks
export { useProducts } from './use-products';
export { useVKProducts } from './use-vk-products';

// Catalog hooks (TanStack Query based)
export {
  useVKCatalog,
  useVKCatalogPage,
  useVKCategories,
  catalogQueryKeys,
  prefetchCatalogProducts,
  prefetchCatalogCategories,
} from './use-vk-catalog';
export type { UseVKCatalogReturn, UseVKCatalogOptions } from './use-vk-catalog';

// Catalog filter hooks
export { useCatalogFilters } from './use-catalog-filters';
export type { UseCatalogFiltersReturn, UseCatalogFiltersOptions } from './use-catalog-filters';

// Filter state management
export { useFilterState } from './useFilterState';
export type { UseFilterStateReturn } from './useFilterState';

// Prefetching and performance hooks
export {
  usePrefetchOnHover,
  usePrefetchOnVisible,
  usePrefetchNextPage,
  usePreloadImages,
  useProductPrefetch,
  useIntersectionObserver,
} from './usePrefetch';

// Animation optimization hooks
export {
  useAnimationVisibility,
  useThrottledMousePosition,
  useGlobalMousePosition,
  seededRandom,
  useSeededRandom,
  useAnimationPaused,
  useMounted,
  useParticleBurstPositions,
} from './useAnimationOptimization';
