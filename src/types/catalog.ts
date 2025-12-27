/**
 * Catalog Types for VA-PC Gaming Computers
 * Types for filtering, sorting, and displaying products in the catalog
 */

import { VKProduct, VKProductCategory, VKProductCollection } from './vk-product';

// ============================================
// PRODUCT SPECS TYPES (parsed from description)
// ============================================

/**
 * Parsed specifications from product description
 */
export interface CatalogProductSpecs {
  cpu: string | null;
  gpu: string | null;
  ram: string | null;
  ssd: string | null;
  motherboard?: string | null;
  psu?: string | null;
  cooling?: string | null;
  case?: string | null;
}

/**
 * Platform badge type (AMD or Intel)
 */
export type PlatformBadge = 'AMD' | 'Intel' | 'NVIDIA' | null;

/**
 * Product availability status
 */
export type CatalogAvailability = 'in_stock' | 'out_of_stock' | 'preorder';

/**
 * Catalog product image
 */
export interface CatalogProductImage {
  id: string;
  url: string;
  thumbnailUrl: string;
  width: number;
  height: number;
  alt: string;
  isMain: boolean;
}

/**
 * Category for catalog display
 */
export interface CatalogCategory {
  id: string;
  name: string;
  slug: string;
  description?: string;
  imageUrl?: string;
  productCount: number;
  isMain: boolean;
}

/**
 * Catalog view mode
 */
export type CatalogViewMode = 'grid' | 'list';

/**
 * Sort options for catalog products
 */
export type CatalogSort =
  | 'date'
  | 'price_asc'
  | 'price_desc'
  | 'popular'
  | 'name_asc'
  | 'name_desc';

/**
 * Sort option with display label
 */
export interface CatalogSortOption {
  value: CatalogSort;
  label: string;
}

/**
 * Available sort options for UI
 */
export const CATALOG_SORT_OPTIONS: CatalogSortOption[] = [
  { value: 'popular', label: 'Популярные' },
  { value: 'date', label: 'Новинки' },
  { value: 'price_asc', label: 'Сначала дешевые' },
  { value: 'price_desc', label: 'Сначала дорогие' },
  { value: 'name_asc', label: 'По названию А-Я' },
  { value: 'name_desc', label: 'По названию Я-А' },
];

/**
 * Price range for filtering
 */
export interface PriceRange {
  min: number;
  max: number;
}

/**
 * Catalog filter state
 */
export interface CatalogFilters {
  /** Search query */
  search: string;
  /** Selected category IDs */
  categoryIds: string[];
  /** Price range filter */
  priceRange: PriceRange | null;
  /** Current sort option */
  sort: CatalogSort;
  /** Current page (1-indexed) */
  page: number;
  /** Items per page */
  pageSize: number;
}

/**
 * Default filter values
 */
export const DEFAULT_CATALOG_FILTERS: CatalogFilters = {
  search: '',
  categoryIds: [],
  priceRange: null,
  sort: 'popular',
  page: 1,
  pageSize: 20,
};

/**
 * Default price range bounds
 */
export const DEFAULT_PRICE_BOUNDS: PriceRange = {
  min: 0,
  max: 500000,
};

/**
 * Category tab for quick filtering
 */
export interface CategoryTab {
  id: string;
  name: string;
  count: number;
}

/**
 * Predefined category tabs (AMD/Intel split)
 */
export const PREDEFINED_CATEGORY_TABS: Omit<CategoryTab, 'count'>[] = [
  { id: 'all', name: 'Все' },
  { id: 'amd', name: 'AMD' },
  { id: 'intel', name: 'Intel' },
];

/**
 * Catalog product - normalized for display
 * Extends VKProduct with computed fields for catalog
 */
export interface CatalogProduct extends VKProduct {
  /** Computed: is product new (less than 7 days old) */
  isNew: boolean;
  /** Computed: discount percentage if applicable */
  discountPercent: number | null;
  /** Computed: formatted price for display */
  displayPrice: string;
  /** Computed: original price if discounted */
  displayOriginalPrice: string | null;

