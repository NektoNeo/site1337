/**
 * VK Market Item to Internal VKProduct Mapper
 * Transforms VK API responses to normalized VKProduct format
 */

import {
  VKMarketItem,
  VKMarketAlbum,
  VKMarketAvailability,
  VKPhotoSize,
} from '@/types/vk';
import {
  VKProduct,
  VKProductImage,
  VKProductPrice,
  VKProductCategory,
  VKProductCollection,
  VKProductAvailability,
  VKProductDimensions,
} from '@/types/vk-product';

/**
 * Generate URL-friendly slug from title
 */
function generateSlug(title: string): string {
  return title
    .toLowerCase()
    .replace(/[а-яё]/g, (char) => {
      const map: Record<string, string> = {
        'а': 'a', 'б': 'b', 'в': 'v', 'г': 'g', 'д': 'd',
        'е': 'e', 'ё': 'yo', 'ж': 'zh', 'з': 'z', 'и': 'i',
        'й': 'y', 'к': 'k', 'л': 'l', 'м': 'm', 'н': 'n',
        'о': 'o', 'п': 'p', 'р': 'r', 'с': 's', 'т': 't',
        'у': 'u', 'ф': 'f', 'х': 'h', 'ц': 'ts', 'ч': 'ch',
        'ш': 'sh', 'щ': 'sch', 'ъ': '', 'ы': 'y', 'ь': '',
        'э': 'e', 'ю': 'yu', 'я': 'ya',
      };
      return map[char] || char;
    })
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
    .substring(0, 100);
}

/**
 * Get best photo URL from VK photo sizes
 * Prefers larger sizes for main image
 */
function getBestPhotoUrl(sizes: VKPhotoSize[], preferredTypes: string[] = ['w', 'z', 'y', 'x']): string {
  for (const type of preferredTypes) {
    const size = sizes.find(s => s.type === type);
    if (size) return size.url;
  }
  // Fallback to largest available
  const sorted = [...sizes].sort((a, b) => (b.width * b.height) - (a.width * a.height));
  return sorted[0]?.url || '';
}

/**
 * Get thumbnail URL from VK photo sizes
 */
function getThumbnailUrl(sizes: VKPhotoSize[]): string {
  const preferredTypes = ['m', 's', 'o', 'p'];
  for (const type of preferredTypes) {
    const size = sizes.find(s => s.type === type);
    if (size) return size.url;
  }
  return getBestPhotoUrl(sizes);
}

/**
 * Convert VK photo to VKProductImage
 */
function mapVKPhotoToProductImage(photo: { id: number; sizes: VKPhotoSize[]; text?: string }, index: number): VKProductImage {
  const bestSize = [...photo.sizes].sort((a, b) => (b.width * b.height) - (a.width * a.height))[0];

  return {
    id: `photo_${photo.id}`,
    url: getBestPhotoUrl(photo.sizes),
    width: bestSize?.width || 0,
    height: bestSize?.height || 0,
    alt: photo.text || `Product image ${index + 1}`,
    thumbnail: getThumbnailUrl(photo.sizes),
  };
}

/**
 * Convert VK price to VKProductPrice
 */
function mapVKPriceToProductPrice(vkPrice: VKMarketItem['price']): VKProductPrice {
  // VK returns amount in minimal units (kopeks), convert to rubles
  const amount = parseInt(vkPrice.amount, 10) / 100;
  const originalAmount = vkPrice.old_amount ? parseInt(vkPrice.old_amount, 10) / 100 : undefined;

  return {
    amount,
    currency: vkPrice.currency.name,
    formatted: vkPrice.text,
    originalAmount,
    originalFormatted: vkPrice.old_amount_text,
    hasDiscount: !!vkPrice.old_amount,
  };
}

/**
 * Convert VK category to VKProductCategory
 */
function mapVKCategoryToProductCategory(vkCategory: VKMarketItem['category']): VKProductCategory {
  return {
    id: String(vkCategory.id),
    name: vkCategory.name,
    section: vkCategory.section ? {
      id: String(vkCategory.section.id),
      name: vkCategory.section.name,
    } : undefined,
  };
}

/**
 * Convert VK availability to VKProductAvailability
 */
