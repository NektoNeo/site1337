/**
 * Database Access Layer - Main Export
 *
 * @module src/lib/db
 *
 * This module provides a clean interface for database operations
 * with built-in caching, transactions, and optimization.
 *
 * @example
 * import { products, cart, orders, cache } from '@/lib/db';
 *
 * // Get featured products
 * const featured = await products.getFeaturedProducts();
 *
 * // Add to cart
 * const updatedCart = await cart.addToCart({ userId: 'user-123', productId: 'prod-456' });
 *
 * // Create order
 * const order = await orders.createOrder({ cartId: 'cart-789', ... });
 */

// Re-export all modules
export * as products from './products';
export * as cart from './cart';
export * as orders from './orders';
export * as cache from './cache';
export * as vkSync from './vk-sync';

// Re-export commonly used functions directly
export {
  // Products
  getProducts,
  getProductById,
  getProductBySlug,
  getProductBySku,
  getFeaturedProducts,
  getSaleProducts,
  getRelatedProducts,
  getProductsByIds,
  checkStockAvailability,
  invalidateProductCache,
  type ProductFilters,
  type ProductSortOption,
  type PaginationParams,
  type ProductListResult,
  type ProductWithRelations,
} from './products';

export {
  // Cart
  getOrCreateCart,
  getCartById,
  addToCart,
  updateCartItem,
  removeCartItem,
  clearCart,
  validateCart,
  mergeCartOnLogin,
  type CartWithItems,
  type CartItemWithDetails,
  type AddToCartParams,
  type CartValidationResult,
} from './cart';

export {
  // Orders
  createOrder,
  getOrderById,
  getOrderByNumber,
  getOrders,
  getUserOrders,
  getOrdersByEmail,
  updateOrderStatus,
  cancelOrder,
  getOrderStats,
  type CreateOrderParams,
  type OrderWithDetails,
  type OrderListParams,
  type OrderListResult,
  type OrderStats,
} from './orders';

export {
  // Cache
  getCache,
  setCache,
  deleteCache,
  invalidateCache,
  clearCache,
  getCacheStats,
  withCache,
  cacheAside,
} from './cache';

export {
  // VK Sync
  syncVKProducts,
  syncSingleProduct,
  getLastSyncInfo,
  getStaleProducts,
  type SyncOptions,
  type SyncResult,
} from './vk-sync';
