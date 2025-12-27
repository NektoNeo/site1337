/**
 * Product Database Access Layer
 * Optimized queries with efficient pagination and caching support
 *
 * @module src/lib/db/products
 */

import { prisma, Prisma, Product } from '@/lib/prisma';
import { getCache, setCache, invalidateCache } from './cache';

// ============================================================================
// TYPES
// ============================================================================

export interface ProductFilters {
  categoryId?: string;
  brandId?: string;
  isActive?: boolean;
  isFeatured?: boolean;
  priceMin?: number;
  priceMax?: number;
  search?: string;
  inStock?: boolean;
  onSale?: boolean;
}

export interface ProductSortOption {
  field: 'price' | 'createdAt' | 'name' | 'stock';
  direction: 'asc' | 'desc';
}

export interface PaginationParams {
  page?: number;
  pageSize?: number;
  cursor?: string; // For cursor-based pagination (more efficient for large datasets)
}

export interface ProductListResult {
  products: ProductWithRelations[];
  total: number;
  page: number;
  pageSize: number;
  totalPages: number;
  hasMore: boolean;
  nextCursor?: string;
}

export interface ProductWithRelations extends Product {
  category?: {
    id: string;
    name: string;
    slug: string;
  };
  brand?: {
    id: string;
    name: string;
    slug: string;
  } | null;
  images?: {
    id: string;
    url: string;
    alt: string | null;
    isPrimary: boolean;
  }[];
}

// ============================================================================
// CONSTANTS
// ============================================================================

const DEFAULT_PAGE_SIZE = 20;
const MAX_PAGE_SIZE = 100;
const CACHE_TTL = 5 * 60 * 1000; // 5 minutes

// Select only required fields for list views (optimization)
const PRODUCT_LIST_SELECT = {
  id: true,
  sku: true,
  name: true,
  slug: true,
  price: true,
  salePrice: true,
  stock: true,
  isActive: true,
  isFeatured: true,
  specs: true,
  categoryId: true,
  brandId: true,
  createdAt: true,
  updatedAt: true,
  category: {
    select: {
      id: true,
      name: true,
      slug: true,
    },
  },
  brand: {
    select: {
      id: true,
      name: true,
      slug: true,
    },
  },
  images: {
    select: {
      id: true,
      url: true,
      alt: true,
      isPrimary: true,
    },
    where: { isPrimary: true },
    take: 1,
  },
} satisfies Prisma.ProductSelect;

// Full product select for detail view
const PRODUCT_DETAIL_SELECT = {
  ...PRODUCT_LIST_SELECT,
  description: true,
  vkItemId: true,
  vkSyncedAt: true,
  images: {
    select: {
      id: true,
      url: true,
      alt: true,
      isPrimary: true,
      sortOrder: true,
    },
    orderBy: [{ isPrimary: 'desc' as const }, { sortOrder: 'asc' as const }],
  },
} satisfies Prisma.ProductSelect;

// ============================================================================
// HELPER FUNCTIONS
// ============================================================================

/**
 * Build WHERE clause from filters
 * Uses AND conditions for all filters
 */
function buildWhereClause(filters: ProductFilters): Prisma.ProductWhereInput {
  const conditions: Prisma.ProductWhereInput[] = [];

  // Category filter - uses index (categoryId, isActive, price)
  if (filters.categoryId) {
    conditions.push({ categoryId: filters.categoryId });
  }

  // Brand filter - uses index (brandId, isActive, price)
  if (filters.brandId) {
    conditions.push({ brandId: filters.brandId });
  }

  // Active filter
  if (filters.isActive !== undefined) {
    conditions.push({ isActive: filters.isActive });
  }

  // Featured filter - uses index (isActive, isFeatured, createdAt)
  if (filters.isFeatured !== undefined) {
    conditions.push({ isFeatured: filters.isFeatured });
  }

  // Price range - uses index (isActive, price)
  if (filters.priceMin !== undefined || filters.priceMax !== undefined) {
    const priceCondition: Prisma.DecimalFilter<"Product"> = {};
    if (filters.priceMin !== undefined) {
      priceCondition.gte = filters.priceMin;
    }
    if (filters.priceMax !== undefined) {
      priceCondition.lte = filters.priceMax;
    }
    conditions.push({ price: priceCondition });
  }

  // In stock filter - uses index (isActive, stock)
  if (filters.inStock) {
    conditions.push({ stock: { gt: 0 } });
  }

  // On sale filter - uses index (isActive, salePrice)
  if (filters.onSale) {
    conditions.push({ salePrice: { not: null } });
  }

  // Search filter - consider adding PostgreSQL full-text search for better performance
  if (filters.search && filters.search.trim()) {
    const searchTerm = filters.search.trim();
    conditions.push({
      OR: [
        { name: { contains: searchTerm, mode: 'insensitive' } },
        { description: { contains: searchTerm, mode: 'insensitive' } },
        { sku: { contains: searchTerm, mode: 'insensitive' } },
      ],
    });
  }

  return conditions.length > 0 ? { AND: conditions } : {};
}

