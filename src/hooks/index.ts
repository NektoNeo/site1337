// Product data hooks
export { useProducts } from './use-products';
export { useVKProducts } from './use-vk-products';

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
