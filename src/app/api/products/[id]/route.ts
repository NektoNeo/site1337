/**
 * Single Product API Route
 * GET /api/products/[id] - Get a single product by ID
 *
 * The ID format is: {ownerId}_{itemId} (e.g., "123456789_12345")
 * Or just the itemId if the group is known
 */

import { NextRequest, NextResponse } from 'next/server';
import { getVKApiService, VKApiServiceError } from '@/services/vk-api.service';
import { mapVKMarketItemToProduct } from '@/lib/vk-to-product';
import { VKProductDetailResponse, VKProductNotFoundError } from '@/types/vk-product';

// Cache configuration: revalidate every 5 minutes
export const revalidate = 300;

interface RouteParams {
  params: Promise<{
    id: string;
  }>;
}

/**
 * Parse product ID
 * Supports formats:
 * - "123456789_12345" (ownerId_itemId)
 * - "12345" (just itemId, will use default group)
 */
function parseProductId(id: string): { ownerId: number | null; itemId: number } {
  if (id.includes('_')) {
    const [ownerPart, itemPart] = id.split('_');
    return {
      ownerId: parseInt(ownerPart, 10),
      itemId: parseInt(itemPart, 10),
    };
  }

  return {
    ownerId: null,
    itemId: parseInt(id, 10),
  };
}

/**
 * GET /api/products/[id]
 */
export async function GET(request: NextRequest, { params }: RouteParams) {
  try {
    const { id } = await params;

    if (!id) {
      return NextResponse.json(
        {
          error: {
            code: 'INVALID_ID',
            message: 'Product ID is required',
          },
        },
        { status: 400 }
      );
    }

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

    const vkApi = getVKApiService();

    // If ownerId is not provided, resolve the default group ID
    let resolvedOwnerId = ownerId;
    if (!resolvedOwnerId) {
      resolvedOwnerId = await vkApi.resolveGroupId();
    }

    // Fetch the product from VK API
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

    // Map to internal Product format
    const product = mapVKMarketItemToProduct(vkItem);

    // Optionally fetch related products (same category or album)
    let relatedProducts = undefined;
    const includeRelated = request.nextUrl.searchParams.get('includeRelated') === 'true';

    if (includeRelated && vkItem.albums_ids && vkItem.albums_ids.length > 0) {
      try {
        // Get products from the same album
        const relatedResponse = await vkApi.getMarketItems(
          resolvedOwnerId,
          6, // Fetch 6 to have 5 after excluding current
          0,
          vkItem.albums_ids[0]
        );

        if (relatedResponse.items) {
          const { mapVKMarketItemsToProducts } = await import('@/lib/vk-to-product');
          relatedProducts = mapVKMarketItemsToProducts(
            relatedResponse.items.filter(item => item.id !== vkItem.id)
          ).slice(0, 5);
        }
      } catch {
        // Silently fail for related products - main product is more important
        console.warn('Failed to fetch related products');
      }
    }

    const result: VKProductDetailResponse = {
      product,
      relatedProducts,
    };

    return NextResponse.json(result, {
      headers: {
        'Cache-Control': 'public, s-maxage=300, stale-while-revalidate=60',
      },
    });
  } catch (error) {
    console.error('Product Detail API Error:', error);

    if (error instanceof VKProductNotFoundError) {
      return NextResponse.json(
        {
          error: {
            code: 'NOT_FOUND',
            message: error.message,
          },
        },
        { status: 404 }
      );
    }

    if (error instanceof VKApiServiceError) {
      // VK error code 15 = Access denied (private group or no access)
      if (error.vkErrorCode === 15) {
        return NextResponse.json(
          {
            error: {
              code: 'ACCESS_DENIED',
              message: 'Access to this product is denied',
            },
          },
          { status: 403 }
        );
      }

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
          message: 'Failed to fetch product',
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
