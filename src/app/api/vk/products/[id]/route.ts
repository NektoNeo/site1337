/**
 * VK Single Product API Route
 * GET /api/vk/products/[id] - Get a single product from VK Market
 * 
 * The ID can be in format:
 * - "ownerId_itemId" (e.g., "-123456789_12345")
 * - Just "itemId" (uses default group)
 * 
 * Query parameters:
 * - fresh: boolean (bypass cache)
 * - includeRelated: boolean (include related products)
 * 
 * @module src/app/api/vk/products/[id]/route
 */

import { NextRequest, NextResponse } from 'next/server';
import { getVKApiService, VKApiServiceError } from '@/services/vk-api.service';
import { mapVKMarketItemToProduct, mapVKMarketItemsToProducts } from '@/lib/vk-to-product';
import { VKProductDetailResponse } from '@/types/vk-product';
import { vkCache, vkProductKey, VK_CACHE_TTL } from '@/lib/vk-cache';

// ============================================================================
// CONFIGURATION
// ============================================================================

export const dynamic = 'force-dynamic';

// ============================================================================
// HELPERS
// ============================================================================

/**
 * Parse product ID from route parameter
 * Supports formats: "ownerId_itemId" or just "itemId"
 */
function parseProductId(id: string): { ownerId: number | null; itemId: number } {
  if (id.includes('_')) {
    const [ownerIdStr, itemIdStr] = id.split('_');
    return {
      ownerId: parseInt(ownerIdStr, 10),
      itemId: parseInt(itemIdStr, 10),
    };
  }

  return {
    ownerId: null,
    itemId: parseInt(id, 10),
  };
}

// ============================================================================
// API HANDLERS
// ============================================================================

/**
 * GET /api/vk/products/[id]
 * Fetch a single product from VK Market
 */
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const startTime = Date.now();
  const { id } = await params;

  try {
    const { searchParams } = new URL(request.url);
    const fresh = searchParams.get('fresh') === 'true';
    const includeRelated = searchParams.get('includeRelated') === 'true';

    // Generate cache key
    const cacheKey = vkProductKey(id);

    // Check cache (unless fresh=true)
    if (!fresh) {
      const cached = vkCache.get<VKProductDetailResponse>(cacheKey);
      if (cached) {
        return NextResponse.json(cached, {
          headers: {
            'X-Cache': 'HIT',
            'X-Cache-Key': cacheKey,
            'X-Response-Time': `${Date.now() - startTime}ms`,
            'Cache-Control': 'public, s-maxage=900, stale-while-revalidate=60',
          },
        });
      }
    }

    // Parse product ID
    const { ownerId, itemId } = parseProductId(id);

    if (isNaN(itemId)) {
      return NextResponse.json(
        {
          error: {
            code: 'INVALID_ID',
            message: 'Invalid product ID format',
          },
        },
        { status: 400 }
      );
    }

    // Fetch from VK API
    const vkApi = getVKApiService();

    // Get group ID if not provided
    const resolvedOwnerId = ownerId ?? await vkApi.resolveGroupId();

    // Fetch product
    const vkItem = await vkApi.getMarketItemById(resolvedOwnerId, itemId);

    if (!vkItem) {
      return NextResponse.json(
        {
          error: {
            code: 'NOT_FOUND',
            message: `Product with ID ${id} not found`,
          },
        },
        { status: 404 }
      );
    }

    // Map to internal format
    const product = mapVKMarketItemToProduct(vkItem);

    // Build response
    const result: VKProductDetailResponse = {
      product,
    };

    // Fetch related products if requested
    if (includeRelated && vkItem.albums_ids && vkItem.albums_ids.length > 0) {
      try {
        // Get products from the same album
        const albumId = vkItem.albums_ids[0];
        const relatedResponse = await vkApi.getProductsByAlbum(
          albumId,
          resolvedOwnerId,
          10
        );

        if (relatedResponse.items) {
          // Filter out the current product and map
          const relatedItems = relatedResponse.items.filter(
            item => item.id !== vkItem.id
          );
          result.relatedProducts = mapVKMarketItemsToProducts(relatedItems.slice(0, 4));
        }
      } catch (relatedError) {
        // Don't fail the request if related products fetch fails
        console.warn('[VK Product API] Failed to fetch related products:', relatedError);
      }
    }

    // Cache the result
    vkCache.set(cacheKey, result, VK_CACHE_TTL.MEDIUM);

    return NextResponse.json(result, {
      headers: {
        'X-Cache': 'MISS',
        'X-Cache-Key': cacheKey,
        'X-Response-Time': `${Date.now() - startTime}ms`,
        'X-VK-Item-Id': String(vkItem.id),
        'Cache-Control': 'public, s-maxage=900, stale-while-revalidate=60',
      },
    });
  } catch (error) {
    console.error('[VK Product API] Error:', error);

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
          message: 'Failed to fetch VK product',
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