  // Additional fields for VKProductCard
  /** Parsed specifications from description */
  specs?: CatalogProductSpecs;
  /** Platform badge (AMD/Intel/NVIDIA) */
  platformBadge?: PlatformBadge;
  /** Product badges (TOP, SALE, NEW, etc.) */
  badges?: string[];
  /** Formatted price string */
  formattedPrice?: string;
  /** Formatted original price if discounted */
  formattedOriginalPrice?: string | null;
  /** Has discount flag */
  hasDiscount?: boolean;
  /** Is in stock flag */
  inStock?: boolean;
  /** Internal product URL */
  productUrl?: string;
  /** Category name for display */
  categoryName?: string;
}

/**
 * Catalog state for the catalog page
 */
export interface CatalogState {
  products: CatalogProduct[];
  categories: VKProductCollection[];
  filters: CatalogFilters;
  totalCount: number;
  isLoading: boolean;
  error: Error | null;
  hasMore: boolean;
}

/**
 * API response for catalog products
 */
export interface CatalogProductsResponse {
  products: CatalogProduct[];
  total: number;
  page: number;
  pageSize: number;
  hasMore: boolean;
  priceBounds: PriceRange;
}

/**
 * URL search params keys for catalog filters
 */
export const CATALOG_URL_PARAMS = {
  search: 'q',
  category: 'category',
  priceFrom: 'price_from',
  priceTo: 'price_to',
  sort: 'sort',
  page: 'page',
} as const;

/**
 * Extract specifications from product description
 */
function extractSpecs(description: string): CatalogProductSpecs {
  const normalizedDesc = description.replace(/\r\n/g, '\n').replace(/\s+/g, ' ');

  // CPU patterns
  const cpuPatterns = [
    /Intel\s+Core\s+i[3579]-?\d{4,5}[A-Z]*/gi,
    /Core\s+i[3579]-?\d{4,5}[A-Z]*/gi,
    /i[3579]-?\d{4,5}[A-Z]*/gi,
    /AMD\s+Ryzen\s+[3579]\s+\d{4}[A-Z]*/gi,
    /Ryzen\s+[3579]\s+\d{4}[A-Z]*/gi,
  ];

  // GPU patterns
  const gpuPatterns = [
    /GeForce\s+RTX\s+\d{4}(?:\s+Ti)?(?:\s+SUPER)?/gi,
    /RTX\s+\d{4}(?:\s+Ti)?(?:\s+SUPER)?/gi,
    /Radeon\s+RX\s+\d{4}(?:\s+XT)?(?:\s+XTX)?/gi,
    /RX\s+\d{4}(?:\s+XT)?(?:\s+XTX)?/gi,
  ];

  // RAM patterns
  const ramPatterns = [
    /(\d{1,3})\s*(?:GB|ГБ)\s+DDR[45]/gi,
    /DDR[45]\s+(\d{1,3})\s*(?:GB|ГБ)/gi,
    /(\d{1,3})\s*(?:GB|ГБ)(?:\s+RAM|\s+ОЗУ)/gi,
  ];

  // SSD patterns
  const ssdPatterns = [
    /SSD\s+(?:NVMe\s+)?(\d+)\s*(?:GB|TB|ГБ|ТБ)/gi,
    /(\d+)\s*(?:GB|TB|ГБ|ТБ)\s+(?:SSD|NVMe)/gi,
    /M\.2\s+(\d+)\s*(?:GB|TB|ГБ|ТБ)/gi,
  ];

  const extractFirst = (patterns: RegExp[]): string | null => {
    for (const pattern of patterns) {
      const match = normalizedDesc.match(pattern);
      if (match) return match[0].trim();
    }
    return null;
  };

  return {
    cpu: extractFirst(cpuPatterns),
    gpu: extractFirst(gpuPatterns),
    ram: extractFirst(ramPatterns),
    ssd: extractFirst(ssdPatterns),
  };
}

