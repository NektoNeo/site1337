/**
 * VK Products API Route
 * GET /api/vk/products - List products directly from VK Market
 * 
 * This endpoint provides server-side caching to avoid VK API rate limits
 * and ensures fast response times for the frontend.
 * 
 * Query parameters:
 * - page: number (default: 1)
 * - pageSize: number (default: 20, max: 100)
 * - categoryId: string (VK album ID)
 * - search: string (search query)
 * - sortBy: 'date' | 'price_asc' | 'price_desc' | 'popular'
 * - priceFrom: number (in rubles)
 * - priceTo: number (in rubles)
 * - fresh: boolean (bypass cache)
 * 
 * @module src/app/api/vk/products/route
 */

import { NextRequest, NextResponse } from 'next/server';
import { getVKApiService, VKApiServiceError } from '@/services/vk-api.service';
import { mapVKMarketItemsToProducts } from '@/lib/vk-to-product';
import { VKProduct, VKProductsListResponse, VKProductsQueryParams } from '@/types/vk-product';
import { vkCache, vkProductsKey, VK_CACHE_TTL } from '@/lib/vk-cache';

// ============================================================================
// CONFIGURATION
// ============================================================================

// Disable Next.js default caching - we manage our own
export const dynamic = 'force-dynamic';

// VK API sort parameter mapping
const VK_SORT_MAP: Record<string, 0 | 1 | 2 | 3> = {
  'date': 1,        // by date desc
  'price_asc': 2,   // price ascending
  'price_desc': 3,  // price descending
  'popular': 0,     // default (by popularity)
};

// ============================================================================
// HELPERS
// ============================================================================

/**
 * Parse and validate query parameters
 */
function parseQueryParams(searchParams: URLSearchParams): VKProductsQueryParams & { fresh?: boolean } {
  const page = Math.max(1, parseInt(searchParams.get('page') || '1', 10));
  const pageSize = Math.min(100, Math.max(1, parseInt(searchParams.get('pageSize') || '20', 10)));
  const categoryId = searchParams.get('categoryId') || undefined;
  const search = searchParams.get('search')?.trim() || undefined;
  const sortBy = searchParams.get('sortBy') as VKProductsQueryParams['sortBy'] || undefined;
  const priceFrom = searchParams.get('priceFrom')
    ? parseInt(searchParams.get('priceFrom')!, 10)
    : undefined;
  const priceTo = searchParams.get('priceTo')
    ? parseInt(searchParams.get('priceTo')!, 10)
    : undefined;
  const fresh = searchParams.get('fresh') === 'true';

  return {
    page,
    pageSize,
    categoryId,
    search,
    sortBy,
    priceFrom,
    priceTo,
    fresh,
  };
}

/**
 * Sort products by specified criteria
 */
function sortProducts(products: VKProduct[], sortBy?: string): VKProduct[] {
  if (!sortBy) return products;

  const sorted = [...products];

  switch (sortBy) {
    case 'price_asc':
      sorted.sort((a, b) => a.price.amount - b.price.amount);
      break;
    case 'price_desc':
      sorted.sort((a, b) => b.price.amount - a.price.amount);
      break;
    case 'date':
      sorted.sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime());
      break;
    case 'popular':
      sorted.sort((a, b) => b.likesCount - a.likesCount);
      break;
  }

  return sorted;
}

/**
 * Filter products by price range
 */
function filterByPrice(
  products: VKProduct[],
  priceFrom?: number,
  priceTo?: number
): VKProduct[] {
  let filtered = products;

  if (priceFrom !== undefined) {
    filtered = filtered.filter(p => p.price.amount >= priceFrom);
  }
  if (priceTo !== undefined) {
    filtered = filtered.filter(p => p.price.amount <= priceTo);
  }

  return filtered;
}

// ============================================================================
// API HANDLERS
// ============================================================================

/**
 * GET /api/vk/products
 * Fetch products from VK Market with caching
 */