/**
 * Build ORDER BY clause from sort option
 * Ensures we always have a deterministic sort by adding id as secondary sort
 */
function buildOrderByClause(
  sort?: ProductSortOption
): Prisma.ProductOrderByWithRelationInput[] {
  const defaultSort: Prisma.ProductOrderByWithRelationInput[] = [
    { createdAt: 'desc' },
    { id: 'asc' }, // Deterministic secondary sort
  ];

  if (!sort) {
    return defaultSort;
  }

  return [{ [sort.field]: sort.direction }, { id: 'asc' }];
}

/**
 * Generate cache key for product queries
 */
function getProductListCacheKey(
  filters: ProductFilters,
  sort?: ProductSortOption,
  pagination?: PaginationParams
): string {
  const parts = [
    'products:list',
    JSON.stringify(filters),
    JSON.stringify(sort || {}),
    JSON.stringify(pagination || {}),
  ];
  return parts.join(':');
}

// ============================================================================
// MAIN QUERY FUNCTIONS
// ============================================================================

/**
 * Get products with filtering, sorting, and pagination
 * Uses offset-based pagination (suitable for most e-commerce scenarios)
 *
 * Performance Notes:
 * - Uses composite indexes for efficient filtering
 * - Limits selected fields for list views
 * - Caches results for 5 minutes
 *
 * @example
 * // Get active products in a category, sorted by price
 * const result = await getProducts(
 *   { categoryId: 'cat-123', isActive: true },
 *   { field: 'price', direction: 'asc' },
 *   { page: 1, pageSize: 20 }
 * );
 */
export async function getProducts(
  filters: ProductFilters = {},
  sort?: ProductSortOption,
  pagination: PaginationParams = {}
): Promise<ProductListResult> {
  // Normalize pagination
  const page = Math.max(1, pagination.page || 1);
  const pageSize = Math.min(MAX_PAGE_SIZE, Math.max(1, pagination.pageSize || DEFAULT_PAGE_SIZE));
  const skip = (page - 1) * pageSize;

  // Check cache first
  const cacheKey = getProductListCacheKey(filters, sort, { page, pageSize });
  const cached = getCache<ProductListResult>(cacheKey);
  if (cached) {
    return cached;
  }

  // Build query
  const where = buildWhereClause(filters);
  const orderBy = buildOrderByClause(sort);

  // Execute count and data queries in parallel
  const [total, products] = await Promise.all([
    prisma.product.count({ where }),
    prisma.product.findMany({
      where,
      orderBy,
      skip,
      take: pageSize,
      select: PRODUCT_LIST_SELECT,
    }),
  ]);

  const totalPages = Math.ceil(total / pageSize);
  const hasMore = page < totalPages;

  const result: ProductListResult = {
    products: products as ProductWithRelations[],
    total,
    page,
    pageSize,
    totalPages,
    hasMore,
    nextCursor: hasMore ? products[products.length - 1]?.id : undefined,
  };

  // Cache result
  setCache(cacheKey, result, CACHE_TTL);

  return result;
}

/**
 * Get products using cursor-based pagination
 * More efficient for large datasets and infinite scroll
 *
 * @example
 * // First page
 * const first = await getProductsCursor({ isActive: true }, undefined, { pageSize: 20 });
 *
 * // Next page using cursor
 * const next = await getProductsCursor({ isActive: true }, undefined, {
 *   cursor: first.nextCursor,
 *   pageSize: 20
 * });
 */
