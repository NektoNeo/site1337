'use client';

import { useReducer, useCallback, useMemo } from 'react';
import { FilterState, SortOption, Product } from '@/types/product';

// ============================================
// EFFICIENT FILTER STATE MANAGEMENT HOOK
// ============================================
// Performance optimizations:
// 1. useReducer for complex state updates
// 2. Memoized selectors for derived state
// 3. Batched filter updates
// 4. Optimized comparison functions
// ============================================

// Filter action types
type FilterAction =
  | { type: 'SET_CATEGORIES'; payload: string[] }
  | { type: 'TOGGLE_CATEGORY'; payload: string }
  | { type: 'SET_PRICE_RANGE'; payload: [number, number] }
  | { type: 'SET_PROCESSORS'; payload: string[] }
  | { type: 'TOGGLE_PROCESSOR'; payload: string }
  | { type: 'SET_GRAPHICS'; payload: string[] }
  | { type: 'TOGGLE_GRAPHICS'; payload: string }
  | { type: 'SET_RAM'; payload: string[] }
  | { type: 'TOGGLE_RAM'; payload: string }
  | { type: 'SET_SORT'; payload: SortOption }
  | { type: 'SET_PAGE'; payload: number }
  | { type: 'RESET_FILTERS' }
  | { type: 'BATCH_UPDATE'; payload: Partial<FilterState> };

interface FilterReducerState extends FilterState {
  sort: SortOption;
  currentPage: number;
}

const initialState: FilterReducerState = {
  categories: [],
  priceRange: [0, 500000],
  processors: [],
  graphics: [],
  ram: [],
  sort: 'popularity',
  currentPage: 1,
};

// Helper to toggle array item
function toggleArrayItem<T>(array: T[], item: T): T[] {
  const index = array.indexOf(item);
  if (index === -1) {
    return [...array, item];
  }
  return array.filter((_, i) => i !== index);
}

// Reducer function
function filterReducer(
  state: FilterReducerState,
  action: FilterAction
): FilterReducerState {
  switch (action.type) {
    case 'SET_CATEGORIES':
      return { ...state, categories: action.payload, currentPage: 1 };

    case 'TOGGLE_CATEGORY':
      return {
        ...state,
        categories: toggleArrayItem(state.categories, action.payload),
        currentPage: 1,
      };

    case 'SET_PRICE_RANGE':
      return { ...state, priceRange: action.payload, currentPage: 1 };

    case 'SET_PROCESSORS':
      return { ...state, processors: action.payload, currentPage: 1 };

    case 'TOGGLE_PROCESSOR':
      return {
        ...state,
        processors: toggleArrayItem(state.processors, action.payload),
        currentPage: 1,
      };

    case 'SET_GRAPHICS':
      return { ...state, graphics: action.payload, currentPage: 1 };

    case 'TOGGLE_GRAPHICS':
      return {
        ...state,
        graphics: toggleArrayItem(state.graphics, action.payload),
        currentPage: 1,
      };

    case 'SET_RAM':
      return { ...state, ram: action.payload, currentPage: 1 };

    case 'TOGGLE_RAM':
      return {
        ...state,
        ram: toggleArrayItem(state.ram, action.payload),
        currentPage: 1,
      };

    case 'SET_SORT':
      return { ...state, sort: action.payload, currentPage: 1 };

    case 'SET_PAGE':
      return { ...state, currentPage: action.payload };

    case 'RESET_FILTERS':
      return initialState;

    case 'BATCH_UPDATE':
      return { ...state, ...action.payload, currentPage: 1 };

    default:
      return state;
  }
}

interface UseFilterStateOptions {
  initialPriceRange?: [number, number];
  productsPerPage?: number;
}

