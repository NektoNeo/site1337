/**
 * Products API Route
 * GET /api/products - List products from VK Market
 *
 * Query parameters:
 * - page: number (default: 1)
 * - pageSize: number (default: 20, max: 100)
 * - categoryId: string (album ID)
 * - search: string (search query)
 * - sortBy: 'date' | 'price_asc' | 'price_desc' | 'popular'
 * - priceFrom: number
 * - priceTo: number
 */

import { NextRequest, NextResponse } from 'next/server';
import { getVKApiService, VKApiServiceError } from '@/services/vk-api.service';
import { mapVKMarketItemsToProducts } from '@/lib/vk-to-product';
import { VKProductsListResponse, VKProductsQueryParams } from '@/types/vk-product';

// Cache configuration: revalidate every 5 minutes
export const revalidate = 300;

// VK sort mapping
const SORT_MAP: Record<string, 0 | 1 | 2 | 3> = {
  'date': 1,        // by date desc
  'price_asc': 2,   // price ascending
  'price_desc': 3,  // price descending
  'popular': 0,     // default (by popularity/order)
};

/**
 * Parse and validate query parameters
 */
function parseQueryParams(searchParams: URLSearchParams): VKProductsQueryParams {
  const page = Math.max(1, parseInt(searchParams.get('page') || '1', 10));
  const pageSize = Math.min(100, Math.max(1, parseInt(searchParams.get('pageSize') || '20', 10)));
  const categoryId = searchParams.get('categoryId') || undefined;
  const search = searchParams.get('search') || undefined;
  const sortBy = searchParams.get('sortBy') as VKProductsQueryParams['sortBy'] || undefined;
  const priceFrom = searchParams.get('priceFrom')
    ? parseInt(searchParams.get('priceFrom')!, 10)
    : undefined;
  const priceTo = searchParams.get('priceTo')
    ? parseInt(searchParams.get('priceTo')!, 10)
    : undefined;

  return {
    page,
    pageSize,
    categoryId,
    search,
    sortBy,
    priceFrom,
    priceTo,
  };
}

/**
 * GET /api/products
 */
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const params = parseQueryParams(searchParams);

    const vkApi = getVKApiService();

    // Calculate offset for pagination
    const offset = (params.page! - 1) * params.pageSize!;
    const count = params.pageSize!;

    let response;

    // If search query is provided, use search endpoint
    if (params.search && params.search.trim().length > 0) {
      response = await vkApi.searchMarketItems(params.search, undefined, {
        count,
        offset,
        priceFrom: params.priceFrom ? params.priceFrom * 100 : undefined, // Convert to kopeks
        priceTo: params.priceTo ? params.priceTo * 100 : undefined,
        sort: params.sortBy ? SORT_MAP[params.sortBy] : undefined,
        albumId: params.categoryId ? parseInt(params.categoryId, 10) : undefined,
      });
    } else {
      // Use regular market.get
      response = await vkApi.getMarketItems(
        undefined,
        count,
        offset,
        params.categoryId ? parseInt(params.categoryId, 10) : undefined
      );
    }

    // Map VK items to internal Product format
    const products = mapVKMarketItemsToProducts(response.items || []);

    // Sort products if needed (VK API sorting is limited)
    if (params.sortBy) {
      switch (params.sortBy) {
        case 'price_asc':
          products.sort((a, b) => a.price.amount - b.price.amount);
          break;
        case 'price_desc':
          products.sort((a, b) => b.price.amount - a.price.amount);
          break;
        case 'date':
          products.sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime());
          break;
        case 'popular':
          products.sort((a, b) => b.likesCount - a.likesCount);
          break;
      }
    }

    // Filter by price if needed (additional client-side filtering)
    let filteredProducts = products;
    if (params.priceFrom !== undefined) {
      filteredProducts = filteredProducts.filter(p => p.price.amount >= params.priceFrom!);
    }
    if (params.priceTo !== undefined) {
      filteredProducts = filteredProducts.filter(p => p.price.amount <= params.priceTo!);
    }

    const result: VKProductsListResponse = {
      products: filteredProducts,
      total: response.count,
      page: params.page!,
      pageSize: params.pageSize!,
      hasMore: offset + filteredProducts.length < response.count,
    };

    return NextResponse.json(result, {
      headers: {
        'Cache-Control': 'public, s-maxage=300, stale-while-revalidate=60',
      },
    });
  } catch (error) {
    console.error('Products API Error:', error);

    if (error instanceof VKApiServiceError) {
      return NextResponse.json(
        {
          error: {
            code: 'VK_API_ERROR',
            message: error.message,
            vkErrorCode: error.vkErrorCode,
          },
        },
        { status: error.code >= 400 && error.code < 600 ? error.code : 500 }
      );
    }

    return NextResponse.json(
      {
        error: {
          code: 'INTERNAL_ERROR',
          message: 'Failed to fetch products',
        },
      },
      { status: 500 }
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
    },
  });
}
