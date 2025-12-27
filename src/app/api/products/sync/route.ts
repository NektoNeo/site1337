/**
 * Product Sync API Route
 * POST /api/products/sync - Trigger VK Market to database sync
 * GET /api/products/sync - Get sync status
 *
 * This endpoint requires authentication in production.
 * For now, it uses a simple API key check.
 */

import { NextRequest, NextResponse } from 'next/server';
import { getVKSyncService, SyncOptions } from '@/services/vk-sync.service';

// Disable caching for sync endpoint
export const dynamic = 'force-dynamic';

/**
 * Validate API key for sync operations
 * In production, replace with proper authentication
 */
function validateApiKey(request: NextRequest): boolean {
  const apiKey = request.headers.get('x-api-key');
  const syncApiKey = process.env.SYNC_API_KEY;

  // If no SYNC_API_KEY is set, allow in development
  if (!syncApiKey && process.env.NODE_ENV === 'development') {
    return true;
  }

  return apiKey === syncApiKey;
}

/**
 * GET /api/products/sync
 * Returns current sync status and statistics
 */
export async function GET(request: NextRequest) {
  try {
    // Validate API key
    if (!validateApiKey(request)) {
      return NextResponse.json(
        { error: { code: 'UNAUTHORIZED', message: 'Invalid or missing API key' } },
        { status: 401 }
      );
    }

    const syncService = getVKSyncService();
    const status = await syncService.getSyncStatus();

    return NextResponse.json({
      status: 'ok',
      data: status,
    });
  } catch (error) {
    console.error('Sync status API Error:', error);

    return NextResponse.json(
      {
        error: {
          code: 'INTERNAL_ERROR',
          message: 'Failed to get sync status',
          details: error instanceof Error ? error.message : undefined,
        },
      },
      { status: 500 }
    );
  }
}

/**
 * POST /api/products/sync
 * Triggers a sync from VK Market to local database
 *
 * Request body (optional):
 * {
 *   "maxProducts": number,     // Max products to sync (default: 1000)
 *   "albumId": number,         // Sync specific album only
 *   "forceUpdate": boolean,    // Force update all products
 *   "skipDeactivation": boolean, // Don't deactivate missing products
 *   "dryRun": boolean          // Don't actually save changes
 * }
 */
export async function POST(request: NextRequest) {
  try {
    // Validate API key
    if (!validateApiKey(request)) {
      return NextResponse.json(
        { error: { code: 'UNAUTHORIZED', message: 'Invalid or missing API key' } },
        { status: 401 }
      );
    }

    // Parse options from request body
    let options: SyncOptions = {};
    try {
      const body = await request.json();
      options = {
        maxProducts: typeof body.maxProducts === 'number' ? body.maxProducts : undefined,
        albumId: typeof body.albumId === 'number' ? body.albumId : undefined,
        forceUpdate: body.forceUpdate === true,
        skipDeactivation: body.skipDeactivation === true,
        dryRun: body.dryRun === true,
      };
    } catch {
      // Empty body is fine, use defaults
    }

    console.log('[Sync API] Starting sync with options:', options);

    const syncService = getVKSyncService();
    const result = await syncService.syncProducts(options);

    // Return appropriate status based on result
    const statusCode = result.success ? 200 : 207; // 207 = Multi-Status (partial success)

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
      { status: statusCode }
    );
  } catch (error) {
    console.error('Sync API Error:', error);

    return NextResponse.json(
      {
        error: {
          code: 'SYNC_FAILED',
          message: 'Failed to sync products',
          details: error instanceof Error ? error.message : undefined,
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
      'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type, Authorization, X-API-Key',
    },
  });
}
