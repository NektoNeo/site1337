/**
 * VK Market to Database Sync Service
 * Syncs products from VK Market to local Prisma database
 *
 * This service handles:
 * - Fetching all products from VK Market
 * - Creating/updating categories from VK albums
 * - Upserting products to local database
 * - Managing product images
 * - Tracking sync statistics
 *
 * Performance Optimizations:
 * - Parallel product processing with controlled concurrency
 * - Batch database operations where possible
 * - Progress tracking with estimated time
 */

import { prisma, Prisma } from '@/lib/prisma';
import { getVKApiService } from './vk-api.service';
import { VKMarketItem, VKMarketAlbum } from '@/types/vk';

// Concurrency control for parallel processing
const PARALLEL_BATCH_SIZE = 5; // Process 5 products in parallel

// ============================================================================
// TYPES
// ============================================================================

export interface SyncResult {
  success: boolean;
  timestamp: Date;
  duration: number; // in milliseconds
  stats: {
    productsProcessed: number;
    productsCreated: number;
    productsUpdated: number;
    productsSkipped: number;
    productsFailed: number;
    categoriesProcessed: number;
    categoriesCreated: number;
    categoriesUpdated: number;
    imagesProcessed: number;
  };
  errors: SyncError[];
}

export interface SyncError {
  type: 'product' | 'category' | 'image' | 'api';
  itemId?: string;
  message: string;
  details?: string;
}

export interface SyncOptions {
  /** Maximum number of products to sync (default: 1000) */
  maxProducts?: number;
  /** Sync specific album/category only */
  albumId?: number;
  /** Force update even if product hasn't changed */
  forceUpdate?: boolean;
  /** Skip deactivating products not found in VK */
  skipDeactivation?: boolean;
  /** Dry run - don't actually save to database */
  dryRun?: boolean;
}

// ============================================================================
// UTILITY FUNCTIONS
// ============================================================================

/**
 * Generate URL-friendly slug from title
 */
function generateSlug(title: string): string {
  return title
    .toLowerCase()
    .replace(/[^a-zA-Z0-9\u0400-\u04FF\s-]/g, '')
    .replace(/[\s_]+/g, '-')
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
    .replace(/^-+|-+$/g, '')
    .substring(0, 100);
}

/**
 * Generate unique slug by appending suffix if needed
 */
async function generateUniqueSlug(
  baseSlug: string,
  existingId?: string
): Promise<string> {
  let slug = baseSlug;
  let counter = 1;

  while (true) {
    const existing = await prisma.product.findFirst({
      where: {
        slug,
        id: existingId ? { not: existingId } : undefined,
      },
      select: { id: true },
    });

    if (!existing) {
      return slug;
    }

    slug = `${baseSlug}-${counter}`;
    counter++;

    if (counter > 100) {
      throw new Error(`Could not generate unique slug for: ${baseSlug}`);
    }
  }
}

/**
 * Generate unique category slug
 */
async function generateUniqueCategorySlug(
  baseSlug: string,
  existingId?: string
): Promise<string> {
  let slug = baseSlug;
  let counter = 1;

  while (true) {
    const existing = await prisma.category.findFirst({
      where: {
        slug,
        id: existingId ? { not: existingId } : undefined,
      },
      select: { id: true },
    });

    if (!existing) {
      return slug;
    }

    slug = `${baseSlug}-${counter}`;
    counter++;

    if (counter > 100) {
      throw new Error(`Could not generate unique category slug for: ${baseSlug}`);
    }
  }
}

/**
 * Generate SKU from VK item
 */
function generateSku(item: VKMarketItem): string {
  if (item.sku) {
    return item.sku;
  }
  // Generate SKU from owner_id and item_id
  return `VK-${Math.abs(item.owner_id)}-${item.id}`;
}

/**
 * Convert VK price (kopeks) to rubles as number
 */
function convertPrice(amount: string): number {
  const kopeks = parseInt(amount, 10);
  return kopeks / 100;
}

/**
 * Get best photo URL from VK photo sizes
 */
