/**
 * Single Product API Route
 * GET /api/products/[id] - Get a single product by ID or slug
 *
 * Supported formats:
 * - "{ownerId}_{itemId}" (e.g., "123456789_12345") - VK format
 * - "12345" (just itemId, will use default group)
 * - "product-slug" (slug format, will search by slug)
 */

import { NextRequest, NextResponse } from 'next/server';
import { getVKApiService, VKApiServiceError } from '@/services/vk-api.service';
import { mapVKMarketItemToProduct, mapVKMarketItemsToProducts } from '@/lib/vk-to-product';
import { VKProductDetailResponse, VKProductNotFoundError, VKProduct } from '@/types/vk-product';

// Cache configuration: revalidate every 5 minutes
export const revalidate = 300;

interface RouteParams {
  params: Promise<{
    id: string;
  }>;
}

/**
 * Check if the ID is a slug (contains non-numeric characters other than _)
 */
function isSlug(id: string): boolean {
  // VK IDs are numeric or ownerId_itemId format
  // Slugs contain letters, hyphens, etc.
  return /[a-zA-Z-]/.test(id);
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
 * Generate slug from product title (same algorithm as in vk-to-product.ts)
 */
function generateSlug(title: string): string {
  const translitMap: Record<string, string> = {
    'а': 'a', 'б': 'b', 'в': 'v', 'г': 'g', 'д': 'd', 'е': 'e', 'ё': 'yo',
    'ж': 'zh', 'з': 'z', 'и': 'i', 'й': 'y', 'к': 'k', 'л': 'l', 'м': 'm',
    'н': 'n', 'о': 'o', 'п': 'p', 'р': 'r', 'с': 's', 'т': 't', 'у': 'u',
    'ф': 'f', 'х': 'h', 'ц': 'ts', 'ч': 'ch', 'ш': 'sh', 'щ': 'sch', 'ъ': '',
    'ы': 'y', 'ь': '', 'э': 'e', 'ю': 'yu', 'я': 'ya',
  };

  return title
    .toLowerCase()
    .split('')
    .map(char => translitMap[char] || char)
    .join('')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
    .substring(0, 100);
}

/**
 * Find product by slug from all products
 */
async function findProductBySlug(
  vkApi: ReturnType<typeof getVKApiService>,
  slug: string,
  ownerId: number
): Promise<{ product: VKProduct | null; related: VKProduct[] }> {
  // Fetch all products (VK API limitation - need to search through all)
  let allProducts: VKProduct[] = [];
  let offset = 0;
  const batchSize = 100;
  let totalCount = 0;

  // First batch to get total count
  const firstResponse = await vkApi.getMarketItems(ownerId, batchSize, 0);
  totalCount = firstResponse.count;

  if (firstResponse.items) {
    const mapped = mapVKMarketItemsToProducts(firstResponse.items);
    allProducts = [...mapped];
  }

  // Check if product is in first batch
  let foundProduct = allProducts.find(p => p.slug === slug);

  // If not found and there are more products, fetch remaining
  if (!foundProduct && allProducts.length < totalCount) {
    offset = batchSize;

    while (offset < totalCount && !foundProduct) {
      const response = await vkApi.getMarketItems(ownerId, batchSize, offset);
      if (response.items) {
        const mapped = mapVKMarketItemsToProducts(response.items);
        allProducts = [...allProducts, ...mapped];
        foundProduct = mapped.find(p => p.slug === slug);
      }
      offset += batchSize;
    }
  }

  if (!foundProduct) {
    return { product: null, related: [] };
  }

  // Get related products (similar price range or same category)
  const related = allProducts
    .filter(p => p.id !== foundProduct!.id)
    .slice(0, 5);

  return { product: foundProduct, related };
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

    const vkApi = getVKApiService();
    let product: VKProduct | null = null;
    let relatedProducts: VKProduct[] = [];

    // Check if the ID is a slug (contains letters/hyphens)
    if (isSlug(id)) {
      // Slug-based lookup
      const resolvedOwnerId = await vkApi.resolveGroupId();
      const result = await findProductBySlug(vkApi, id, resolvedOwnerId);
      product = result.product;
      relatedProducts = result.related;

      if (!product) {
        return NextResponse.json(
          {
            error: {
              code: 'NOT_FOUND',
              message: `Product with slug "${id}" not found`,
            },
          },
          { status: 404 }
        );
      }
    } else {
      // ID-based lookup
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
      product = mapVKMarketItemToProduct(vkItem);

      // Optionally fetch related products (same category or album)
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
            relatedProducts = mapVKMarketItemsToProducts(
              relatedResponse.items.filter(item => item.id !== vkItem.id)
            ).slice(0, 5);
          }
        } catch {
          // Silently fail for related products - main product is more important
          console.warn('Failed to fetch related products');
        }
      }
    }

    const result = {
      product,
      related: relatedProducts,
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
