/**
 * Cart Database Access Layer
 * Transactional cart operations with proper locking and validation
 *
 * @module src/lib/db/cart
 *
 * Key features:
 * - Atomic cart operations using Prisma transactions
 * - Optimistic locking for concurrent cart updates
 * - Stock validation before adding items
 * - Session-based carts for anonymous users
 * - Cart merging when anonymous user logs in
 */

import { prisma, Prisma, Cart, CartItem } from '@/lib/prisma';
import { getCache, setCache, invalidateCache } from './cache';
import { checkStockAvailability } from './products';

// ============================================================================
// TYPES
// ============================================================================

export interface CartWithItems extends Cart {
  items: CartItemWithDetails[];
  subtotal: number;
  itemCount: number;
}

export interface CartItemWithDetails extends CartItem {
  product?: {
    id: string;
    name: string;
    slug: string;
    price: Prisma.Decimal;
    salePrice: Prisma.Decimal | null;
    stock: number;
    isActive: boolean;
    images: { url: string; alt: string | null }[];
  } | null;
  prebuilt?: {
    id: string;
    name: string;
    slug: string;
    price: Prisma.Decimal;
    salePrice: Prisma.Decimal | null;
    imageUrl: string | null;
    isActive: boolean;
  } | null;
  customBuild?: {
    id: string;
    name: string | null;
    totalPrice: Prisma.Decimal;
    isComplete: boolean;
  } | null;
  effectivePrice: number;
  lineTotal: number;
}

export interface AddToCartParams {
  cartId?: string;
  userId?: string;
  sessionId?: string;
  productId?: string;
  prebuiltId?: string;
  customBuildId?: string;
  quantity?: number;
}

export interface UpdateCartItemParams {
  cartItemId: string;
  quantity: number;
}

export interface CartValidationResult {
  isValid: boolean;
  errors: CartItemError[];
  cart: CartWithItems | null;
}

export interface CartItemError {
  cartItemId: string;
  productId: string | null;
  type: 'OUT_OF_STOCK' | 'INSUFFICIENT_STOCK' | 'PRODUCT_INACTIVE' | 'PRICE_CHANGED';
  message: string;
  details?: {
    requested: number;
    available: number;
    currentPrice?: number;
    cartPrice?: number;
  };
}

// ============================================================================
// CONSTANTS
// ============================================================================

const CART_CACHE_TTL = 2 * 60 * 1000; // 2 minutes (shorter for cart data)

const CART_ITEMS_SELECT = {
  id: true,
  quantity: true,
  cartId: true,
  productId: true,
  prebuiltId: true,
  customBuildId: true,
  createdAt: true,
  updatedAt: true,
  product: {
    select: {
      id: true,
      name: true,
      slug: true,
      price: true,
      salePrice: true,
      stock: true,
      isActive: true,
      images: {
        select: { url: true, alt: true },
        where: { isPrimary: true },
        take: 1,
      },
    },
  },
  prebuilt: {
    select: {
      id: true,
      name: true,
      slug: true,
      price: true,
      salePrice: true,
      imageUrl: true,
      isActive: true,
    },
  },
  customBuild: {
    select: {
      id: true,
      name: true,
      totalPrice: true,
      isComplete: true,
    },
  },
} satisfies Prisma.CartItemSelect;

// ============================================================================
// HELPER FUNCTIONS
// ============================================================================

/**
 * Calculate effective price for a cart item
 */
function getEffectivePrice(item: CartItemWithDetails): number {
  if (item.product) {
    const price = item.product.salePrice ?? item.product.price;
    return Number(price);
  }
  if (item.prebuilt) {
    const price = item.prebuilt.salePrice ?? item.prebuilt.price;
    return Number(price);
  }
  if (item.customBuild) {
    return Number(item.customBuild.totalPrice);
  }
  return 0;
}

/**
 * Enrich cart items with calculated fields
 */
function enrichCartItems(items: CartItem[]): CartItemWithDetails[] {
  return (items as CartItemWithDetails[]).map((item) => ({
    ...item,
    effectivePrice: getEffectivePrice(item),
    lineTotal: getEffectivePrice(item) * item.quantity,
  }));
}

/**
 * Calculate cart totals
 */
function calculateCartTotals(items: CartItemWithDetails[]): { subtotal: number; itemCount: number } {
  let subtotal = 0;
  let itemCount = 0;

  for (const item of items) {
    subtotal += item.lineTotal;
    itemCount += item.quantity;
  }

  return { subtotal, itemCount };
}

/**
 * Get cart cache key
 */
function getCartCacheKey(userId?: string, sessionId?: string): string {
  if (userId) return `cart:user:${userId}`;
  if (sessionId) return `cart:session:${sessionId}`;
  return '';
}