function getBestPhotoUrl(
  sizes: Array<{ type: string; url: string; width: number; height: number }>
): string {
  const preferredTypes = ['w', 'z', 'y', 'x', 'r', 'q', 'p', 'o', 'm', 's'];
  
  for (const type of preferredTypes) {
    const size = sizes.find(s => s.type === type);
    if (size) return size.url;
  }
  
  // Fallback to largest available
  const sorted = [...sizes].sort((a, b) => (b.width * b.height) - (a.width * a.height));
  return sorted[0]?.url || '';
}

// ============================================================================
// SYNC SERVICE CLASS
// ============================================================================

export class VKSyncService {
  private vkApi = getVKApiService();
  private errors: SyncError[] = [];
  private stats = {
    productsProcessed: 0,
    productsCreated: 0,
    productsUpdated: 0,
    productsSkipped: 0,
    productsFailed: 0,
    categoriesProcessed: 0,
    categoriesCreated: 0,
    categoriesUpdated: 0,
    imagesProcessed: 0,
  };

  /**
   * Split array into chunks for parallel processing
   */
  private chunkArray<T>(array: T[], size: number): T[][] {
    const chunks: T[][] = [];
    for (let i = 0; i < array.length; i += size) {
      chunks.push(array.slice(i, i + size));
    }
    return chunks;
  }

  /**
   * Sync categories from VK albums
   */
  async syncCategories(albums: VKMarketAlbum[]): Promise<Map<number, string>> {
    const albumToCategoryMap = new Map<number, string>();

    for (const album of albums) {
      try {
        this.stats.categoriesProcessed++;

        const baseSlug = generateSlug(album.title);
        
        // Check if category exists by VK album pattern in description or by slug
        let existingCategory = await prisma.category.findFirst({
          where: {
            OR: [
              { description: { contains: `vk_album_id:${album.id}` } },
              { slug: baseSlug },
            ],
          },
        });

        let imageUrl: string | undefined;
        if (album.photo?.sizes) {
          imageUrl = getBestPhotoUrl(album.photo.sizes);
        }

        if (existingCategory) {
          // Update existing category
          existingCategory = await prisma.category.update({
            where: { id: existingCategory.id },
            data: {
              name: album.title,
              imageUrl,
              description: `vk_album_id:${album.id}`,
              updatedAt: new Date(),
            },
          });
          this.stats.categoriesUpdated++;
        } else {
          // Create new category
          const uniqueSlug = await generateUniqueCategorySlug(baseSlug);
          existingCategory = await prisma.category.create({
            data: {
              name: album.title,
              slug: uniqueSlug,
              description: `vk_album_id:${album.id}`,
              imageUrl,
              isActive: !album.is_hidden,
              sortOrder: album.is_main ? 0 : 100,
            },
          });
          this.stats.categoriesCreated++;
        }

        albumToCategoryMap.set(album.id, existingCategory.id);
      } catch (error) {
        this.errors.push({
          type: 'category',
          itemId: String(album.id),
          message: `Failed to sync category: ${album.title}`,
          details: error instanceof Error ? error.message : String(error),
        });
      }
    }

    return albumToCategoryMap;
  }

  /**
   * Sync a single product from VK to database
   */
  async syncProduct(
    item: VKMarketItem,
    albumToCategoryMap: Map<number, string>,
    options: SyncOptions
  ): Promise<void> {
    try {
      this.stats.productsProcessed++;

      // Generate VK item ID for matching
      const vkItemId = `${item.owner_id}_${item.id}`;
      const sku = generateSku(item);

      // Check if product exists
      let existingProduct = await prisma.product.findFirst({
        where: {
          OR: [
            { vkItemId },
            { sku },
          ],
        },
        include: { images: true },
      });

      // Determine category
      let categoryId: string | undefined;
      if (item.albums_ids && item.albums_ids.length > 0) {
        categoryId = albumToCategoryMap.get(item.albums_ids[0]);
      }

      // If no category found, create/get a default "VK Market" category
      if (!categoryId) {
        const defaultCategory = await this.getOrCreateDefaultCategory();
        categoryId = defaultCategory.id;
      }

      // Prepare product data
      const productData: Prisma.ProductUpdateInput = {
        name: item.title,
        description: item.description || null,
        price: convertPrice(item.price.amount),
        salePrice: item.price.old_amount 
          ? convertPrice(item.price.old_amount)
          : null,
        stock: item.availability === 0 ? 10 : 0, // Available = 10, else 0
        isActive: item.availability === 0,
        vkItemId,
        specs: {
          vk_category: item.category?.name,
          vk_section: item.category?.section?.name,
          dimensions: item.dimensions,
          weight: item.weight,
        },
        category: { connect: { id: categoryId } },
      };

      if (options.dryRun) {
        if (existingProduct) {
          this.stats.productsUpdated++;
        } else {
          this.stats.productsCreated++;
        }
        return;
      }

      if (existingProduct) {
        // Update existing product
        await prisma.product.update({
          where: { id: existingProduct.id },
          data: productData,
        });
        this.stats.productsUpdated++;

        // Update images
        await this.syncProductImages(existingProduct.id, item);
      } else {
        // Create new product
        const baseSlug = generateSlug(item.title);
        const uniqueSlug = await generateUniqueSlug(baseSlug);

        const newProduct = await prisma.product.create({
          data: {
            ...productData as Prisma.ProductCreateInput,
            sku,
            slug: uniqueSlug,
            category: { connect: { id: categoryId } },
          },
        });
        this.stats.productsCreated++;

        // Create images
        await this.syncProductImages(newProduct.id, item);
      }
    } catch (error) {
      this.stats.productsFailed++;
      this.errors.push({
        type: 'product',
        itemId: `${item.owner_id}_${item.id}`,
        message: `Failed to sync product: ${item.title}`,
        details: error instanceof Error ? error.message : String(error),
      });
    }
  }