export async function GET(request: NextRequest) {
  const startTime = Date.now();

  try {
    const { searchParams } = new URL(request.url);
    const params = parseQueryParams(searchParams);

    // Generate cache key
    const cacheKey = vkProductsKey({
      page: params.page,
      pageSize: params.pageSize,
      categoryId: params.categoryId,
      search: params.search,
      sortBy: params.sortBy,
      priceFrom: params.priceFrom,
      priceTo: params.priceTo,
    });

    // Check cache (unless fresh=true)
    if (!params.fresh) {
      const cached = vkCache.get<VKProductsListResponse>(cacheKey);
      if (cached) {
        return NextResponse.json(cached, {
          headers: {
            'X-Cache': 'HIT',
            'X-Cache-Key': cacheKey,
            'X-Response-Time': `${Date.now() - startTime}ms`,
            'Cache-Control': 'public, s-maxage=300, stale-while-revalidate=60',
          },
        });
      }
    }

    // Fetch from VK API
    const vkApi = getVKApiService();

    // Calculate pagination offset
    const offset = (params.page! - 1) * params.pageSize!;
    const count = params.pageSize!;

    let response;

    // Use search endpoint if query provided
    if (params.search && params.search.length > 0) {
      response = await vkApi.searchMarketItems(params.search, undefined, {
        count,
        offset,
        priceFrom: params.priceFrom ? params.priceFrom * 100 : undefined, // Convert to kopeks
        priceTo: params.priceTo ? params.priceTo * 100 : undefined,
        sort: params.sortBy ? VK_SORT_MAP[params.sortBy] : undefined,
        albumId: params.categoryId ? parseInt(params.categoryId, 10) : undefined,
      });
    } else {
      // Regular market listing
      response = await vkApi.getMarketItems(
        undefined,
        count,
        offset,
        params.categoryId ? parseInt(params.categoryId, 10) : undefined
      );
    }

    // Map VK items to internal format
    let products = mapVKMarketItemsToProducts(response.items || []);

    // Apply sorting
    products = sortProducts(products, params.sortBy);

    // Apply price filtering (additional client-side filtering for precision)
    products = filterByPrice(products, params.priceFrom, params.priceTo);

    // Build response
    const result: VKProductsListResponse = {
      products,
      total: response.count,
      page: params.page!,
      pageSize: params.pageSize!,
      hasMore: offset + products.length < response.count,
    };

    // Cache the result
    vkCache.set(cacheKey, result, VK_CACHE_TTL.SHORT);

    return NextResponse.json(result, {
      headers: {
        'X-Cache': 'MISS',
        'X-Cache-Key': cacheKey,
        'X-Response-Time': `${Date.now() - startTime}ms`,
        'X-VK-Total': String(response.count),
        'Cache-Control': 'public, s-maxage=300, stale-while-revalidate=60',
      },
    });
  } catch (error) {
    console.error('[VK Products API] Error:', error);

    // Handle VK API specific errors
    if (error instanceof VKApiServiceError) {
      const status = error.code >= 400 && error.code < 600 ? error.code : 500;

      return NextResponse.json(
        {
          error: {
            code: 'VK_API_ERROR',
            message: error.message,
            vkErrorCode: error.vkErrorCode,
          },
        },
        {
          status,
          headers: {
            'X-Response-Time': `${Date.now() - startTime}ms`,
          },
        }
      );
    }

    // Generic error response
    return NextResponse.json(
      {
        error: {
          code: 'INTERNAL_ERROR',
          message: 'Failed to fetch VK products',
          details: process.env.NODE_ENV === 'development'
            ? (error instanceof Error ? error.message : String(error))
            : undefined,
        },
      },
      {
        status: 500,
        headers: {
          'X-Response-Time': `${Date.now() - startTime}ms`,
        },
      }
    );
  }
}

/**
 * OPTIONS for CORS preflight
 */
export async function OPTIONS() {
  return new NextResponse(null, {
    status: 200,
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type, Authorization',
      'Access-Control-Max-Age': '86400',
    },
  });
}