export async function getProductsCursor(
  filters: ProductFilters = {},
  sort?: ProductSortOption,
  pagination: { cursor?: string; pageSize?: number } = {}
): Promise<ProductListResult> {
  const pageSize = Math.min(MAX_PAGE_SIZE, Math.max(1, pagination.pageSize || DEFAULT_PAGE_SIZE));

  const where = buildWhereClause(filters);
  const orderBy = buildOrderByClause(sort);

  // Build cursor condition
  const cursorCondition = pagination.cursor
    ? { cursor: { id: pagination.cursor }, skip: 1 }
    : {};

  // Execute queries
  const [total, products] = await Promise.all([
    prisma.product.count({ where }),
    prisma.product.findMany({
      where,
      orderBy,
      take: pageSize + 1, // Fetch one extra to check if there's more
      ...cursorCondition,
      select: PRODUCT_LIST_SELECT,
    }),
  ]);

  // Check if there's a next page
  const hasMore = products.length > pageSize;
  if (hasMore) {
    products.pop(); // Remove the extra item
  }

  const totalPages = Math.ceil(total / pageSize);

  return {
    products: products as ProductWithRelations[],
    total,
    page: 1, // Not applicable for cursor pagination
    pageSize,
    totalPages,
    hasMore,
    nextCursor: hasMore ? products[products.length - 1]?.id : undefined,
  };
}

/**
 * Get a single product by ID with full details
 *
 * @example
 * const product = await getProductById('prod-123');
 */
export async function getProductById(id: string): Promise<ProductWithRelations | null> {
  const cacheKey = `product:${id}`;
  const cached = getCache<ProductWithRelations>(cacheKey);
  if (cached) {
    return cached;
  }

  const product = await prisma.product.findUnique({
    where: { id },
    select: PRODUCT_DETAIL_SELECT,
  });

  if (product) {
    setCache(cacheKey, product, CACHE_TTL);
  }

  return product as ProductWithRelations | null;
}

/**
 * Get a product by slug (for URL-friendly lookup)
 *
 * @example
 * const product = await getProductBySlug('nvidia-rtx-4090');
 */
export async function getProductBySlug(slug: string): Promise<ProductWithRelations | null> {
  const cacheKey = `product:slug:${slug}`;
  const cached = getCache<ProductWithRelations>(cacheKey);
  if (cached) {
    return cached;
  }

  const product = await prisma.product.findUnique({
    where: { slug },
    select: PRODUCT_DETAIL_SELECT,
  });

  if (product) {
    setCache(cacheKey, product, CACHE_TTL);
  }

  return product as ProductWithRelations | null;
}

/**
 * Get a product by SKU
 *
 * @example
 * const product = await getProductBySku('RTX4090-12GB');
 */
export async function getProductBySku(sku: string): Promise<ProductWithRelations | null> {
  const cacheKey = `product:sku:${sku}`;
  const cached = getCache<ProductWithRelations>(cacheKey);
  if (cached) {
    return cached;
  }

  const product = await prisma.product.findUnique({
    where: { sku },
    select: PRODUCT_DETAIL_SELECT,
  });

  if (product) {
    setCache(cacheKey, product, CACHE_TTL);
  }

  return product as ProductWithRelations | null;
}

/**
 * Get featured products for homepage
 * Uses index: (isActive, isFeatured, createdAt)
 */
export async function getFeaturedProducts(limit: number = 8): Promise<ProductWithRelations[]> {
  const cacheKey = `products:featured:${limit}`;
  const cached = getCache<ProductWithRelations[]>(cacheKey);
  if (cached) {
    return cached;
  }

  const products = await prisma.product.findMany({
    where: {
      isActive: true,
      isFeatured: true,
    },
    orderBy: [{ createdAt: 'desc' }],
    take: limit,
    select: PRODUCT_LIST_SELECT,
  });

  setCache(cacheKey, products, CACHE_TTL);

  return products as ProductWithRelations[];
}

/**
 * Get products on sale
 * Uses index: (isActive, salePrice)
 */
