/**
 * VK Sync API Route
 * POST /api/vk/sync - Trigger sync from VK Market to local database
 * GET /api/vk/sync - Get sync status and cache statistics
 * DELETE /api/vk/sync - Clear VK API cache
 * 
 * This endpoint requires API key authentication in production.
 * 
 * @module src/app/api/vk/sync/route
 */

import { NextRequest, NextResponse } from 'next/server';
import { getVKSyncService, SyncOptions } from '@/services/vk-sync.service';
import { vkCache, invalidateAllVKCaches } from '@/lib/vk-cache';

// ============================================================================
// CONFIGURATION
// ============================================================================

export const dynamic = 'force-dynamic';

// ============================================================================
// AUTH
// ============================================================================

/**
 * Validate API key for sync operations
 */
function validateApiKey(request: NextRequest): boolean {
  const apiKey = request.headers.get('x-api-key');
  const syncApiKey = process.env.SYNC_API_KEY;

  // Allow in development without key
  if (!syncApiKey && process.env.NODE_ENV === 'development') {
    return true;
  }

  return apiKey === syncApiKey;
}

/**
 * Return unauthorized response
 */
function unauthorized(): NextResponse {
  return NextResponse.json(
    {
      error: {
        code: 'UNAUTHORIZED',
        message: 'Invalid or missing API key. Set X-API-Key header.',
      },
    },
    { status: 401 }
  );
}

// ============================================================================
// API HANDLERS
// ============================================================================

/**
 * GET /api/vk/sync
 * Get sync status and cache statistics
 */
export async function GET(request: NextRequest) {
  const startTime = Date.now();

  try {
    // Validate API key
    if (!validateApiKey(request)) {
      return unauthorized();
    }

    const syncService = getVKSyncService();
    const syncStatus = await syncService.getSyncStatus();
    const cacheStats = vkCache.getStats();

    return NextResponse.json(
      {
        status: 'ok',
        sync: {
          lastSync: syncStatus.lastSync?.toISOString() || null,
          totalProducts: syncStatus.totalProducts,
          activeProducts: syncStatus.activeProducts,
          totalCategories: syncStatus.totalCategories,
        },
        cache: {
          size: cacheStats.size,
          hits: cacheStats.hits,
          misses: cacheStats.misses,
          hitRate: `${(cacheStats.hitRate * 100).toFixed(2)}%`,
          oldestEntry: cacheStats.oldestEntry
            ? new Date(cacheStats.oldestEntry).toISOString()
            : null,
          newestEntry: cacheStats.newestEntry
            ? new Date(cacheStats.newestEntry).toISOString()
            : null,
        },
      },
      {
        headers: {
          'X-Response-Time': `${Date.now() - startTime}ms`,
        },
      }
    );
  } catch (error) {
    console.error('[VK Sync API] GET Error:', error);

    return NextResponse.json(
      {
        error: {
          code: 'INTERNAL_ERROR',
          message: 'Failed to get sync status',
          details: process.env.NODE_ENV === 'development'
            ? (error instanceof Error ? error.message : String(error))
            : undefined,
        },
      },
      { status: 500 }
    );
  }
}

/**
 * POST /api/vk/sync
 * Trigger VK Market to database sync
 * 
 * Request body (optional):
 * {
 *   "maxProducts": number,
 *   "albumId": number,
 *   "forceUpdate": boolean,
 *   "skipDeactivation": boolean,
 *   "dryRun": boolean,
 *   "clearCache": boolean
 * }
 */
export async function POST(request: NextRequest) {
  const startTime = Date.now();

  try {
    // Validate API key
    if (!validateApiKey(request)) {
      return unauthorized();
    }

    // Parse options from request body
    let options: SyncOptions & { clearCache?: boolean } = {};
    try {
      const body = await request.json();
      options = {
        maxProducts: typeof body.maxProducts === 'number' ? body.maxProducts : undefined,
        albumId: typeof body.albumId === 'number' ? body.albumId : undefined,
        forceUpdate: body.forceUpdate === true,
        skipDeactivation: body.skipDeactivation === true,
        dryRun: body.dryRun === true,
        clearCache: body.clearCache === true,
      };
    } catch {
      // Empty body is fine, use defaults
    }

    console.log('[VK Sync API] Starting sync with options:', options);

    // Clear cache if requested
    if (options.clearCache) {
      invalidateAllVKCaches();
      console.log('[VK Sync API] VK cache cleared');
    }

    // Run sync
    const syncService = getVKSyncService();
    const result = await syncService.syncProducts(options);

    // Clear cache after successful sync
    if (result.success && !options.dryRun) {
      invalidateAllVKCaches();
    }

    const statusCode = result.success ? 200 : 207; // 207 = Multi-Status

    return NextResponse.json(
      {
        status: result.success ? 'success' : 'partial',
        message: result.success
          ? 'Sync completed successfully'
          : `Sync completed with ${result.errors.length} error(s)`,
        data: {
          timestamp: result.timestamp.toISOString(),
          duration: `${result.duration}ms`,
          stats: result.stats,
          errors: result.errors.length > 0 ? result.errors : undefined,
        },
      },
      {
        status: statusCode,
        headers: {
          'X-Response-Time': `${Date.now() - startTime}ms`,
        },
      }
    );
  } catch (error) {
    console.error('[VK Sync API] POST Error:', error);

    return NextResponse.json(
      {
        error: {
          code: 'SYNC_FAILED',
          message: 'Failed to sync products',
          details: process.env.NODE_ENV === 'development'
            ? (error instanceof Error ? error.message : String(error))
            : undefined,
        },
      },
      { status: 500 }
    );
  }
}

/**
 * DELETE /api/vk/sync
 * Clear VK API cache
 */
export async function DELETE(request: NextRequest) {
  const startTime = Date.now();

  try {
    // Validate API key
    if (!validateApiKey(request)) {
      return unauthorized();
    }

    const beforeSize = vkCache.getStats().size;
    invalidateAllVKCaches();
    const afterSize = vkCache.getStats().size;

    return NextResponse.json(
      {
        status: 'ok',
        message: 'VK cache cleared',
        cleared: beforeSize - afterSize,
        remaining: afterSize,
      },
      {
        headers: {
          'X-Response-Time': `${Date.now() - startTime}ms`,
        },
      }
    );
  } catch (error) {
    console.error('[VK Sync API] DELETE Error:', error);

    return NextResponse.json(
      {
        error: {
          code: 'INTERNAL_ERROR',
          message: 'Failed to clear cache',
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
      'Access-Control-Allow-Methods': 'GET, POST, DELETE, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type, Authorization, X-API-Key',
      'Access-Control-Max-Age': '86400',
    },
  });
}