  /**
   * Sync product images
   */
  private async syncProductImages(
    productId: string,
    item: VKMarketItem
  ): Promise<void> {
    try {
      // Delete existing images
      await prisma.productImage.deleteMany({
        where: { productId },
      });

      const images: Prisma.ProductImageCreateManyInput[] = [];

      // Add main thumbnail
      if (item.thumb_photo) {
        images.push({
          productId,
          url: item.thumb_photo,
          alt: item.title,
          sortOrder: 0,
          isPrimary: true,
        });
        this.stats.imagesProcessed++;
      }

      // Add additional photos
      if (item.photos && item.photos.length > 0) {
        item.photos.forEach((photo, index) => {
          const url = getBestPhotoUrl(photo.sizes);
          if (url && url !== item.thumb_photo) {
            images.push({
              productId,
              url,
              alt: `${item.title} - Image ${index + 1}`,
              sortOrder: index + 1,
              isPrimary: false,
            });
            this.stats.imagesProcessed++;
          }
        });
      }

      if (images.length > 0) {
        await prisma.productImage.createMany({
          data: images,
        });
      }
    } catch (error) {
      this.errors.push({
        type: 'image',
        itemId: productId,
        message: 'Failed to sync product images',
        details: error instanceof Error ? error.message : String(error),
      });
    }
  }

  /**
   * Get or create default category for products without album
   */
  private async getOrCreateDefaultCategory(): Promise<{ id: string }> {
    const defaultSlug = 'vk-market';
    
    let category = await prisma.category.findUnique({
      where: { slug: defaultSlug },
      select: { id: true },
    });

    if (!category) {
      category = await prisma.category.create({
        data: {
          name: 'VK Market',
          slug: defaultSlug,
          description: 'Products from VK Market',
          isActive: true,
          sortOrder: 999,
        },
        select: { id: true },
      });
    }

    return category;
  }

  /**
   * Deactivate products that are no longer in VK
   */
  private async deactivateRemovedProducts(
    activeVkItemIds: Set<string>
  ): Promise<number> {
    const result = await prisma.product.updateMany({
      where: {
        vkItemId: { not: null },
        isActive: true,
        NOT: {
          vkItemId: { in: Array.from(activeVkItemIds) },
        },
      },
      data: {
        isActive: false,
        stock: 0,
      },
    });

    return result.count;
  }