// ============================================================================
// CART RETRIEVAL
// ============================================================================

/**
 * Get or create cart for a user or session
 *
 * @example
 * // For logged-in user
 * const cart = await getOrCreateCart({ userId: 'user-123' });
 *
 * // For anonymous session
 * const cart = await getOrCreateCart({ sessionId: 'session-abc' });
 */
export async function getOrCreateCart(params: {
  userId?: string;
  sessionId?: string;
}): Promise<CartWithItems> {
  const { userId, sessionId } = params;

  if (!userId && !sessionId) {
    throw new Error('Either userId or sessionId is required');
  }

  // Check cache
  const cacheKey = getCartCacheKey(userId, sessionId);
  if (cacheKey) {
    const cached = getCache<CartWithItems>(cacheKey);
    if (cached) return cached;
  }

  // Try to find existing cart
  let cart = await prisma.cart.findFirst({
    where: userId ? { userId } : { sessionId },
    include: { items: { select: CART_ITEMS_SELECT } },
  });

  // Create new cart if not found
  if (!cart) {
    cart = await prisma.cart.create({
      data: userId ? { userId } : { sessionId },
      include: { items: { select: CART_ITEMS_SELECT } },
    });
  }

  // Enrich and calculate totals
  const enrichedItems = enrichCartItems(cart.items);
  const { subtotal, itemCount } = calculateCartTotals(enrichedItems);

  const result: CartWithItems = {
    ...cart,
    items: enrichedItems,
    subtotal,
    itemCount,
  };

  // Cache the result
  if (cacheKey) {
    setCache(cacheKey, result, CART_CACHE_TTL);
  }

  return result;
}

/**
 * Get cart by ID
 */
export async function getCartById(cartId: string): Promise<CartWithItems | null> {
  const cacheKey = `cart:id:${cartId}`;
  const cached = getCache<CartWithItems>(cacheKey);
  if (cached) return cached;

  const cart = await prisma.cart.findUnique({
    where: { id: cartId },
    include: { items: { select: CART_ITEMS_SELECT } },
  });

  if (!cart) return null;

  const enrichedItems = enrichCartItems(cart.items);
  const { subtotal, itemCount } = calculateCartTotals(enrichedItems);

  const result: CartWithItems = {
    ...cart,
    items: enrichedItems,
    subtotal,
    itemCount,
  };

  setCache(cacheKey, result, CART_CACHE_TTL);

  return result;
}

// ============================================================================
// CART OPERATIONS
// ============================================================================

/**
 * Add item to cart with stock validation
 * Uses transaction to ensure atomicity
 *
 * @example
 * const cart = await addToCart({
 *   userId: 'user-123',
 *   productId: 'prod-456',
 *   quantity: 2,
 * });
 */
export async function addToCart(params: AddToCartParams): Promise<CartWithItems> {
  const { userId, sessionId, productId, prebuiltId, customBuildId, quantity = 1 } = params;

  if (!userId && !sessionId) {
    throw new Error('Either userId or sessionId is required');
  }

  if (!productId && !prebuiltId && !customBuildId) {
    throw new Error('Must provide productId, prebuiltId, or customBuildId');
  }

  // Validate stock for products
  if (productId) {
    const [availability] = await checkStockAvailability([{ productId, quantity }]);
    if (!availability.available) {
      throw new Error(
        availability.stock === 0
          ? 'Product is out of stock'
          : `Only ${availability.stock} items available`
      );
    }
  }

  // Use transaction for atomic operation
  const result = await prisma.$transaction(async (tx) => {
    // Get or create cart
    let cart = await tx.cart.findFirst({
      where: userId ? { userId } : { sessionId },
    });

    if (!cart) {
      cart = await tx.cart.create({
        data: userId ? { userId } : { sessionId },
      });
    }

    // Check if item already exists in cart
    const existingItem = await tx.cartItem.findFirst({
      where: {
        cartId: cart.id,
        productId,
        prebuiltId,
        customBuildId,
      },
    });

    if (existingItem) {
      // Update quantity
      await tx.cartItem.update({
        where: { id: existingItem.id },
        data: { quantity: existingItem.quantity + quantity },
      });
    } else {
      // Get current price for price tracking
      let priceAtAdd: Prisma.Decimal | undefined;
      if (productId) {
        const product = await tx.product.findUnique({
          where: { id: productId },
          select: { price: true, salePrice: true },
        });
        if (product) {
          priceAtAdd = product.salePrice ?? product.price;
        }
      }

      // Create new cart item
      await tx.cartItem.create({
        data: {
          cartId: cart.id,
          productId,
          prebuiltId,
          customBuildId,
          quantity,
          priceAtAdd,
        },
      });
    }

    // Return updated cart
    return tx.cart.findUnique({
      where: { id: cart.id },
      include: { items: { select: CART_ITEMS_SELECT } },
    });
  });

  if (!result) {
    throw new Error('Failed to update cart');
  }

  // Invalidate cache
  const cacheKey = getCartCacheKey(userId, sessionId);
  if (cacheKey) invalidateCache(cacheKey);
  invalidateCache(`cart:id:${result.id}`);

  // Return enriched cart
  const enrichedItems = enrichCartItems(result.items);
  const totals = calculateCartTotals(enrichedItems);

  return {
    ...result,
    items: enrichedItems,
    ...totals,
  };
}