/**
 * Get platform badge from specs
 */
function getPlatformBadge(specs: CatalogProductSpecs): PlatformBadge {
  const cpu = (specs.cpu || '').toLowerCase();
  const gpu = (specs.gpu || '').toLowerCase();

  if (cpu.includes('ryzen') || cpu.includes('amd')) return 'AMD';
  if (cpu.includes('intel') || cpu.includes('core i')) return 'Intel';
  if (gpu.includes('radeon') || gpu.includes('rx ')) return 'AMD';
  if (gpu.includes('geforce') || gpu.includes('rtx') || gpu.includes('nvidia')) return 'NVIDIA';

  return null;
}

/**
 * Extract badges from title and description
 */
function extractBadges(title: string, description: string, hasDiscount: boolean): string[] {
  const badges: string[] = [];
  const text = `${title} ${description}`.toLowerCase();

  if (hasDiscount) badges.push('SALE');
  if (text.includes('хит') || text.includes('топ') || text.includes('популярн')) badges.push('TOP');
  if (text.includes('новинк') || text.includes('new')) badges.push('NEW');
  if (text.includes('premium') || text.includes('премиум') || text.includes('pro ')) badges.push('PRO');

  return badges;
}

/**
 * Format price for display
 */
function formatPrice(amount: number): string {
  return new Intl.NumberFormat('ru-RU', {
    style: 'currency',
    currency: 'RUB',
    maximumFractionDigits: 0,
  }).format(amount);
}

/**
 * Transform VKProduct to CatalogProduct
 */
export function toCatalogProduct(product: VKProduct): CatalogProduct {
  const now = new Date();
  const createdAt = new Date(product.createdAt);
  const daysSinceCreation = Math.floor(
    (now.getTime() - createdAt.getTime()) / (1000 * 60 * 60 * 24)
  );

  let discountPercent: number | null = null;
  if (product.price.hasDiscount && product.price.originalAmount) {
    discountPercent = Math.round(
      ((product.price.originalAmount - product.price.amount) /
        product.price.originalAmount) *
        100
    );
  }

  // Extract specs from description
  const specs = extractSpecs(product.description);
  const platformBadge = getPlatformBadge(specs);
  const badges = extractBadges(product.title, product.description, product.price.hasDiscount);

  return {
    ...product,
    isNew: daysSinceCreation <= 7,
    discountPercent,
    displayPrice: product.price.formatted,
    displayOriginalPrice: product.price.originalFormatted || null,

    // Additional fields for VKProductCard
    specs,
    platformBadge,
    badges,
    formattedPrice: formatPrice(product.price.amount),
    formattedOriginalPrice: product.price.originalAmount ? formatPrice(product.price.originalAmount) : null,
    hasDiscount: product.price.hasDiscount,
    inStock: product.availability === 'in_stock',
    productUrl: `/product/${product.slug}`,
    categoryName: product.category.name,
  };
}

/**
 * Transform array of VKProducts to CatalogProducts
 */
export function toCatalogProducts(products: VKProduct[]): CatalogProduct[] {
  return products.map(toCatalogProduct);
}

/**
 * Check if filters are active (not default)
 */
export function hasActiveFilters(filters: CatalogFilters): boolean {
  return (
    filters.search.trim() !== '' ||
    filters.categoryIds.length > 0 ||
    filters.priceRange !== null ||
    filters.sort !== DEFAULT_CATALOG_FILTERS.sort
  );
}

/**
 * Count number of active filters
 */
export function countActiveFilters(filters: CatalogFilters): number {
  let count = 0;
  if (filters.search.trim() !== '') count++;
  if (filters.categoryIds.length > 0) count++;
  if (filters.priceRange !== null) count++;
  if (filters.sort !== DEFAULT_CATALOG_FILTERS.sort) count++;
  return count;
}