  /**
   * Main sync method - syncs all products from VK Market to database
   */
  async syncProducts(options: SyncOptions = {}): Promise<SyncResult> {
    const startTime = Date.now();
    
    // Reset stats and errors
    this.errors = [];
    this.stats = {
      productsProcessed: 0,
      productsCreated: 0,
      productsUpdated: 0,
      productsSkipped: 0,
      productsFailed: 0,
      categoriesProcessed: 0,
      categoriesCreated: 0,
      categoriesUpdated: 0,
      imagesProcessed: 0,
    };

    try {
      // Step 1: Fetch albums (categories) from VK
      console.log('[VK Sync] Fetching albums from VK...');
      const albums = await this.vkApi.getAllMarketAlbums();
      console.log(`[VK Sync] Found ${albums.length} albums`);

      // Step 2: Sync categories
      console.log('[VK Sync] Syncing categories...');
      const albumToCategoryMap = await this.syncCategories(albums);

      // Step 3: Fetch products from VK
      console.log('[VK Sync] Fetching products from VK...');
      let products: VKMarketItem[];
      
      if (options.albumId) {
        const response = await this.vkApi.getProductsByAlbum(
          options.albumId,
          undefined,
          options.maxProducts || 200
        );
        products = response.items || [];
      } else {
        products = await this.vkApi.getAllMarketItems(
          undefined,
          options.maxProducts || 1000
        );
      }
      
      console.log(`[VK Sync] Found ${products.length} products`);

      // Step 4: Sync products in parallel batches
      console.log('[VK Sync] Syncing products with parallel processing...');
      const activeVkItemIds = new Set<string>();

      // Collect all VK item IDs first
      for (const item of products) {
        const vkItemId = `${item.owner_id}_${item.id}`;
        activeVkItemIds.add(vkItemId);
      }

      // Process products in parallel batches
      const batches = this.chunkArray(products, PARALLEL_BATCH_SIZE);
      let processedBatches = 0;

      for (const batch of batches) {
        // Process each batch in parallel using Promise.allSettled
        // This ensures one failure doesn't stop the entire batch
        const results = await Promise.allSettled(
          batch.map(item => this.syncProduct(item, albumToCategoryMap, options))
        );

        // Log any rejections (errors are already tracked in syncProduct)
        for (const result of results) {
          if (result.status === 'rejected') {
            console.error('[VK Sync] Batch item failed:', result.reason);
          }
        }

        processedBatches++;
        const progress = Math.round((processedBatches / batches.length) * 100);
        console.log(`[VK Sync] Progress: ${progress}% (${this.stats.productsProcessed}/${products.length} products)`);
      }

      // Step 5: Deactivate removed products (if not skipped)
      if (!options.skipDeactivation && !options.dryRun) {
        console.log('[VK Sync] Checking for removed products...');
        const deactivatedCount = await this.deactivateRemovedProducts(activeVkItemIds);
        if (deactivatedCount > 0) {
          console.log(`[VK Sync] Deactivated ${deactivatedCount} products`);
        }
      }

      const duration = Date.now() - startTime;
      console.log(`[VK Sync] Sync completed in ${duration}ms`);

      return {
        success: this.errors.length === 0,
        timestamp: new Date(),
        duration,
        stats: { ...this.stats },
        errors: [...this.errors],
      };
    } catch (error) {
      const duration = Date.now() - startTime;

      this.errors.push({
        type: 'api',
        message: 'Sync failed',
        details: error instanceof Error ? error.message : String(error),
      });

      return {
        success: false,
        timestamp: new Date(),
        duration,
        stats: { ...this.stats },
        errors: [...this.errors],
      };
    }
  }

  /**
   * Get sync status - useful for checking if sync is needed
   */
  async getSyncStatus(): Promise<{
    lastSync: Date | null;
    totalProducts: number;
    totalCategories: number;
    activeProducts: number;
  }> {
    const [totalProducts, activeProducts, totalCategories, lastProduct] = await Promise.all([
      prisma.product.count({ where: { vkItemId: { not: null } } }),
      prisma.product.count({ where: { vkItemId: { not: null }, isActive: true } }),
      prisma.category.count(),
      prisma.product.findFirst({
        where: { vkItemId: { not: null } },
        orderBy: { updatedAt: 'desc' },
        select: { updatedAt: true },
      }),
    ]);

    return {
      lastSync: lastProduct?.updatedAt || null,
      totalProducts,
      totalCategories,
      activeProducts,
    };
  }
}

// Singleton instance
let vkSyncServiceInstance: VKSyncService | null = null;

/**
 * Get VK Sync Service singleton instance
 */
export function getVKSyncService(): VKSyncService {
  if (!vkSyncServiceInstance) {
    vkSyncServiceInstance = new VKSyncService();
  }
  return vkSyncServiceInstance;
}

export default VKSyncService;