function mapVKAvailability(availability: VKMarketAvailability): VKProductAvailability {
  switch (availability) {
    case VKMarketAvailability.Available:
      return 'in_stock';
    case VKMarketAvailability.Unavailable:
      return 'out_of_stock';
    case VKMarketAvailability.Removed:
      return 'removed';
    default:
      return 'out_of_stock';
  }
}

/**
 * Convert VK dimensions to VKProductDimensions
 */
function mapVKDimensions(dimensions: VKMarketItem['dimensions']): VKProductDimensions | undefined {
  if (!dimensions) return undefined;

  return {
    width: dimensions.width,
    height: dimensions.height,
    length: dimensions.length,
    unit: 'mm', // VK uses millimeters
  };
}

/**
 * Generate VK Market URL for a product
 */
function generateVKProductUrl(ownerId: number, itemId: number): string {
  // Owner ID is negative for groups
  const groupId = Math.abs(ownerId);
  return `https://vk.com/market-${groupId}?w=product-${ownerId}_${itemId}`;
}

/**
 * Main mapper: Convert VKMarketItem to VKProduct
 */
export function mapVKMarketItemToProduct(item: VKMarketItem): VKProduct {
  // Build images array from photos or thumb_photo
  const images: VKProductImage[] = [];

  if (item.photos && item.photos.length > 0) {
    item.photos.forEach((photo, index) => {
      images.push(mapVKPhotoToProductImage(photo, index));
    });
  } else if (item.thumb_photo) {
    // If no photos array, create a simple image from thumb_photo
    images.push({
      id: `thumb_${item.id}`,
      url: item.thumb_photo,
      width: 0, // Unknown
      height: 0,
      alt: item.title,
    });
  }

  const createdDate = new Date(item.date * 1000);

  return {
    id: `${Math.abs(item.owner_id)}_${item.id}`,
    externalId: String(item.id),
    ownerId: String(item.owner_id),

    title: item.title,
    description: item.description,
    slug: generateSlug(item.title),
    sku: item.sku,

    price: mapVKPriceToProductPrice(item.price),
    category: mapVKCategoryToProductCategory(item.category),

    images,
    thumbnailUrl: item.thumb_photo,

    availability: mapVKAvailability(item.availability),

    dimensions: mapVKDimensions(item.dimensions),
    weight: item.weight,

    likesCount: item.likes?.count || 0,
    viewsCount: item.views_count || 0,

    createdAt: createdDate,
    updatedAt: createdDate, // VK doesn't provide update time, using creation time

    vkUrl: generateVKProductUrl(item.owner_id, item.id),

    isAdult: item.is_adult || false,
    isFavorite: item.is_favorite || false,

    albumIds: (item.albums_ids || []).map(String),
  };
}

/**
 * Batch convert VK items to VKProducts
 */
export function mapVKMarketItemsToProducts(items: VKMarketItem[]): VKProduct[] {
  return items.map(mapVKMarketItemToProduct);
}

/**
 * Convert VKMarketAlbum to VKProductCollection
 */
export function mapVKAlbumToCollection(album: VKMarketAlbum): VKProductCollection {
  let imageUrl: string | undefined;

  if (album.photo && album.photo.sizes && album.photo.sizes.length > 0) {
    imageUrl = getBestPhotoUrl(album.photo.sizes);
  }

  return {
    id: String(album.id),
    name: album.title,
    imageUrl,
    productCount: album.count,
    updatedAt: new Date(album.updated_time * 1000),
    isMain: album.is_main || false,
    isHidden: album.is_hidden || false,
  };
}

/**
 * Batch convert VK albums to VKProductCollections
 */
export function mapVKAlbumsToCollections(albums: VKMarketAlbum[]): VKProductCollection[] {
  return albums.map(mapVKAlbumToCollection);
}

/**
 * Extract unique categories from products
 */
export function extractCategoriesFromProducts(products: VKProduct[]): VKProductCategory[] {
  const categoryMap = new Map<string, VKProductCategory>();

  for (const product of products) {
    if (!categoryMap.has(product.category.id)) {
      categoryMap.set(product.category.id, product.category);
    }
  }

  return Array.from(categoryMap.values());
}
