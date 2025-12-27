/**
 * VK Categories (Albums) API Route
 * GET /api/vk/categories - List VK Market albums as categories
 * 
 * VK Market uses "albums" as product collections/categories.
 * This endpoint fetches all albums and maps them to a category format.
 * 
 * Query parameters:
 * - fresh: boolean (bypass cache)
 * 
 * @module src/app/api/vk/categories/route
 */

import { NextRequest, NextResponse } from 'next/server';
import { getVKApiService, VKApiServiceError } from '@/services/vk-api.service';
import { mapVKAlbumsToCollections } from '@/lib/vk-to-product';
import { VKProductCategoriesResponse } from '@/types/vk-product';
import { vkCache, vkCategoriesKey, VK_CACHE_TTL } from '@/lib/vk-cache';

// ============================================================================
// CONFIGURATION
// ============================================================================

// Disable Next.js default caching - we manage our own
export const dynamic = 'force-dynamic';

// ============================================================================
// API HANDLERS
// ============================================================================

/**
 * GET /api/vk/categories
 * Fetch all VK Market albums as categories
 */
export async function GET(request: NextRequest) {
  const startTime = Date.now();

  try {
    const { searchParams } = new URL(request.url);
    const fresh = searchParams.get('fresh') === 'true';

    // Generate cache key
    const cacheKey = vkCategoriesKey();

    // Check cache (unless fresh=true)
    if (!fresh) {
      const cached = vkCache.get<VKProductCategoriesResponse>(cacheKey);
      if (cached) {
        return NextResponse.json(cached, {
          headers: {
            'X-Cache': 'HIT',
            'X-Cache-Key': cacheKey,
            'X-Response-Time': `${Date.now() - startTime}ms`,
            'Cache-Control': 'public, s-maxage=3600, stale-while-revalidate=300',
          },
        });
      }
    }

    // Fetch from VK API
    const vkApi = getVKApiService();
    const albums = await vkApi.getAllMarketAlbums();

    // Map to internal format
    const categories = mapVKAlbumsToCollections(albums);

    // Sort: main albums first, then by name
    categories.sort((a, b) => {
      if (a.isMain && !b.isMain) return -1;
      if (!a.isMain && b.isMain) return 1;
      return a.name.localeCompare(b.name, 'ru');
    });

    // Filter out hidden categories
    const visibleCategories = categories.filter(c => !c.isHidden);

    // Build response
    const result: VKProductCategoriesResponse = {
      categories: visibleCategories,
      total: visibleCategories.length,
    };

    // Cache the result (longer TTL for categories - they change less frequently)
    vkCache.set(cacheKey, result, VK_CACHE_TTL.LONG);

    return NextResponse.json(result, {
      headers: {
        'X-Cache': 'MISS',
        'X-Cache-Key': cacheKey,
        'X-Response-Time': `${Date.now() - startTime}ms`,
        'X-VK-Total-Albums': String(albums.length),
        'Cache-Control': 'public, s-maxage=3600, stale-while-revalidate=300',
      },
    });
  } catch (error) {
    console.error('[VK Categories API] Error:', error);

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
          message: 'Failed to fetch VK categories',
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
