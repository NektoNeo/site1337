/**
 * Product Categories API Route
 * GET /api/products/categories - List product categories (VK Market Albums)
 */

import { NextResponse } from 'next/server';
import { getVKApiService, VKApiServiceError } from '@/services/vk-api.service';
import { mapVKAlbumsToCollections } from '@/lib/vk-to-product';
import { VKProductCategoriesResponse } from '@/types/vk-product';

// Cache configuration: revalidate every 10 minutes (categories change less often)
export const revalidate = 600;

/**
 * GET /api/products/categories
 */
export async function GET() {
  try {
    const vkApi = getVKApiService();

    // Fetch all albums from VK Market
    const albums = await vkApi.getAllMarketAlbums();

    // Map to internal ProductCollection format
    const categories = mapVKAlbumsToCollections(albums);

    // Filter out hidden albums and sort by product count
    const visibleCategories = categories
      .filter(c => !c.isHidden)
      .sort((a, b) => b.productCount - a.productCount);

    const result: VKProductCategoriesResponse = {
      categories: visibleCategories,
      total: visibleCategories.length,
    };

    return NextResponse.json(result, {
      headers: {
        'Cache-Control': 'public, s-maxage=600, stale-while-revalidate=120',
      },
    });
  } catch (error) {
    console.error('Categories API Error:', error);

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
          message: 'Failed to fetch categories',
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