export async function getSaleProducts(limit: number = 12): Promise<ProductWithRelations[]> {
  const cacheKey = `products:sale:${limit}`;
  const cached = getCache<ProductWithRelations[]>(cacheKey);
  if (cached) {
    return cached;
  }

  const products = await prisma.product.findMany({
    where: {
      isActive: true,
      salePrice: { not: null },
    },
    orderBy: [{ updatedAt: 'desc' }],
    take: limit,
    select: PRODUCT_LIST_SELECT,
  });

  setCache(cacheKey, products, CACHE_TTL);

  return products as ProductWithRelations[];
}

/**
 * Get related products (same category, different product)
 */
export async function getRelatedProducts(
  productId: string,
  categoryId: string,
  limit: number = 4
): Promise<ProductWithRelations[]> {
  const cacheKey = `products:related:${productId}:${limit}`;
  const cached = getCache<ProductWithRelations[]>(cacheKey);
  if (cached) {
    return cached;
  }

  const products = await prisma.product.findMany({
    where: {
      categoryId,
      isActive: true,
      id: { not: productId },
    },
    orderBy: [{ isFeatured: 'desc' }, { createdAt: 'desc' }],
    take: limit,
    select: PRODUCT_LIST_SELECT,
  });

  setCache(cacheKey, products, CACHE_TTL);

  return products as ProductWithRelations[];
}

/**
 * Get products by multiple IDs (for cart, wishlist, etc.)
 * Efficient batch query
 */
export async function getProductsByIds(ids: string[]): Promise<ProductWithRelations[]> {
  if (ids.length === 0) return [];

  // Sort IDs for consistent cache key
  const sortedIds = [...ids].sort();
  const cacheKey = `products:byIds:${sortedIds.join(',')}`;
  const cached = getCache<ProductWithRelations[]>(cacheKey);
  if (cached) {
    return cached;
  }

  const products = await prisma.product.findMany({
    where: {
      id: { in: ids },
    },
    select: PRODUCT_LIST_SELECT,
  });

  // Maintain original order
  const productMap = new Map(products.map((p) => [p.id, p]));
  const orderedProducts = ids
    .map((id) => productMap.get(id))
    .filter((p): p is NonNullable<typeof p> => p !== undefined);

  setCache(cacheKey, orderedProducts, CACHE_TTL);

  return orderedProducts as ProductWithRelations[];
}

/**
 * Check stock availability for multiple products
 * Optimized for cart validation
 */
export async function checkStockAvailability(
  items: { productId: string; quantity: number }[]
): Promise<{ productId: string; available: boolean; stock: number }[]> {
  if (items.length === 0) return [];

  const productIds = items.map((i) => i.productId);

  const products = await prisma.product.findMany({
    where: { id: { in: productIds } },
    select: { id: true, stock: true, isActive: true },
  });

  const stockMap = new Map(products.map((p) => [p.id, p]));

  return items.map((item) => {
    const product = stockMap.get(item.productId);
    if (!product || !product.isActive) {
      return { productId: item.productId, available: false, stock: 0 };
    }
    return {
      productId: item.productId,
      available: product.stock >= item.quantity,
      stock: product.stock,
    };
  });
}

/**
 * Update product stock (transactional)
 * Used after order completion
 */
export async function decrementStock(
  items: { productId: string; quantity: number }[]
): Promise<void> {
  if (items.length === 0) return;

  // Use transaction for atomic updates
  await prisma.$transaction(
    items.map((item) =>
      prisma.product.update({
        where: { id: item.productId },
        data: {
          stock: {
            decrement: item.quantity,
          },
        },
      })
    )
  );

  // Invalidate product cache
  for (const item of items) {
    invalidateCache(`product:${item.productId}`);
  }
}

// ============================================================================
// CACHE INVALIDATION
// ============================================================================

/**
 * Invalidate all product-related caches
 * Call after product updates, imports, etc.
 */
export function invalidateProductCache(): void {
  invalidateCache('products:');
  invalidateCache('product:');
}

/**
 * Invalidate cache for a specific product
 */
export function invalidateProductCacheById(productId: string): void {
  invalidateCache(`product:${productId}`);
  invalidateCache('products:'); // Also invalidate list caches
}