export function useFilterState(options: UseFilterStateOptions = {}) {
  const { initialPriceRange = [0, 500000], productsPerPage = 9 } = options;

  const [state, dispatch] = useReducer(filterReducer, {
    ...initialState,
    priceRange: initialPriceRange,
  });

  // Memoized action creators
  const actions = useMemo(
    () => ({
      setCategories: (categories: string[]) =>
        dispatch({ type: 'SET_CATEGORIES', payload: categories }),

      toggleCategory: (category: string) =>
        dispatch({ type: 'TOGGLE_CATEGORY', payload: category }),

      setPriceRange: (range: [number, number]) =>
        dispatch({ type: 'SET_PRICE_RANGE', payload: range }),

      setProcessors: (processors: string[]) =>
        dispatch({ type: 'SET_PROCESSORS', payload: processors }),

      toggleProcessor: (processor: string) =>
        dispatch({ type: 'TOGGLE_PROCESSOR', payload: processor }),

      setGraphics: (graphics: string[]) =>
        dispatch({ type: 'SET_GRAPHICS', payload: graphics }),

      toggleGraphics: (graphics: string) =>
        dispatch({ type: 'TOGGLE_GRAPHICS', payload: graphics }),

      setRam: (ram: string[]) =>
        dispatch({ type: 'SET_RAM', payload: ram }),

      toggleRam: (ram: string) =>
        dispatch({ type: 'TOGGLE_RAM', payload: ram }),

      setSort: (sort: SortOption) =>
        dispatch({ type: 'SET_SORT', payload: sort }),

      setPage: (page: number) =>
        dispatch({ type: 'SET_PAGE', payload: page }),

      resetFilters: () => dispatch({ type: 'RESET_FILTERS' }),

      batchUpdate: (updates: Partial<FilterState>) =>
        dispatch({ type: 'BATCH_UPDATE', payload: updates }),
    }),
    []
  );

  // Memoized filter function
  const filterProducts = useCallback(
    (products: Product[]): Product[] => {
      let result = [...products];

      // Filter by category
      if (state.categories.length > 0) {
        result = result.filter((p) => state.categories.includes(p.category));
      }

      // Filter by price range
      result = result.filter((p) => {
        const price = p.salePrice || p.price;
        return price >= state.priceRange[0] && price <= state.priceRange[1];
      });

      // Filter by processor
      if (state.processors.length > 0) {
        result = result.filter((p) =>
          state.processors.some((proc) => p.specs.processor.includes(proc))
        );
      }

      // Filter by graphics
      if (state.graphics.length > 0) {
        result = result.filter((p) =>
          state.graphics.some((gpu) => p.specs.graphics.includes(gpu))
        );
      }

      // Filter by RAM
      if (state.ram.length > 0) {
        result = result.filter((p) =>
          state.ram.some((ram) => p.specs.ram.includes(ram))
        );
      }

      // Sort
      switch (state.sort) {
        case 'price-asc':
          result.sort(
            (a, b) => (a.salePrice || a.price) - (b.salePrice || b.price)
          );
          break;
        case 'price-desc':
          result.sort(
            (a, b) => (b.salePrice || b.price) - (a.salePrice || a.price)
          );
          break;
        case 'popularity':
          result.sort((a, b) => b.popularity - a.popularity);
          break;
        case 'newest':
          result.sort((a, b) => parseInt(b.id) - parseInt(a.id));
          break;
      }

      return result;
    },
    [state.categories, state.priceRange, state.processors, state.graphics, state.ram, state.sort]
  );

  // Memoized pagination helper
  const paginateProducts = useCallback(
    (products: Product[]) => {
      const totalPages = Math.ceil(products.length / productsPerPage);
      const start = (state.currentPage - 1) * productsPerPage;
      const paginatedProducts = products.slice(start, start + productsPerPage);

      return {
        products: paginatedProducts,
        totalPages,
        currentPage: state.currentPage,
        totalProducts: products.length,
        hasNextPage: state.currentPage < totalPages,
        hasPrevPage: state.currentPage > 1,
      };
    },
    [state.currentPage, productsPerPage]
  );

  // Combined filter and paginate
  const getFilteredProducts = useCallback(
    (products: Product[]) => {
      const filtered = filterProducts(products);
      return paginateProducts(filtered);
    },
    [filterProducts, paginateProducts]
  );

  // Check if any filters are active
  const hasActiveFilters = useMemo(() => {
    return (
      state.categories.length > 0 ||
      state.processors.length > 0 ||
      state.graphics.length > 0 ||
      state.ram.length > 0 ||
      state.priceRange[0] !== initialPriceRange[0] ||
      state.priceRange[1] !== initialPriceRange[1]
    );
  }, [state, initialPriceRange]);

  // Get filter state for URL params (for sharing/bookmarking)
  const getFilterParams = useCallback(() => {
    const params = new URLSearchParams();

    if (state.categories.length > 0) {
      params.set('categories', state.categories.join(','));
    }
    if (state.processors.length > 0) {
      params.set('processors', state.processors.join(','));
    }
    if (state.graphics.length > 0) {
      params.set('graphics', state.graphics.join(','));
    }
    if (state.ram.length > 0) {
      params.set('ram', state.ram.join(','));
    }
    if (state.priceRange[0] !== initialPriceRange[0]) {
      params.set('minPrice', state.priceRange[0].toString());
    }
    if (state.priceRange[1] !== initialPriceRange[1]) {
      params.set('maxPrice', state.priceRange[1].toString());
    }
    if (state.sort !== 'popularity') {
      params.set('sort', state.sort);
    }
    if (state.currentPage > 1) {
      params.set('page', state.currentPage.toString());
    }

    return params.toString();
  }, [state, initialPriceRange]);

  return {
    // State
    filters: {
      categories: state.categories,
      priceRange: state.priceRange,
      processors: state.processors,
      graphics: state.graphics,
      ram: state.ram,
    },
    sort: state.sort,
    currentPage: state.currentPage,

    // Actions
    ...actions,

    // Helpers
    filterProducts,
    paginateProducts,
    getFilteredProducts,
    hasActiveFilters,
    getFilterParams,
  };
}

export type UseFilterStateReturn = ReturnType<typeof useFilterState>;
