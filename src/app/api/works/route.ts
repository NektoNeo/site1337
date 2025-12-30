/**
 * Works Gallery API Route
 * GET /api/works - List portfolio/works gallery items
 *
 * Query parameters:
 * - fields: string (comma-separated list of fields to return)
 * - limit: number (max items to return, default: all)
 * - segment: string (filter by segment)
 * - tag: string (filter by tag)
 *
 * Features:
 * - ETag support for conditional requests (If-None-Match)
 * - Field filtering (sparse fieldsets)
 * - Cache-Control headers for CDN caching
 */

import { NextRequest, NextResponse } from 'next/server';
import { getWorksGallery, WorkItem } from '@/lib/gallery';
import {
  CACHE_PRESETS,
  successResponse,
  errorResponse,
  ERROR_CODES,
  generateETag,
  checkETagMatch,
  notModifiedResponse,
  parseFieldsParam,
  filterArrayFields,
  corsPreflightResponse,
  createTimingContext,
} from '@/lib/api-utils';

export const runtime = 'nodejs';

// Revalidate every hour (works are static data)
export const revalidate = 3600;

interface WorksApiResponse {
  works: Partial<WorkItem>[];
  total: number;
  filtered?: boolean;
}

/**
 * GET /api/works
 */
export async function GET(request: NextRequest) {
  const timing = createTimingContext();

  try {
    const { searchParams } = new URL(request.url);

    // Parse query parameters
    const fields = parseFieldsParam(searchParams.get('fields'));
    const limit = searchParams.get('limit')
      ? Math.min(100, Math.max(1, parseInt(searchParams.get('limit')!, 10)))
      : undefined;
    const segment = searchParams.get('segment');
    const tag = searchParams.get('tag');

    // Fetch all works
    let works = await getWorksGallery();
    let filtered = false;

    // Apply segment filter
    if (segment) {
      works = works.filter(
        (w) => w.segment?.toLowerCase() === segment.toLowerCase()
      );
      filtered = true;
    }

    // Apply tag filter
    if (tag) {
      works = works.filter((w) =>
        w.tags.some((t) => t.toLowerCase().includes(tag.toLowerCase()))
      );
      filtered = true;
    }

    // Apply limit
    if (limit && limit < works.length) {
      works = works.slice(0, limit);
      filtered = true;
    }

    // Generate ETag before field filtering (based on full data)
    const etag = generateETag({ works, segment, tag, limit });

    // Check If-None-Match header for conditional request
    const ifNoneMatch = request.headers.get('if-none-match');
    if (checkETagMatch(ifNoneMatch, etag)) {
      return notModifiedResponse(etag, CACHE_PRESETS.STATIC);
    }

    // Apply field filtering if requested
    const filteredWorks = fields.length > 0
      ? filterArrayFields(works, fields)
      : works;

    const response: WorksApiResponse = {
      works: filteredWorks as Partial<WorkItem>[],
      total: works.length,
      ...(filtered && { filtered: true }),
    };

    return successResponse(response, {
      cache: CACHE_PRESETS.STATIC,
      etag,
      headers: {
        'X-Response-Time': timing.getElapsedMs(),
      },
    });
  } catch (error) {
    console.error('[Works API] Error:', error);

    return errorResponse(
      ERROR_CODES.INTERNAL_ERROR,
      'Failed to fetch works gallery',
      500,
      { details: error instanceof Error ? error.message : String(error) }
    );
  }
}

/**
 * OPTIONS for CORS preflight
 */
export async function OPTIONS() {
  return corsPreflightResponse();
}
