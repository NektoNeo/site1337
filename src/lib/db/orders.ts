/**
 * Order Database Access Layer
 * Order creation, status management, and history tracking
 *
 * @module src/lib/db/orders
 *
 * Key features:
 * - Transactional order creation with stock decrement
 * - Status history tracking for audit trail
 * - Optimized queries for admin dashboard
 * - Order number generation with collision prevention
 */

import { prisma, Prisma, Order, OrderStatus, OrderItem } from '@/lib/prisma';
import { getCache, setCache, invalidateCache } from './cache';
import { validateCart, clearCart, CartWithItems } from './cart';
import { decrementStock } from './products';

// ============================================================================
// TYPES
// ============================================================================

export interface CreateOrderParams {
  cartId: string;
  customerName: string;
  customerEmail: string;
  customerPhone: string;
  notes?: string;
  userId?: string;
  discount?: number;
}

export interface OrderWithDetails extends Order {
  items: OrderItemWithProduct[];
  statusHistory: {
    id: string;
    status: OrderStatus;
    note: string | null;
    changedBy: string | null;
    createdAt: Date;
  }[];
}

export interface OrderItemWithProduct extends OrderItem {
  product?: {
    id: string;
    name: string;
    slug: string;
    images: { url: string }[];
  } | null;
}

export interface OrderListParams {
  status?: OrderStatus;
  userId?: string;
  customerEmail?: string;
  dateFrom?: Date;
  dateTo?: Date;
  page?: number;
  pageSize?: number;
}

export interface OrderListResult {
  orders: OrderWithDetails[];
  total: number;
  page: number;
  pageSize: number;
  totalPages: number;
}

export interface OrderStats {
  totalOrders: number;
  pendingOrders: number;
  completedOrders: number;
  cancelledOrders: number;
  totalRevenue: number;
  averageOrderValue: number;
}

// ============================================================================
// CONSTANTS
// ============================================================================

const ORDER_CACHE_TTL = 5 * 60 * 1000; // 5 minutes
const DEFAULT_PAGE_SIZE = 20;
const MAX_PAGE_SIZE = 100;

const ORDER_SELECT = {
  id: true,
  orderNumber: true,
  status: true,
  customerName: true,
  customerEmail: true,
  customerPhone: true,
  subtotal: true,
  discount: true,
  total: true,
  notes: true,
  adminNotes: true,
  userId: true,
  createdAt: true,
  updatedAt: true,
  items: {
    select: {
      id: true,
      quantity: true,
      unitPrice: true,
      totalPrice: true,
      productName: true,
      productSku: true,
      orderId: true,
      productId: true,
      createdAt: true,
      product: {
        select: {
          id: true,
          name: true,
          slug: true,
          images: {
            select: { url: true },
            where: { isPrimary: true },
            take: 1,
          },
        },
      },
    },
  },
  statusHistory: {
    select: {
      id: true,
      status: true,
      note: true,
      changedBy: true,
      createdAt: true,
    },
    orderBy: { createdAt: 'desc' as const },
  },
} satisfies Prisma.OrderSelect;

// ============================================================================
// ORDER NUMBER GENERATION
// ============================================================================

/**
 * Generate unique order number with retry logic
 * Format: VAPC-YYYYMMDD-XXXX (e.g., VAPC-20241215-0001)
 *
 * Uses database-level uniqueness check with retry for collision prevention
 */
async function generateOrderNumber(tx: Prisma.TransactionClient): Promise<string> {
  const maxRetries = 5;
  let attempt = 0;

  while (attempt < maxRetries) {
    const today = new Date();
    const dateStr = today.toISOString().slice(0, 10).replace(/-/g, '');
    const prefix = `VAPC-${dateStr}-`;

    // Find highest order number for today
    const lastOrder = await tx.order.findFirst({
      where: {
        orderNumber: { startsWith: prefix },
      },
      orderBy: { orderNumber: 'desc' },
      select: { orderNumber: true },
    });

    let sequence = 1;
    if (lastOrder) {
      const lastSequence = parseInt(lastOrder.orderNumber.slice(-4), 10);
      sequence = lastSequence + 1;
    }

    const orderNumber = `${prefix}${sequence.toString().padStart(4, '0')}`;

    // Check for collision (race condition prevention)
    const existing = await tx.order.findUnique({
      where: { orderNumber },
      select: { id: true },
    });

    if (!existing) {
      return orderNumber;
    }

    attempt++;
  }

  // Fallback: use timestamp-based number
  const timestamp = Date.now().toString(36).toUpperCase();
  return `VAPC-${timestamp}`;
}

// ============================================================================
// ORDER CREATION
// ============================================================================

