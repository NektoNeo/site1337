// ============================================
// CATALOG PRODUCT TYPES (for product listings)
// ============================================

export interface Product {
  id: string;
  name: string;
  slug: string;
  category: 'gaming' | 'workstation' | 'streaming';
  price: number;
  salePrice?: number;
  image: string;
  specs: {
    processor: string;
    graphics: string;
    ram: string;
    storage: string;
  };
  badges?: string[];
  inStock: boolean;
  popularity: number;
}

export interface FilterState {
  categories: string[];
  priceRange: [number, number];
  processors: string[];
  graphics: string[];
  ram: string[];
}

export type SortOption = 'price-asc' | 'price-desc' | 'popularity' | 'newest';

export interface CatalogState {
  filters: FilterState;
  sort: SortOption;
  page: number;
  perPage: number;
}

// ============================================
// PRODUCT DETAIL PAGE TYPES
// ============================================

export interface ProductImage {
  id: string;
  url: string;
  alt: string;
  isMain?: boolean;
}

export interface ProductSpec {
  label: string;
  value: string;
  icon?: string;
}

export interface ProductSpecCategory {
  category: string;
  specs: ProductSpec[];
}

export interface ProductFeature {
  id: string;
  text: string;
  included: boolean;
}

export interface ProductBadge {
  id: string;
  label: string;
  value: string;
  icon?: 'cpu' | 'gpu' | 'ram' | 'storage' | 'cooling' | 'psu';
}

export interface ProductDetail {
  id: string;
  slug: string;
  name: string;
  shortDescription: string;
  fullDescription?: string;
  price: number;
  originalPrice?: number;
  currency: string;
  inStock: boolean;
  images: ProductImage[];
  badges: ProductBadge[];
  features: ProductFeature[];
  specifications: ProductSpecCategory[];
  relatedProductIds?: string[];
}

export interface RelatedProduct {
  id: string;
  slug: string;
  name: string;
  price: number;
  originalPrice?: number;
  imageUrl: string;
  badges: string[];
}

// ============================================
// API RESPONSE TYPES
// ============================================

export interface ProductsListResponse {
  products: Product[];
  total: number;
  page: number;
  pageSize: number;
  totalPages: number;
  hasMore: boolean;
}

export interface ProductDetailResponse {
  product: Product;
  relatedProducts?: Product[];
}

export interface ProductCollection {
  id: string;
  name: string;
  slug: string;
  description?: string;
  productCount: number;
}

export interface ProductCategoriesResponse {
  categories: ProductCollection[];
}

export interface ProductsQueryParams {
  page?: number;
  pageSize?: number;
  categoryId?: string;
  search?: string;
  sortBy?: 'price-asc' | 'price-desc' | 'newest' | 'popularity';
  priceFrom?: number;
  priceTo?: number;
  [key: string]: string | number | undefined;
}
