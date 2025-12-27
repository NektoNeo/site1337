/**
 * VK Market Product Types
 * Normalized structure for VK Market API data
 * These types are used for the VK API integration
 */

export interface VKProductImage {
  id: string;
  url: string;
  width: number;
  height: number;
  alt?: string;
  thumbnail?: string;
}

export interface VKProductPrice {
  amount: number; // Price in main currency units (rubles, not kopeks)
  currency: string;
  formatted: string;
  originalAmount?: number; // Original price if discounted
  originalFormatted?: string;
  hasDiscount: boolean;
}

export interface VKProductCategory {
  id: string;
  name: string;
  section?: {
    id: string;
    name: string;
  };
}

export interface VKProductDimensions {
  width: number;
  height: number;
  length: number;
  unit: 'mm' | 'cm' | 'm';
}

export type VKProductAvailability = 'in_stock' | 'out_of_stock' | 'removed';

export interface VKProduct {
  id: string;
  externalId: string; // VK item_id for reference
  ownerId: string; // VK owner_id (group)

  // Basic info
  title: string;
  description: string;
  slug: string;
  sku?: string;

  // Pricing
  price: VKProductPrice;

  // Category
  category: VKProductCategory;

  // Media
  images: VKProductImage[];
  thumbnailUrl: string;

  // Availability
  availability: VKProductAvailability;

  // Physical properties
  dimensions?: VKProductDimensions;
  weight?: number; // in grams

  // Social/Stats
  likesCount: number;
  viewsCount: number;

  // Metadata
  createdAt: Date;
  updatedAt: Date;

  // URLs
  vkUrl: string;

  // Flags
  isAdult: boolean;
  isFavorite: boolean;

  // Album/Collection IDs
  albumIds: string[];
}

export interface VKProductCollection {
  id: string;
  name: string;
  description?: string;
  imageUrl?: string;
  productCount: number;
  updatedAt: Date;
  isMain: boolean;
  isHidden: boolean;
}

// API Response types for VK endpoints
export interface VKProductsListResponse {
  products: VKProduct[];
  total: number;
  page: number;
  pageSize: number;
  hasMore: boolean;
}

export interface VKProductDetailResponse {
  product: VKProduct;
  relatedProducts?: VKProduct[];
}

export interface VKProductCategoriesResponse {
  categories: VKProductCollection[];
  total: number;
}

// Query parameters for VK product listing
export interface VKProductsQueryParams {
  page?: number;
  pageSize?: number;
  categoryId?: string;
  search?: string;
  sortBy?: 'date' | 'price_asc' | 'price_desc' | 'popular';
  priceFrom?: number;
  priceTo?: number;
}

// Error types
export interface VKProductError {
  code: string;
  message: string;
  details?: Record<string, unknown>;
}

export class VKProductNotFoundError extends Error {
  constructor(productId: string) {
    super(`VK Product with ID ${productId} not found`);
    this.name = 'VKProductNotFoundError';
  }
}

export class VKProductServiceError extends Error {
  public code: string;
  public statusCode: number;

  constructor(message: string, code: string, statusCode: number = 500) {
    super(message);
    this.name = 'VKProductServiceError';
    this.code = code;
    this.statusCode = statusCode;
  }
}