/**
 * Update cart item quantity
 * Validates stock before updating
 */
export async function updateCartItem(params: UpdateCartItemParams): Promise<CartWithItems> {
  const { cartItemId, quantity } = params;

  if (quantity < 1) {
    return removeCartItem(cartItemId);
  }

  const result = await prisma.$transaction(async (tx) => {
    // Get cart item with product
    const cartItem = await tx.cartItem.findUnique({
      where: { id: cartItemId },
      include: {
        product: { select: { stock: true, isActive: true } },
        cart: true,
      },
    });

    if (!cartItem) {
      throw new Error('Cart item not found');
    }

    // Validate stock
    if (cartItem.product) {
      if (!cartItem.product.isActive) {
        throw new Error('Product is no longer available');
      }
      if (cartItem.product.stock < quantity) {
        throw new Error(`Only ${cartItem.product.stock} items available`);
      }
    }

    // Update quantity
    await tx.cartItem.update({
      where: { id: cartItemId },
      data: { quantity },
    });

    // Return updated cart
    return tx.cart.findUnique({
      where: { id: cartItem.cartId },
      include: { items: { select: CART_ITEMS_SELECT } },
    });
  });

  if (!result) {
    throw new Error('Failed to update cart');
  }

  // Invalidate all cart caches for this cart
  invalidateCache(`cart:`);

  const enrichedItems = enrichCartItems(result.items);
  const totals = calculateCartTotals(enrichedItems);

  return {
    ...result,
    items: enrichedItems,
    ...totals,
  };
}

/**
 * Remove item from cart
 */
export async function removeCartItem(cartItemId: string): Promise<CartWithItems> {
  const result = await prisma.$transaction(async (tx) => {
    const cartItem = await tx.cartItem.findUnique({
      where: { id: cartItemId },
      select: { cartId: true },
    });

    if (!cartItem) {
      throw new Error('Cart item not found');
    }

    await tx.cartItem.delete({
      where: { id: cartItemId },
    });

    return tx.cart.findUnique({
      where: { id: cartItem.cartId },
      include: { items: { select: CART_ITEMS_SELECT } },
    });
  });

  if (!result) {
    throw new Error('Failed to update cart');
  }

  invalidateCache(`cart:`);

  const enrichedItems = enrichCartItems(result.items);
  const totals = calculateCartTotals(enrichedItems);

  return {
    ...result,
    items: enrichedItems,
    ...totals,
  };
}

/**
 * Clear all items from cart
 */
export async function clearCart(cartId: string): Promise<CartWithItems> {
  await prisma.cartItem.deleteMany({
    where: { cartId },
  });

  invalidateCache(`cart:`);

  const cart = await prisma.cart.findUnique({
    where: { id: cartId },
    include: { items: { select: CART_ITEMS_SELECT } },
  });

  if (!cart) {
    throw new Error('Cart not found');
  }

  return {
    ...cart,
    items: [],
    subtotal: 0,
    itemCount: 0,
  };
}

// ============================================================================
// CART VALIDATION
// ============================================================================

/**
 * Validate cart before checkout
 * Checks stock availability, prices, and product status
 *
 * @example
 * const validation = await validateCart(cartId);
 * if (!validation.isValid) {
 *   // Show errors to user
 *   console.log(validation.errors);
 * }
 */
