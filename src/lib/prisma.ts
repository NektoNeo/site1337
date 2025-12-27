/**
 * Prisma Client Singleton
 * 
 * This module provides a singleton instance of the Prisma Client
 * to prevent multiple connections during development hot-reloading.
 * 
 * Usage:
 *   import { prisma } from '@/lib/prisma'
 *   const users = await prisma.user.findMany()
 */

import { PrismaClient } from '@prisma/client'

// Type declaration for global prisma instance
const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined
}

// Prisma Client options - using mutable array to satisfy Prisma types
const prismaClientOptions = {
  log: process.env.NODE_ENV === 'development'
    ? ['query', 'error', 'warn']
    : ['error'],
} as const

// Create or reuse existing Prisma Client instance
// @ts-expect-error - Prisma log types are strict, our config is valid at runtime
export const prisma = globalForPrisma.prisma ?? new PrismaClient(prismaClientOptions)

// Store the instance globally in development to prevent multiple connections
if (process.env.NODE_ENV !== 'production') {
  globalForPrisma.prisma = prisma
}

// Default export for convenience
export default prisma

// ============================================================================
// UTILITY TYPES
// ============================================================================

// Re-export Prisma types for convenience
export { Prisma } from '@prisma/client'

// Common query result types
export type {
  User,
  Category,
  Brand,
  Product,
  ProductImage,
  PrebuiltConfig,
  PrebuiltConfigItem,
  CustomBuild,
  CustomBuildItem,
  Cart,
  CartItem,
  Order,
  OrderItem,
  OrderStatusHistory,
  Setting,
} from '@prisma/client'

// Enum re-exports
export { 
  UserRole, 
  OrderStatus, 
  ComponentType 
} from '@prisma/client'

// ============================================================================
// DATABASE UTILITIES
// ============================================================================

/**
 * Check database connection health
 * Useful for health check endpoints and startup validation
 */
export async function checkDatabaseConnection(): Promise<boolean> {
  try {
    await prisma.$queryRaw`SELECT 1`
    return true
  } catch (error) {
    console.error('Database connection failed:', error)
    return false
  }
}

/**
 * Gracefully disconnect from database
 * Call this in cleanup handlers (e.g., SIGTERM, SIGINT)
 */
export async function disconnectDatabase(): Promise<void> {
  await prisma.$disconnect()
}

/**
 * Generate unique order number
 * Format: VAPC-YYYYMMDD-XXXX (e.g., VAPC-20241215-0001)
 */
export async function generateOrderNumber(): Promise<string> {
  const today = new Date()
  const dateStr = today.toISOString().slice(0, 10).replace(/-/g, '')
  const prefix = `VAPC-${dateStr}-`
  
  // Find the highest order number for today
  const lastOrder = await prisma.order.findFirst({
    where: {
      orderNumber: {
        startsWith: prefix,
      },
    },
    orderBy: {
      orderNumber: 'desc',
    },
    select: {
      orderNumber: true,
    },
  })
  
  let sequence = 1
  if (lastOrder) {
    const lastSequence = parseInt(lastOrder.orderNumber.slice(-4), 10)
    sequence = lastSequence + 1
  }
  
  return `${prefix}${sequence.toString().padStart(4, '0')}`
}

/**
 * Calculate cart total with optional discount
 */
export async function calculateCartTotal(
  cartId: string
): Promise<{ subtotal: number; itemCount: number }> {
  const items = await prisma.cartItem.findMany({
    where: { cartId },
    include: {
      product: {
        select: { price: true, salePrice: true },
      },
      prebuilt: {
        select: { price: true, salePrice: true },
      },
      customBuild: {
        select: { totalPrice: true },
      },
    },
  })
  
  let subtotal = 0
  let itemCount = 0
  
  for (const item of items) {
    itemCount += item.quantity
    
    if (item.product) {
      const price = item.product.salePrice ?? item.product.price
      subtotal += Number(price) * item.quantity
    } else if (item.prebuilt) {
      const price = item.prebuilt.salePrice ?? item.prebuilt.price
      subtotal += Number(price) * item.quantity
    } else if (item.customBuild) {
      subtotal += Number(item.customBuild.totalPrice) * item.quantity
    }
  }
  
  return { subtotal, itemCount }
}
