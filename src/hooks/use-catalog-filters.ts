'use client';

/**
 * Catalog Filters Hook
 * Manages filter state with URL synchronization and debounced search
 */

import { useState, useCallback, useMemo, useEffect, useRef } from 'react';
import { useSearchParams, usePathname, useRouter } from 'next/navigation';
import {
  CatalogFilters,
  CatalogSort,
  PriceRange,
  DEFAULT_CATALOG_FILTERS,
  CATALOG_URL_PARAMS,
  countActiveFilters,
} from '@/types/catalog';

/**
 * Debounce delay for search input (ms)
 */
const SEARCH_DEBOUNCE_MS = 300;

/**
 * Parse URL search params to CatalogFilters
 */
function parseFiltersFromURL(searchParams: URLSearchParams): Partial<CatalogFilters> {
  const filters: Partial<CatalogFilters> = {};

  // Search query
  const search = searchParams.get(CATALOG_URL_PARAMS.search);
  if (search) {
    filters.search = search;
  }

  // Category IDs (comma-separated)
  const category = searchParams.get(CATALOG_URL_PARAMS.category);
  if (category) {
    filters.categoryIds = category.split(',').filter(Boolean);
  }

  // Price range
  const priceFrom = searchParams.get(CATALOG_URL_PARAMS.priceFrom);
  const priceTo = searchParams.get(CATALOG_URL_PARAMS.priceTo);
  if (priceFrom || priceTo) {
    filters.priceRange = {
      min: priceFrom ? parseInt(priceFrom, 10) : 0,
      max: priceTo ? parseInt(priceTo, 10) : 500000,
    };
  }

  // Sort
  const sort = searchParams.get(CATALOG_URL_PARAMS.sort);
  if (sort && isValidSort(sort)) {
    filters.sort = sort as CatalogSort;
  }

  // Page
  const page = searchParams.get(CATALOG_URL_PARAMS.page);
  if (page) {
    const pageNum = parseInt(page, 10);
    if (pageNum > 0) {
      filters.page = pageNum;
    }
  }

  return filters;
}

/**
 * Validate sort value
 */
function isValidSort(value: string): value is CatalogSort {
  const validSorts: CatalogSort[] = [
    'date',
    'price_asc',
    'price_desc',
    'popular',
    'name_asc',
    'name_desc',
  ];
  return validSorts.includes(value as CatalogSort);
}

/**
 * Build URL search params from filters
 */
function buildURLFromFilters(filters: CatalogFilters): URLSearchParams {
  const params = new URLSearchParams();

  if (filters.search.trim()) {
    params.set(CATALOG_URL_PARAMS.search, filters.search.trim());
  }

  if (filters.categoryIds.length > 0) {
    params.set(CATALOG_URL_PARAMS.category, filters.categoryIds.join(','));
  }

  if (filters.priceRange) {
    if (filters.priceRange.min > 0) {
      params.set(CATALOG_URL_PARAMS.priceFrom, String(filters.priceRange.min));
    }
    if (filters.priceRange.max < 500000) {
      params.set(CATALOG_URL_PARAMS.priceTo, String(filters.priceRange.max));
    }
  }

  if (filters.sort !== DEFAULT_CATALOG_FILTERS.sort) {
    params.set(CATALOG_URL_PARAMS.sort, filters.sort);
  }

  if (filters.page > 1) {
    params.set(CATALOG_URL_PARAMS.page, String(filters.page));
  }

  return params;
}

/**
 * Return type for useCatalogFilters hook
 */
export interface UseCatalogFiltersReturn {
  /** Current filter state */
  filters: CatalogFilters;
  /** Debounced search value (for API calls) */
  debouncedSearch: string;
  /** Set category IDs */
  setCategory: (ids: string[]) => void;
  /** Toggle a single category */
  toggleCategory: (id: string) => void;
  /** Set price range */
  setPriceRange: (min: number, max: number) => void;
  /** Clear price range */
  clearPriceRange: () => void;
  /** Set search query (instant update, debounced for API) */
  setSearch: (query: string) => void;
  /** Set sort option */
  setSort: (sort: CatalogSort) => void;
  /** Set page number */
  setPage: (page: number) => void;
  /** Reset all filters to default */
  resetFilters: () => void;
  /** Number of active filters */
  filtersCount: number;
  /** Check if any filter is active */
  hasActiveFilters: boolean;
  /** Update multiple filters at once */
  updateFilters: (updates: Partial<CatalogFilters>) => void;
}