/**
 * Create order from cart with full validation and stock management
 *
 * This function:
 * 1. Validates cart (stock, prices, product availability)
 * 2. Generates unique order number
 * 3. Creates order with items (denormalized product info)
 * 4. Decrements stock atomically
 * 5. Records initial status history
 * 6. Clears cart
 *
 * All operations run in a single transaction for consistency
 *
 * @example
 * const order = await createOrder({
 *   cartId: 'cart-123',
 *   customerName: 'John Doe',
 *   customerEmail: 'john@example.com',
 *   customerPhone: '+7 999 123-45-67',
 *   notes: 'Please call before delivery',
 * });
 */
export async function createOrder(params: CreateOrderParams): Promise<OrderWithDetails> {
  const { cartId, customerName, customerEmail, customerPhone, notes, userId, discount = 0 } = params;

  // Validate cart first (outside transaction for early failure)
  const validation = await validateCart(cartId);

  if (!validation.isValid || !validation.cart) {
    const errorMessages = validation.errors.map((e) => e.message).join('; ');
    throw new Error(`Cart validation failed: ${errorMessages || 'Cart is empty or invalid'}`);
  }

  const cart = validation.cart;

  if (cart.items.length === 0) {
    throw new Error('Cannot create order from empty cart');
  }

  // Create order in transaction
  const order = await prisma.$transaction(async (tx) => {
    // Generate order number
    const orderNumber = await generateOrderNumber(tx);

    // Calculate totals
    const subtotal = cart.subtotal;
    const total = Math.max(0, subtotal - discount);

    // Create order
    const newOrder = await tx.order.create({
      data: {
        orderNumber,
        status: OrderStatus.PENDING,
        customerName,
        customerEmail,
        customerPhone,
        subtotal,
        discount,
        total,
        notes,
        userId,
        // Create order items with denormalized product info
        items: {
          create: cart.items.map((item) => {
            const productName = item.product?.name ?? item.prebuilt?.name ?? item.customBuild?.name ?? 'Unknown';
            const productSku = item.product ? item.product.slug : (item.prebuiltId ?? item.customBuildId ?? 'N/A');

            return {
              quantity: item.quantity,
              unitPrice: item.effectivePrice,
              totalPrice: item.lineTotal,
              productName,
              productSku,
              productId: item.productId,
            };
          }),
        },
        // Create initial status history entry
        statusHistory: {
          create: {
            status: OrderStatus.PENDING,
            note: 'Order created',
            changedBy: 'system',
          },
        },
      },
      select: ORDER_SELECT,
    });

    // Decrement stock for products
    const stockUpdates = cart.items
      .filter((item) => item.productId && item.product)
      .map((item) => ({
        productId: item.productId!,
        quantity: item.quantity,
      }));

    if (stockUpdates.length > 0) {
      await Promise.all(
        stockUpdates.map((update) =>
          tx.product.update({
            where: { id: update.productId },
            data: { stock: { decrement: update.quantity } },
          })
        )
      );
    }

    // Clear cart
    await tx.cartItem.deleteMany({
      where: { cartId },
    });

    return newOrder;
  });

  // Invalidate caches
  invalidateCache('cart:');
  invalidateCache('orders:');
  invalidateCache('products:'); // Stock changed

  return order as OrderWithDetails;
}

// ============================================================================
// ORDER RETRIEVAL
// ============================================================================

/**
 * Get order by ID
 */
export async function getOrderById(orderId: string): Promise<OrderWithDetails | null> {
  const cacheKey = `order:${orderId}`;
  const cached = getCache<OrderWithDetails>(cacheKey);
  if (cached) return cached;

  const order = await prisma.order.findUnique({
    where: { id: orderId },
    select: ORDER_SELECT,
  });

  if (order) {
    setCache(cacheKey, order, ORDER_CACHE_TTL);
  }

  return order as OrderWithDetails | null;
}

/**
 * Get order by order number
 */
export async function getOrderByNumber(orderNumber: string): Promise<OrderWithDetails | null> {
  const cacheKey = `order:number:${orderNumber}`;
  const cached = getCache<OrderWithDetails>(cacheKey);
  if (cached) return cached;

  const order = await prisma.order.findUnique({
    where: { orderNumber },
    select: ORDER_SELECT,
  });

  if (order) {
    setCache(cacheKey, order, ORDER_CACHE_TTL);
  }

  return order as OrderWithDetails | null;
}

/**
 * Get orders list with filtering and pagination
 * Optimized for admin dashboard
 */
