# Database Optimization Guide for VA-PC E-commerce

This document provides comprehensive database optimization recommendations for the VA-PC e-commerce platform.

## Table of Contents

1. [Connection Pool Configuration](#connection-pool-configuration)
2. [Schema Optimization](#schema-optimization)
3. [Query Performance](#query-performance)
4. [Caching Strategy](#caching-strategy)
5. [VK Product Sync](#vk-product-sync)
6. [Monitoring and Maintenance](#monitoring-and-maintenance)

---

## Connection Pool Configuration

### PostgreSQL Connection Pool Tuning

The connection pool is critical for application performance. Configure it in your `.env` file:

```env
# Development (lower values)
DATABASE_URL="postgresql://user:password@localhost:5432/vapc?connection_limit=5&pool_timeout=10"

# Production (optimized values)
DATABASE_URL="postgresql://user:password@host:5432/vapc?connection_limit=10&pool_timeout=20&connect_timeout=10"
```

### Recommended Connection Pool Settings

| Environment | `connection_limit` | `pool_timeout` | Rationale |
|-------------|-------------------|----------------|-----------|
| Development | 2-5 | 10s | Low load, quick iteration |
| Staging | 5-10 | 15s | Testing with moderate load |
| Production (1 instance) | 10-20 | 20s | Single server deployment |
| Production (multiple) | 5-10 per instance | 20s | Distributed across instances |

### Formula for Connection Limit

```
connection_limit = min(
  (num_cpus * 2) + 1,
  (max_postgres_connections - reserved) / num_app_instances
)
```

Example for 4-CPU server with 2 app instances and PostgreSQL max_connections=100:
```
connection_limit = min((4 * 2) + 1, (100 - 20) / 2) = min(9, 40) = 9
```

### Prisma Client Configuration

Update `prisma/schema.prisma` for production:

```prisma
generator client {
  provider        = "prisma-client-js"
  previewFeatures = ["metrics", "tracing"]  // Enable for monitoring
}

datasource db {
  provider = "postgresql"
  url      = env("DATABASE_URL")
}
```

### Enhanced Prisma Client Initialization

```typescript
// src/lib/prisma.ts
import { PrismaClient } from '@prisma/client';

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined;
};

const prismaClientOptions = {
  log: process.env.NODE_ENV === 'development'
    ? ['query', 'error', 'warn'] as const
    : ['error'] as const,
  // Enable metrics in production
  ...(process.env.NODE_ENV === 'production' && {
    // Slow query logging (queries > 100ms)
    log: [
      { level: 'query', emit: 'event' },
      { level: 'error', emit: 'stdout' },
    ],
  }),
};

export const prisma = globalForPrisma.prisma ?? new PrismaClient(prismaClientOptions);

// Log slow queries in production
if (process.env.NODE_ENV === 'production') {
  prisma.$on('query', (e) => {
    if (e.duration > 100) {
      console.warn(`Slow query (${e.duration}ms): ${e.query}`);
    }
  });
}

if (process.env.NODE_ENV !== 'production') {
  globalForPrisma.prisma = prisma;
}
```

---

## Schema Optimization

### Index Strategy

The optimized schema (`prisma/schema.optimized.prisma`) includes:

#### Composite Indexes for Common Queries

```prisma
model Product {
  // ... fields ...

  // Category browsing with price sort
  @@index([categoryId, isActive, price])

  // Category browsing with date sort
  @@index([categoryId, isActive, createdAt])

  // Featured products query
  @@index([isActive, isFeatured, createdAt])

  // Stock management
  @@index([isActive, stock])

  // VK sync optimization
  @@index([vkOwnerId, vkItemId])
}
```

#### Index Design Principles

1. **Composite Index Order Matters**: Put equality conditions first, then range conditions
   ```sql
   -- Good: categoryId = X AND isActive = true ORDER BY price
   @@index([categoryId, isActive, price])

   -- Bad: price is range, should be last
   @@index([price, categoryId, isActive])
   ```

2. **Avoid Redundant Indexes**: `@unique` already creates an index
   ```prisma
   // WRONG - email has @unique, index is redundant
   email String @unique
   @@index([email])

   // CORRECT
   email String @unique
   ```

3. **Cover Common Query Patterns**: Analyze slow query log and add indexes for:
   - Filtering conditions
   - Sort columns
   - Join columns

### Applying Schema Changes

```bash
# Generate migration
npx prisma migrate dev --name add_composite_indexes

# Apply to production
npx prisma migrate deploy

# If using the optimized schema:
cp prisma/schema.optimized.prisma prisma/schema.prisma
npx prisma migrate dev --name optimize_indexes
```

---

## Query Performance

### N+1 Query Prevention

**Problem**: Loading products then loading images separately

```typescript
// BAD - N+1 queries
const products = await prisma.product.findMany();
for (const product of products) {
  product.images = await prisma.productImage.findMany({
    where: { productId: product.id }
  });
}
```

**Solution**: Use includes or selects

```typescript
// GOOD - Single query with join
const products = await prisma.product.findMany({
  include: {
    images: {
      where: { isPrimary: true },
      take: 1,
    },
    category: { select: { name: true, slug: true } },
  },
});
```

### Pagination Best Practices

#### Offset Pagination (Simple, Good for <10k records)

```typescript
const products = await prisma.product.findMany({
  skip: (page - 1) * pageSize,
  take: pageSize,
  orderBy: { createdAt: 'desc' },
});
```

#### Cursor Pagination (Efficient for large datasets)

```typescript
const products = await prisma.product.findMany({
  take: pageSize + 1,  // Fetch one extra to check hasMore
  cursor: lastCursor ? { id: lastCursor } : undefined,
  skip: lastCursor ? 1 : 0,  // Skip cursor item
  orderBy: { createdAt: 'desc' },
});
```

### Query Execution Analysis

Enable query logging and analyze with EXPLAIN:

```sql
-- Run in PostgreSQL to analyze query plan
EXPLAIN ANALYZE
SELECT * FROM "Product"
WHERE "categoryId" = 'xxx' AND "isActive" = true
ORDER BY price ASC
LIMIT 20;
```

**Good plan indicators**:
- `Index Scan` or `Index Only Scan`
- Low `actual time` values
- `Rows Removed` close to 0

**Bad plan indicators**:
- `Seq Scan` on large tables
- High `Rows Removed by Filter`
- `Sort` without index

---

## Caching Strategy

### Multi-Layer Caching

```
┌─────────────────────────────────────────────────────────┐
│                    Client Browser                        │
│   localStorage (cart), HTTP cache (static assets)       │
└────────────────────────┬────────────────────────────────┘
                         │
┌────────────────────────▼────────────────────────────────┐
│                    CDN / Edge                            │
│   Next.js ISR, static pages, API route caching          │
└────────────────────────┬────────────────────────────────┘
                         │
┌────────────────────────▼────────────────────────────────┐
│                  Application Cache                       │
│   In-memory cache (src/lib/db/cache.ts)                 │
│   TTL: 5 min for products, 2 min for cart               │
└────────────────────────┬────────────────────────────────┘
                         │
┌────────────────────────▼────────────────────────────────┐
│                  Database                                │
│   PostgreSQL with query cache                           │
└─────────────────────────────────────────────────────────┘
```

### Cache TTL Recommendations

| Data Type | TTL | Rationale |
|-----------|-----|-----------|
| Product list | 5 min | Low update frequency |
| Product detail | 5 min | Low update frequency |
| Featured products | 5 min | Rarely changes |
| Categories | 10 min | Very stable |
| Cart | 2 min | Needs freshness for stock |
| Order | No cache | Must be accurate |
| Order stats | 2 min | Admin dashboard only |

### Cache Invalidation

```typescript
import { invalidateCache } from '@/lib/db';

// After product update
invalidateCache('products:');
invalidateCache('product:');

// After order creation
invalidateCache('cart:');
invalidateCache('products:');  // Stock changed
```

### Upgrading to Redis

When scaling to multiple instances, upgrade to Redis:

```bash
npm install ioredis
```

```typescript
// src/lib/db/redis-cache.ts
import Redis from 'ioredis';

const redis = new Redis(process.env.REDIS_URL);

export async function getCache<T>(key: string): Promise<T | undefined> {
  const value = await redis.get(key);
  return value ? JSON.parse(value) : undefined;
}

export async function setCache<T>(key: string, value: T, ttl: number): Promise<void> {
  await redis.setex(key, Math.floor(ttl / 1000), JSON.stringify(value));
}

export async function invalidateCache(prefix: string): Promise<number> {
  const keys = await redis.keys(`${prefix}*`);
  if (keys.length === 0) return 0;
  return await redis.del(...keys);
}
```

---

## VK Product Sync

### Sync Strategies

#### Full Sync (Daily)
```typescript
// Run as cron job at low-traffic hours
await syncVKProducts({
  syncType: 'full',
  syncAlbums: true,
  batchSize: 100,
});
```

#### Incremental Sync (Hourly)
```typescript
// Only sync products updated in VK
await syncVKProducts({
  syncType: 'incremental',
  batchSize: 50,
});
```

### Preventing Duplicates

The optimized schema ensures uniqueness:

```prisma
model Product {
  vkItemId String? @unique  // Prevents duplicate VK products
}
```

### Sync Performance

| Batch Size | Products/sec | Memory Usage |
|------------|--------------|--------------|
| 10 | ~5 | Low |
| 50 | ~15 | Medium |
| 100 | ~20 | Higher |
| 200 | ~25 | High |

Recommendation: Use batch size of 50-100 for production syncs.

---

## Monitoring and Maintenance

### Key Metrics to Monitor

1. **Connection Pool**
   - Active connections
   - Waiting queries
   - Pool exhaustion events

2. **Query Performance**
   - Slow queries (>100ms)
   - Query count per endpoint
   - Cache hit rate

3. **Database Health**
   - Table sizes
   - Index usage
   - Dead tuples (vacuum needed)

### Prisma Metrics Endpoint

```typescript
// src/app/api/metrics/route.ts
import { prisma } from '@/lib/prisma';
import { getCacheStats } from '@/lib/db';

export async function GET() {
  const metrics = await prisma.$metrics.json();
  const cacheStats = getCacheStats();

  return Response.json({
    prisma: metrics,
    cache: cacheStats,
  });
}
```

### PostgreSQL Maintenance

```sql
-- Weekly: Analyze tables for query optimizer
ANALYZE;

-- Weekly: Vacuum dead tuples
VACUUM ANALYZE "Product";
VACUUM ANALYZE "Order";
VACUUM ANALYZE "CartItem";

-- Monthly: Check index usage
SELECT
  indexrelname,
  idx_scan,
  idx_tup_read,
  idx_tup_fetch
FROM pg_stat_user_indexes
WHERE schemaname = 'public'
ORDER BY idx_scan DESC;

-- Find unused indexes
SELECT
  indexrelname,
  idx_scan
FROM pg_stat_user_indexes
WHERE idx_scan = 0
  AND schemaname = 'public';
```

### Health Check Endpoint

```typescript
// src/app/api/health/route.ts
import { checkDatabaseConnection } from '@/lib/prisma';
import { getCacheStats } from '@/lib/db';

export async function GET() {
  const dbHealthy = await checkDatabaseConnection();
  const cacheStats = getCacheStats();

  const status = dbHealthy ? 'healthy' : 'unhealthy';

  return Response.json({
    status,
    database: dbHealthy ? 'connected' : 'disconnected',
    cache: {
      size: cacheStats.size,
      hitRate: `${(cacheStats.hitRate * 100).toFixed(1)}%`,
    },
    timestamp: new Date().toISOString(),
  }, {
    status: dbHealthy ? 200 : 503,
  });
}
```

---

## Quick Reference

### Environment Variables

```env
# Database
DATABASE_URL="postgresql://user:password@localhost:5432/vapc?connection_limit=10&pool_timeout=20"

# Optional: Separate connection for migrations
DIRECT_URL="postgresql://user:password@localhost:5432/vapc"

# Redis (optional, for distributed caching)
REDIS_URL="redis://localhost:6379"

# VK API (for product sync)
VK_ACCESS_TOKEN="your_token"
VK_GROUP_ID="your_group_id"
```

### Common Commands

```bash
# Generate Prisma client after schema changes
npx prisma generate

# Create migration
npx prisma migrate dev --name description

# Deploy migrations to production
npx prisma migrate deploy

# Open Prisma Studio for data inspection
npx prisma studio

# Reset database (development only!)
npx prisma migrate reset
```

---

## Benchmarks

Expected performance with optimizations:

| Operation | Without Optimization | With Optimization |
|-----------|---------------------|-------------------|
| Product list (20 items) | 150-300ms | 20-50ms |
| Product detail | 50-100ms | 10-30ms |
| Add to cart | 100-200ms | 30-60ms |
| Create order | 300-500ms | 100-200ms |
| VK sync (1000 products) | 10-15 min | 3-5 min |

Cache hit scenarios show 5-10x improvement over database queries.