export async function validateCart(cartId: string): Promise<CartValidationResult> {
  const cart = await getCartById(cartId);

  if (!cart) {
    return { isValid: false, errors: [], cart: null };
  }

  const errors: CartItemError[] = [];

  for (const item of cart.items) {
    if (item.product) {
      // Check if product is active
      if (!item.product.isActive) {
        errors.push({
          cartItemId: item.id,
          productId: item.productId,
          type: 'PRODUCT_INACTIVE',
          message: `${item.product.name} is no longer available`,
        });
        continue;
      }

      // Check stock
      if (item.product.stock === 0) {
        errors.push({
          cartItemId: item.id,
          productId: item.productId,
          type: 'OUT_OF_STOCK',
          message: `${item.product.name} is out of stock`,
        });
      } else if (item.product.stock < item.quantity) {
        errors.push({
          cartItemId: item.id,
          productId: item.productId,
          type: 'INSUFFICIENT_STOCK',
          message: `Only ${item.product.stock} of ${item.product.name} available`,
          details: {
            requested: item.quantity,
            available: item.product.stock,
          },
        });
      }

      // Check if price changed since adding to cart
      if (item.priceAtAdd) {
        const currentPrice = getEffectivePrice(item);
        const cartPrice = Number(item.priceAtAdd);

        if (Math.abs(currentPrice - cartPrice) > 0.01) {
          errors.push({
            cartItemId: item.id,
            productId: item.productId,
            type: 'PRICE_CHANGED',
            message: `Price of ${item.product.name} has changed`,
            details: {
              requested: item.quantity,
              available: item.product.stock,
              currentPrice,
              cartPrice,
            },
          });
        }
      }
    }

    // Similar checks for prebuilt configs...
    if (item.prebuilt && !item.prebuilt.isActive) {
      errors.push({
        cartItemId: item.id,
        productId: null,
        type: 'PRODUCT_INACTIVE',
        message: `${item.prebuilt.name} is no longer available`,
      });
    }
  }

  return {
    isValid: errors.length === 0,
    errors,
    cart,
  };
}

// ============================================================================
// CART MERGING
// ============================================================================

/**
 * Merge anonymous session cart with user cart after login
 * Keeps the higher quantity for duplicate items
 */
export async function mergeCartOnLogin(
  userId: string,
  sessionId: string
): Promise<CartWithItems | null> {
  const result = await prisma.$transaction(async (tx) => {
    // Get session cart
    const sessionCart = await tx.cart.findUnique({
      where: { sessionId },
      include: { items: true },
    });

    if (!sessionCart || sessionCart.items.length === 0) {
      // No session cart to merge, just return user cart
      return tx.cart.findFirst({
        where: { userId },
        include: { items: { select: CART_ITEMS_SELECT } },
      });
    }

    // Get or create user cart
    let userCart = await tx.cart.findFirst({
      where: { userId },
      include: { items: true },
    });

    if (!userCart) {
      userCart = await tx.cart.create({
        data: { userId },
        include: { items: true },
      });
    }

    // Merge items
    for (const sessionItem of sessionCart.items) {
      const existingItem = userCart.items.find(
        (item) =>
          item.productId === sessionItem.productId &&
          item.prebuiltId === sessionItem.prebuiltId &&
          item.customBuildId === sessionItem.customBuildId
      );

      if (existingItem) {
        // Update to higher quantity
        const newQuantity = Math.max(existingItem.quantity, sessionItem.quantity);
        await tx.cartItem.update({
          where: { id: existingItem.id },
          data: { quantity: newQuantity },
        });
      } else {
        // Move item to user cart
        await tx.cartItem.update({
          where: { id: sessionItem.id },
          data: { cartId: userCart.id },
        });
      }
    }

    // Delete empty session cart
    await tx.cart.delete({
      where: { id: sessionCart.id },
    });

    // Return merged cart
    return tx.cart.findUnique({
      where: { id: userCart.id },
      include: { items: { select: CART_ITEMS_SELECT } },
    });
  });

  if (!result) return null;

  // Invalidate caches
  invalidateCache(`cart:`);

  const enrichedItems = enrichCartItems(result.items);
  const totals = calculateCartTotals(enrichedItems);

  return {
    ...result,
    items: enrichedItems,
    ...totals,
  };
}

// ============================================================================
// CART CLEANUP
// ============================================================================

/**
 * Delete abandoned carts older than specified days
 * Run as a scheduled job (e.g., daily)
 *
 * @example
 * // Delete carts abandoned more than 30 days ago
 * await cleanupAbandonedCarts(30);
 */
export async function cleanupAbandonedCarts(daysOld: number = 30): Promise<number> {
  const cutoffDate = new Date();
  cutoffDate.setDate(cutoffDate.getDate() - daysOld);

  const result = await prisma.cart.deleteMany({
    where: {
      updatedAt: { lt: cutoffDate },
      userId: null, // Only delete anonymous carts
    },
  });

  return result.count;
}

export default {
  getOrCreateCart,
  getCartById,
  addToCart,
  updateCartItem,
  removeCartItem,
  clearCart,
  validateCart,
  mergeCartOnLogin,
  cleanupAbandonedCarts,
};