export async function getOrders(params: OrderListParams = {}): Promise<OrderListResult> {
  const { status, userId, customerEmail, dateFrom, dateTo } = params;
  const page = Math.max(1, params.page || 1);
  const pageSize = Math.min(MAX_PAGE_SIZE, Math.max(1, params.pageSize || DEFAULT_PAGE_SIZE));
  const skip = (page - 1) * pageSize;

  // Build where clause
  const conditions: Prisma.OrderWhereInput[] = [];

  if (status) {
    conditions.push({ status });
  }

  if (userId) {
    conditions.push({ userId });
  }

  if (customerEmail) {
    conditions.push({ customerEmail: { equals: customerEmail, mode: 'insensitive' } });
  }

  if (dateFrom || dateTo) {
    const dateCondition: Prisma.DateTimeFilter<"Order"> = {};
    if (dateFrom) dateCondition.gte = dateFrom;
    if (dateTo) dateCondition.lte = dateTo;
    conditions.push({ createdAt: dateCondition });
  }

  const where: Prisma.OrderWhereInput = conditions.length > 0 ? { AND: conditions } : {};

  // Execute queries in parallel
  const [total, orders] = await Promise.all([
    prisma.order.count({ where }),
    prisma.order.findMany({
      where,
      orderBy: [{ createdAt: 'desc' }],
      skip,
      take: pageSize,
      select: ORDER_SELECT,
    }),
  ]);

  return {
    orders: orders as OrderWithDetails[],
    total,
    page,
    pageSize,
    totalPages: Math.ceil(total / pageSize),
  };
}

/**
 * Get orders for a specific user
 */
export async function getUserOrders(userId: string, page: number = 1): Promise<OrderListResult> {
  return getOrders({ userId, page });
}

/**
 * Get orders by customer email (for guest order lookup)
 */
export async function getOrdersByEmail(email: string): Promise<OrderWithDetails[]> {
  const orders = await prisma.order.findMany({
    where: { customerEmail: { equals: email, mode: 'insensitive' } },
    orderBy: [{ createdAt: 'desc' }],
    select: ORDER_SELECT,
  });

  return orders as OrderWithDetails[];
}

// ============================================================================
// ORDER STATUS MANAGEMENT
// ============================================================================

/**
 * Update order status with history tracking
 *
 * @example
 * await updateOrderStatus('order-123', 'CONFIRMED', 'admin-456', 'Customer confirmed via phone');
 */
export async function updateOrderStatus(
  orderId: string,
  newStatus: OrderStatus,
  changedBy: string,
  note?: string
): Promise<OrderWithDetails> {
  const order = await prisma.$transaction(async (tx) => {
    // Get current order
    const currentOrder = await tx.order.findUnique({
      where: { id: orderId },
      select: { status: true },
    });

    if (!currentOrder) {
      throw new Error('Order not found');
    }

    // Validate status transition
    if (!isValidStatusTransition(currentOrder.status, newStatus)) {
      throw new Error(
        `Invalid status transition from ${currentOrder.status} to ${newStatus}`
      );
    }

    // Update order and create history entry
    const updated = await tx.order.update({
      where: { id: orderId },
      data: {
        status: newStatus,
        statusHistory: {
          create: {
            status: newStatus,
            note,
            changedBy,
          },
        },
      },
      select: ORDER_SELECT,
    });

    return updated;
  });

  // Invalidate caches
  invalidateCache(`order:${orderId}`);
  invalidateCache('orders:');

  return order as OrderWithDetails;
}

/**
 * Validate status transitions
 * Prevents invalid state changes
 */
function isValidStatusTransition(from: OrderStatus, to: OrderStatus): boolean {
  const validTransitions: Record<OrderStatus, OrderStatus[]> = {
    [OrderStatus.PENDING]: [OrderStatus.CONTACTED, OrderStatus.CANCELLED],
    [OrderStatus.CONTACTED]: [OrderStatus.CONFIRMED, OrderStatus.CANCELLED],
    [OrderStatus.CONFIRMED]: [OrderStatus.PROCESSING, OrderStatus.CANCELLED],
    [OrderStatus.PROCESSING]: [OrderStatus.READY, OrderStatus.CANCELLED],
    [OrderStatus.READY]: [OrderStatus.COMPLETED, OrderStatus.CANCELLED],
    [OrderStatus.COMPLETED]: [], // Terminal state
    [OrderStatus.CANCELLED]: [], // Terminal state
  };

  return validTransitions[from]?.includes(to) ?? false;
}

/**
 * Add admin note to order
 */
export async function addOrderNote(orderId: string, adminNotes: string): Promise<OrderWithDetails> {
  const order = await prisma.order.update({
    where: { id: orderId },
    data: { adminNotes },
    select: ORDER_SELECT,
  });

  invalidateCache(`order:${orderId}`);

  return order as OrderWithDetails;
}