/**
 * Hook Options
 */
export interface UseCatalogFiltersOptions {
  /** Sync filters to URL (default: true) */
  syncToURL?: boolean;
  /** Debounce delay for search (default: 300ms) */
  searchDebounceMs?: number;
  /** Initial filters (merged with URL params) */
  initialFilters?: Partial<CatalogFilters>;
}

/**
 * Catalog Filters Hook
 * Manages filter state with URL synchronization and debounced search
 */
export function useCatalogFilters(
  options: UseCatalogFiltersOptions = {}
): UseCatalogFiltersReturn {
  const {
    syncToURL = true,
    searchDebounceMs = SEARCH_DEBOUNCE_MS,
    initialFilters = {},
  } = options;

  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  // Initialize filters from URL params + initial filters + defaults
  const getInitialFilters = useCallback((): CatalogFilters => {
    const urlFilters = parseFiltersFromURL(searchParams);
    return {
      ...DEFAULT_CATALOG_FILTERS,
      ...initialFilters,
      ...urlFilters,
    };
  }, [searchParams, initialFilters]);

  const [filters, setFilters] = useState<CatalogFilters>(getInitialFilters);
  const [debouncedSearch, setDebouncedSearch] = useState(filters.search);

  // Track if this is the initial mount
  const isInitialMount = useRef(true);

  // Debounce search value
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearch(filters.search);
    }, searchDebounceMs);

    return () => clearTimeout(timer);
  }, [filters.search, searchDebounceMs]);

  // Sync filters to URL
  useEffect(() => {
    if (!syncToURL || isInitialMount.current) {
      isInitialMount.current = false;
      return;
    }

    const newParams = buildURLFromFilters(filters);
    const newParamsString = newParams.toString();
    const currentParamsString = searchParams.toString();

    // Only update URL if params changed
    if (newParamsString !== currentParamsString) {
      const newURL = newParamsString ? `${pathname}?${newParamsString}` : pathname;
      router.replace(newURL, { scroll: false });
    }
  }, [filters, pathname, router, searchParams, syncToURL]);

  // Update filters helper
  const updateFilters = useCallback((updates: Partial<CatalogFilters>) => {
    setFilters((prev) => ({
      ...prev,
      ...updates,
      // Reset page to 1 when filters change (except when explicitly setting page)
      page: 'page' in updates ? updates.page! : 1,
    }));
  }, []);

  // Set category IDs
  const setCategory = useCallback(
    (ids: string[]) => {
      updateFilters({ categoryIds: ids });
    },
    [updateFilters]
  );

  // Toggle single category
  const toggleCategory = useCallback(
    (id: string) => {
      setFilters((prev) => {
        const isSelected = prev.categoryIds.includes(id);
        const newIds = isSelected
          ? prev.categoryIds.filter((cid) => cid !== id)
          : [...prev.categoryIds, id];
        return { ...prev, categoryIds: newIds, page: 1 };
      });
    },
    []
  );

  // Set price range
  const setPriceRange = useCallback(
    (min: number, max: number) => {
      updateFilters({ priceRange: { min, max } });
    },
    [updateFilters]
  );

  // Clear price range
  const clearPriceRange = useCallback(() => {
    updateFilters({ priceRange: null });
  }, [updateFilters]);

  // Set search query
  const setSearch = useCallback(
    (query: string) => {
      updateFilters({ search: query });
    },
    [updateFilters]
  );

  // Set sort option
  const setSort = useCallback(
    (sort: CatalogSort) => {
      updateFilters({ sort });
    },
    [updateFilters]
  );

  // Set page number
  const setPage = useCallback((page: number) => {
    setFilters((prev) => ({ ...prev, page }));
  }, []);

  // Reset all filters
  const resetFilters = useCallback(() => {
    setFilters({ ...DEFAULT_CATALOG_FILTERS, ...initialFilters });
  }, [initialFilters]);

  // Computed values
  const filtersCount = useMemo(() => countActiveFilters(filters), [filters]);

  const hasActiveFilters = useMemo(() => filtersCount > 0, [filtersCount]);

  return {
    filters,
    debouncedSearch,
    setCategory,
    toggleCategory,
    setPriceRange,
    clearPriceRange,
    setSearch,
    setSort,
    setPage,
    resetFilters,
    filtersCount,
    hasActiveFilters,
    updateFilters,
  };
}

export default useCatalogFilters;
