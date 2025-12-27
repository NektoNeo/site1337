/**
 * VK API Types for Market Integration
 * API Version: 5.199
 * Documentation: https://dev.vk.com/method/market
 */

// VK API Generic Response Wrapper
export interface VKApiResponse<T> {
  response: T;
}

export interface VKApiError {
  error: {
    error_code: number;
    error_msg: string;
    request_params: Array<{
      key: string;
      value: string;
    }>;
  };
}

// Price Types
export interface VKCurrency {
  id: number;
  name: string;
  title?: string;
}

export interface VKPrice {
  amount: string; // Price in minimal currency units (kopeks for RUB)
  currency: VKCurrency;
  text: string; // Formatted price string e.g., "1 500 ₽"
  old_amount?: string; // Original price if discounted
  old_amount_text?: string;
}

// Photo Types
export interface VKPhotoSize {
  type: string; // s, m, x, o, p, q, r, y, z, w
  url: string;
  width: number;
  height: number;
}

export interface VKMarketPhoto {
  id: number;
  album_id: number;
  owner_id: number;
  user_id?: number;
  sizes: VKPhotoSize[];
  text?: string;
  date: number;
  web_view_token?: string;
}

// Category Types
export interface VKMarketSection {
  id: number;
  name: string;
}

export interface VKMarketCategory {
  id: number;
  name: string;
  section: VKMarketSection;
}

// Market Item Dimensions
export interface VKMarketDimensions {
  width: number;
  height: number;
  length: number;
  [key: string]: number;
}

// Market Item Availability
export enum VKMarketAvailability {
  Available = 0,
  Removed = 1,
  Unavailable = 2,
}

// Main Market Item Type
export interface VKMarketItem {
  id: number;
  owner_id: number;
  title: string;
  description: string;
  price: VKPrice;
  dimensions?: VKMarketDimensions;
  weight?: number;
  category: VKMarketCategory;
  thumb_photo: string;
  date: number;
  availability: VKMarketAvailability;
  is_favorite?: boolean;
  sku?: string;

  // Photos (extended)
  photos?: VKMarketPhoto[];

  // Social stats
  can_comment: number;
  can_repost: number;
  likes?: {
    user_likes: number;
    count: number;
  };
  reposts?: {
    count: number;
  };
  views_count?: number;

  // Albums/Collections
  albums_ids?: number[];

  // URLs
  url?: string;
  button_title?: string;
  external_id?: string;

  // Variants (for items with options)
  variants_grouping_id?: number;
  is_main_variant?: boolean;

  // Additional fields
  cart_quantity?: number;
  is_adult?: boolean;
}

// Market Album (Category/Collection)
export interface VKMarketAlbum {
  id: number;
  owner_id: number;
  title: string;
  photo?: VKMarketPhoto;
  count: number;
  updated_time: number;
  is_main?: boolean;
  is_hidden?: boolean;
}

// API Response Types
export interface VKMarketGetResponse {
  count: number;
  items: VKMarketItem[];
}

export interface VKMarketGetByIdResponse {
  count: number;
  items: VKMarketItem[];
}

export interface VKMarketSearchResponse {
  count: number;
  items: VKMarketItem[];
}

export interface VKMarketAlbumsResponse {
  count: number;
  items: VKMarketAlbum[];
}

// Request Parameters
export interface VKMarketGetParams {
  owner_id: number;
  album_id?: number;
  count?: number;
  offset?: number;
  extended?: 0 | 1;
  date_from?: string;
  date_to?: string;
  need_variants?: 0 | 1;
  with_disabled?: 0 | 1;
  [key: string]: string | number | undefined;
}

export interface VKMarketGetByIdParams {
  item_ids: string; // Format: "owner_id_item_id" or "owner_id_item_id,owner_id_item_id"
  extended?: 0 | 1;
  [key: string]: string | number | undefined;
}

export interface VKMarketSearchParams {
  owner_id: number;
  album_id?: number;
  q?: string;
  price_from?: number;
  price_to?: number;
  sort?: 0 | 1 | 2 | 3; // 0 - default, 1 - date desc, 2 - price asc, 3 - price desc
  rev?: 0 | 1;
  offset?: number;
  count?: number;
  extended?: 0 | 1;
  status?: number;
  need_variants?: 0 | 1;
  [key: string]: string | number | undefined;
}

export interface VKMarketAlbumsParams {
  owner_id: number;
  offset?: number;
  count?: number;
  [key: string]: string | number | undefined;
}

// Type guards
export function isVKApiError(response: unknown): response is VKApiError {
  return (
    typeof response === 'object' &&
    response !== null &&
    'error' in response &&
    typeof (response as VKApiError).error === 'object'
  );
}

export function isVKMarketItem(item: unknown): item is VKMarketItem {
  return (
    typeof item === 'object' &&
    item !== null &&
    'id' in item &&
    'owner_id' in item &&
    'title' in item &&
    'price' in item
  );
}