/**
 * Cancel order with stock restoration
 */
export async function cancelOrder(
  orderId: string,
  changedBy: string,
  reason?: string
): Promise<OrderWithDetails> {
  const order = await prisma.$transaction(async (tx) => {
    // Get order with items
    const currentOrder = await tx.order.findUnique({
      where: { id: orderId },
      include: { items: true },
    });

    if (!currentOrder) {
      throw new Error('Order not found');
    }

    if (currentOrder.status === OrderStatus.CANCELLED) {
      throw new Error('Order is already cancelled');
    }

    if (currentOrder.status === OrderStatus.COMPLETED) {
      throw new Error('Cannot cancel completed order');
    }

    // Restore stock for product items
    const stockRestorations = currentOrder.items
      .filter((item) => item.productId)
      .map((item) => ({
        productId: item.productId!,
        quantity: item.quantity,
      }));

    await Promise.all(
      stockRestorations.map((restoration) =>
        tx.product.update({
          where: { id: restoration.productId },
          data: { stock: { increment: restoration.quantity } },
        })
      )
    );

    // Update order status
    const updated = await tx.order.update({
      where: { id: orderId },
      data: {
        status: OrderStatus.CANCELLED,
        statusHistory: {
          create: {
            status: OrderStatus.CANCELLED,
            note: reason || 'Order cancelled',
            changedBy,
          },
        },
      },
      select: ORDER_SELECT,
    });

    return updated;
  });

  // Invalidate caches
  invalidateCache(`order:${orderId}`);
  invalidateCache('orders:');
  invalidateCache('products:'); // Stock restored

  return order as OrderWithDetails;
}

// ============================================================================
// ORDER STATISTICS
// ============================================================================

/**
 * Get order statistics for dashboard
 * Uses aggregation queries for efficiency
 */
export async function getOrderStats(dateFrom?: Date, dateTo?: Date): Promise<OrderStats> {
  const cacheKey = `orders:stats:${dateFrom?.toISOString() ?? 'all'}:${dateTo?.toISOString() ?? 'all'}`;
  const cached = getCache<OrderStats>(cacheKey);
  if (cached) return cached;

  const dateFilter = dateFrom || dateTo
    ? {
        createdAt: {
          ...(dateFrom && { gte: dateFrom }),
          ...(dateTo && { lte: dateTo }),
        },
      }
    : {};

  // Run aggregation queries in parallel
  const [total, pending, completed, cancelled, revenueResult] = await Promise.all([
    prisma.order.count({ where: dateFilter }),
    prisma.order.count({ where: { ...dateFilter, status: OrderStatus.PENDING } }),
    prisma.order.count({ where: { ...dateFilter, status: OrderStatus.COMPLETED } }),
    prisma.order.count({ where: { ...dateFilter, status: OrderStatus.CANCELLED } }),
    prisma.order.aggregate({
      where: { ...dateFilter, status: { not: OrderStatus.CANCELLED } },
      _sum: { total: true },
      _avg: { total: true },
    }),
  ]);

  const stats: OrderStats = {
    totalOrders: total,
    pendingOrders: pending,
    completedOrders: completed,
    cancelledOrders: cancelled,
    totalRevenue: Number(revenueResult._sum.total ?? 0),
    averageOrderValue: Number(revenueResult._avg.total ?? 0),
  };

  setCache(cacheKey, stats, 2 * 60 * 1000); // 2 minutes cache for stats

  return stats;
}

/**
 * Get orders count by status for dashboard
 */
export async function getOrderCountsByStatus(): Promise<Record<OrderStatus, number>> {
  const cacheKey = 'orders:counts:byStatus';
  const cached = getCache<Record<OrderStatus, number>>(cacheKey);
  if (cached) return cached;

  const counts = await prisma.order.groupBy({
    by: ['status'],
    _count: { id: true },
  });

  const result = Object.values(OrderStatus).reduce(
    (acc, status) => ({ ...acc, [status]: 0 }),
    {} as Record<OrderStatus, number>
  );

  for (const count of counts) {
    result[count.status] = count._count.id;
  }

  setCache(cacheKey, result, 2 * 60 * 1000);

  return result;
}

// ============================================================================
// CACHE INVALIDATION
// ============================================================================

/**
 * Invalidate all order-related caches
 */
export function invalidateOrderCache(): void {
  invalidateCache('order:');
  invalidateCache('orders:');
}

export default {
  createOrder,
  getOrderById,
  getOrderByNumber,
  getOrders,
  getUserOrders,
  getOrdersByEmail,
  updateOrderStatus,
  addOrderNote,
  cancelOrder,
  getOrderStats,
  getOrderCountsByStatus,
  invalidateOrderCache,
};
