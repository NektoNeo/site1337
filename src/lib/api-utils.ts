import { NextResponse } from 'next/server';

// ============================================================================
// ERROR CODES / RESPONSES
// ============================================================================

export const ERROR_CODES = {
  INTERNAL_ERROR: 'INTERNAL_ERROR',
  BAD_REQUEST: 'BAD_REQUEST',
  NOT_FOUND: 'NOT_FOUND',
} as const;

export type ErrorCode = (typeof ERROR_CODES)[keyof typeof ERROR_CODES];

export function errorResponse(
  code: ErrorCode | string,
  message: string,
  status: number = 500,
  extra?: Record<string, unknown>
) {
  return NextResponse.json(
    {
      error: {
        code,
        message,
        ...(extra ?? {}),
      },
    },
    { status }
  );
}

export type CachePreset = {
  /** Allow caching by browsers/CDNs */
  public?: boolean;
  /** Browser max-age in seconds */
  maxAge: number;
  /** CDN s-maxage in seconds */
  sMaxage?: number;
  /** stale-while-revalidate in seconds */
  staleWhileRevalidate?: number;
  /** Add immutable directive */
  immutable?: boolean;
};

export const CACHE_PRESETS = {
  /** Long-lived content (albums/categories, works) */
  STATIC: {
    public: true,
    maxAge: 60 * 10, // 10 min browser
    sMaxage: 60 * 60, // 1h CDN
    staleWhileRevalidate: 60 * 60 * 24, // 24h
  } satisfies CachePreset,

  /** Short-ish caching for product lists */
  SEMI_STATIC: {
    public: true,
    maxAge: 30, // 30s browser
    sMaxage: 60 * 5, // 5 min CDN
    staleWhileRevalidate: 60 * 30, // 30 min
  } satisfies CachePreset,

  /** No caching */
  NO_STORE: {
    public: false,
    maxAge: 0,
    sMaxage: 0,
    staleWhileRevalidate: 0,
  } satisfies CachePreset,
} as const;

export function buildCacheControl(preset: CachePreset): string {
  const parts: string[] = [];
  parts.push(preset.public ? 'public' : 'private');
  parts.push(`max-age=${Math.max(0, preset.maxAge)}`);
  if (typeof preset.sMaxage === 'number') parts.push(`s-maxage=${Math.max(0, preset.sMaxage)}`);
  if (typeof preset.staleWhileRevalidate === 'number') {
    parts.push(`stale-while-revalidate=${Math.max(0, preset.staleWhileRevalidate)}`);
  }
  if (preset.immutable) parts.push('immutable');
  return parts.join(', ');
}

export function successResponse<T>(
  data: T,
  opts?: {
    status?: number;
    cache?: CachePreset;
    etag?: string;
    headers?: Record<string, string>;
  }
) {
  const status = opts?.status ?? 200;
  const headers: Record<string, string> = {
    ...(opts?.headers ?? {}),
  };

  if (opts?.cache) headers['Cache-Control'] = buildCacheControl(opts.cache);
  if (opts?.etag) headers['ETag'] = opts.etag;

  return NextResponse.json(data, { status, headers });
}

// ============================================================================
// ETAG HELPERS
// ============================================================================

function fnv1a(str: string): string {
  let hash = 0x811c9dc5;
  for (let i = 0; i < str.length; i++) {
    hash ^= str.charCodeAt(i);
    // 32-bit FNV-1a prime
    hash = Math.imul(hash, 0x01000193);
  }
  // >>>0 forces unsigned 32-bit
  return (hash >>> 0).toString(16);
}

export function generateETag(payload: unknown): string {
  const json = JSON.stringify(payload);
  const hash = fnv1a(json);
  // Weak ETag is plenty for API payloads
  return `W/"${hash}"`;
}

export function checkETagMatch(ifNoneMatch: string | null, etag: string): boolean {
  if (!ifNoneMatch) return false;
  const raw = ifNoneMatch.trim();
  if (raw === '*') return true;
  return raw
    .split(',')
    .map((s) => s.trim())
    .some((candidate) => candidate === etag);
}

export function notModifiedResponse(etag: string, cache?: CachePreset) {
  const headers: Record<string, string> = {
    ETag: etag,
  };
  if (cache) headers['Cache-Control'] = buildCacheControl(cache);

  return new NextResponse(null, { status: 304, headers });
}

// ============================================================================
// FIELDSETS (sparse responses)
// ============================================================================

export function parseFieldsParam(fieldsRaw: string | null): string[] {
  if (!fieldsRaw) return [];
  return fieldsRaw
    .split(',')
    .map((f) => f.trim())
    .filter(Boolean);
}

function getDeep(obj: any, path: string[]): unknown {
  let cur = obj;
  for (const key of path) {
    if (cur == null) return undefined;
    cur = cur[key];
  }
  return cur;
}

function setDeep(target: any, path: string[], value: unknown) {
  let cur = target;
  for (let i = 0; i < path.length; i++) {
    const key = path[i]!;
    if (i === path.length - 1) {
      cur[key] = value;
      return;
    }
    if (cur[key] == null || typeof cur[key] !== 'object') cur[key] = {};
    cur = cur[key];
  }
}

export function filterArrayFields<T extends Record<string, any>>(
  items: T[],
  fields: string[]
): Array<Partial<T>> {
  if (!fields.length) return items;

  const paths = fields.map((f) => f.split('.').filter(Boolean));
  return items.map((item) => {
    const out: Record<string, unknown> = {};
    for (const p of paths) {
      if (!p.length) continue;
      const v = getDeep(item, p);
      if (v !== undefined) setDeep(out, p, v);
    }
    return out as Partial<T>;
  });
}

// ============================================================================
// CORS
// ============================================================================

const DEFAULT_CORS_HEADERS: Record<string, string> = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'GET,POST,OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type, Authorization, If-None-Match',
  'Access-Control-Max-Age': '86400',
};

export function corsPreflightResponse() {
  return new NextResponse(null, { status: 204, headers: DEFAULT_CORS_HEADERS });
}

// ============================================================================
// TIMING
// ============================================================================

export function createTimingContext() {
  const start = Date.now();
  return {
    getElapsedMs: () => `${Date.now() - start}ms`,
  };
}

