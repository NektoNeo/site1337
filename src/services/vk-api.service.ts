/**
 * VK API Service
 * Client for interacting with VK Market API
 *
 * VK API Documentation: https://dev.vk.com/method/market
 * API Version: 5.199
 */

import {
  VKApiResponse,
  VKApiError,
  VKMarketGetResponse,
  VKMarketGetByIdResponse,
  VKMarketSearchResponse,
  VKMarketAlbumsResponse,
  VKMarketGetParams,
  VKMarketGetByIdParams,
  VKMarketSearchParams,
  VKMarketAlbumsParams,
  VKMarketItem,
  VKMarketAlbum,
  isVKApiError,
} from '@/types/vk';

// VK API Configuration
const VK_API_BASE_URL = 'https://api.vk.com/method';
const VK_API_VERSION = '5.199';

// Default group ID for vapcbuild (will be resolved or set via env)
// Group short name: vapcbuild
// You can find the numeric ID by visiting https://vk.com/vapcbuild and looking at the page source
// or using https://regvk.com/id/ to convert
const DEFAULT_GROUP_SCREEN_NAME = 'vapcbuild';

/**
 * VK API Error class
 */
export class VKApiServiceError extends Error {
  public code: number;
  public vkErrorCode?: number;

  constructor(message: string, code: number, vkErrorCode?: number) {
    super(message);
    this.name = 'VKApiServiceError';
    this.code = code;
    this.vkErrorCode = vkErrorCode;
  }
}

/**
 * Rate limiter for VK API (3 requests per second)
 */
class RateLimiter {
  private queue: Array<() => void> = [];
  private lastRequestTime = 0;
  private readonly minInterval = 334; // ~3 requests per second

  async waitForSlot(): Promise<void> {
    const now = Date.now();
    const timeSinceLastRequest = now - this.lastRequestTime;

    if (timeSinceLastRequest < this.minInterval) {
      await new Promise(resolve =>
        setTimeout(resolve, this.minInterval - timeSinceLastRequest)
      );
    }

    this.lastRequestTime = Date.now();
  }
}

const rateLimiter = new RateLimiter();

/**
 * VK API Service Class
 */
export class VKApiService {
  private accessToken: string;
  private groupId: number | null = null;

  constructor(accessToken?: string) {
    this.accessToken = accessToken || process.env.VK_ACCESS_TOKEN || '';

    if (!this.accessToken) {
      console.warn(
        'VK_ACCESS_TOKEN is not set. VK API calls will fail. ' +
        'Please set the VK_ACCESS_TOKEN environment variable.'
      );
    }

    // Try to get group ID from environment
    const envGroupId = process.env.VK_GROUP_ID;
    if (envGroupId) {
      this.groupId = parseInt(envGroupId, 10);
    }
  }

  /**
   * Make a request to VK API
   */
  private async request<T>(
    method: string,
    params: Record<string, unknown>
  ): Promise<T> {
    await rateLimiter.waitForSlot();

    // Build query parameters
    const queryParams = new URLSearchParams();
    queryParams.append('access_token', this.accessToken);
    queryParams.append('v', VK_API_VERSION);

    for (const [key, value] of Object.entries(params)) {
      if (value !== undefined) {
        queryParams.append(key, String(value));
      }
    }

    const url = `${VK_API_BASE_URL}/${method}?${queryParams.toString()}`;

    try {
      const response = await fetch(url, {
        method: 'GET',
        headers: {
          'Accept': 'application/json',
        },
        // Note: In production, consider adding retry logic
      });

      if (!response.ok) {
        throw new VKApiServiceError(
          `HTTP error: ${response.status} ${response.statusText}`,
          response.status
        );
      }

      const data = await response.json();

      // Check for VK API error
      if (isVKApiError(data)) {
        const error = data as VKApiError;
        throw new VKApiServiceError(
          `VK API Error: ${error.error.error_msg}`,
          500,
          error.error.error_code
        );
      }

      return (data as VKApiResponse<T>).response;
    } catch (error) {
      if (error instanceof VKApiServiceError) {
        throw error;
      }

      throw new VKApiServiceError(
        `Failed to fetch from VK API: ${error instanceof Error ? error.message : 'Unknown error'}`,
        500
      );
    }
  }

  /**
   * Resolve group ID from screen name
   */
  async resolveGroupId(screenName: string = DEFAULT_GROUP_SCREEN_NAME): Promise<number> {
    if (this.groupId) {
      return this.groupId;
    }

    type GroupsResolveResponse = {
      type: string;
      object_id: number;
    };

    const result = await this.request<GroupsResolveResponse>('utils.resolveScreenName', {
      screen_name: screenName,
    });

    if (!result || result.type !== 'group') {
      throw new VKApiServiceError(
        `Could not resolve group: ${screenName}`,
        404
      );
    }

    // Store for future use (negative for groups)
    this.groupId = -result.object_id;
    return this.groupId;
  }

  /**
   * Get market items (products) from a group
   */
  async getMarketItems(
    groupId?: number,
    count: number = 50,
    offset: number = 0,
    albumId?: number
  ): Promise<VKMarketGetResponse> {
    const ownerId = groupId || await this.resolveGroupId();

    const params: VKMarketGetParams = {
      owner_id: ownerId,
      count: Math.min(count, 200), // VK max is 200
      offset,
      extended: 1,
      album_id: albumId,
    };

    return this.request<VKMarketGetResponse>('market.get', params);
  }

  /**
   * Get a single market item by ID
   */
  async getMarketItemById(
    ownerId: number,
    itemId: number
  ): Promise<VKMarketItem | null> {
    const itemIds = `${ownerId}_${itemId}`;

    const params: VKMarketGetByIdParams = {
      item_ids: itemIds,
      extended: 1,
    };

    const response = await this.request<VKMarketGetByIdResponse>('market.getById', params);

    if (response.items && response.items.length > 0) {
      return response.items[0];
    }

    return null;
  }

  /**
   * Get multiple market items by IDs
   */
  async getMarketItemsByIds(
    items: Array<{ ownerId: number; itemId: number }>
  ): Promise<VKMarketItem[]> {
    if (items.length === 0) return [];

    // VK allows up to 100 items per request
    const batchSize = 100;
    const results: VKMarketItem[] = [];

    for (let i = 0; i < items.length; i += batchSize) {
      const batch = items.slice(i, i + batchSize);
      const itemIds = batch.map(item => `${item.ownerId}_${item.itemId}`).join(',');

      const params: VKMarketGetByIdParams = {
        item_ids: itemIds,
        extended: 1,
      };

      const response = await this.request<VKMarketGetByIdResponse>('market.getById', params);

      if (response.items) {
        results.push(...response.items);
      }
    }

    return results;
  }

  /**
   * Search market items
   */
  async searchMarketItems(
    query: string,
    groupId?: number,
    options: {
      count?: number;
      offset?: number;
      priceFrom?: number;
      priceTo?: number;
      sort?: 0 | 1 | 2 | 3;
      albumId?: number;
    } = {}
  ): Promise<VKMarketSearchResponse> {
    const ownerId = groupId || await this.resolveGroupId();

    const params: VKMarketSearchParams = {
      owner_id: ownerId,
      q: query,
      count: Math.min(options.count || 50, 200),
      offset: options.offset || 0,
      extended: 1,
      price_from: options.priceFrom,
      price_to: options.priceTo,
      sort: options.sort,
      album_id: options.albumId,
    };

    return this.request<VKMarketSearchResponse>('market.search', params);
  }

  /**
   * Get market albums (categories/collections)
   */
  async getMarketAlbums(
    groupId?: number,
    count: number = 100,
    offset: number = 0
  ): Promise<VKMarketAlbumsResponse> {
    const ownerId = groupId || await this.resolveGroupId();

    const params: VKMarketAlbumsParams = {
      owner_id: ownerId,
      count: Math.min(count, 100),
      offset,
    };

    return this.request<VKMarketAlbumsResponse>('market.getAlbums', params);
  }

  /**
   * Get all market items with pagination
   * Fetches all products by making multiple requests
   */
  async getAllMarketItems(
    groupId?: number,
    maxItems: number = 1000
  ): Promise<VKMarketItem[]> {
    const ownerId = groupId || await this.resolveGroupId();
    const batchSize = 200;
    const allItems: VKMarketItem[] = [];
    let offset = 0;

    while (allItems.length < maxItems) {
      const response = await this.getMarketItems(ownerId, batchSize, offset);

      if (!response.items || response.items.length === 0) {
        break;
      }

      allItems.push(...response.items);
      offset += batchSize;

      // Check if we've fetched all items
      if (allItems.length >= response.count) {
        break;
      }
    }

    return allItems.slice(0, maxItems);
  }

  /**
   * Get all albums (categories)
   */
  async getAllMarketAlbums(groupId?: number): Promise<VKMarketAlbum[]> {
    const ownerId = groupId || await this.resolveGroupId();
    const batchSize = 100;
    const allAlbums: VKMarketAlbum[] = [];
    let offset = 0;

    while (true) {
      const response = await this.getMarketAlbums(ownerId, batchSize, offset);

      if (!response.items || response.items.length === 0) {
        break;
      }

      allAlbums.push(...response.items);
      offset += batchSize;

      if (allAlbums.length >= response.count) {
        break;
      }
    }

    return allAlbums;
  }

  /**
   * Get products by album
   */
  async getProductsByAlbum(
    albumId: number,
    groupId?: number,
    count: number = 50,
    offset: number = 0
  ): Promise<VKMarketGetResponse> {
    return this.getMarketItems(groupId, count, offset, albumId);
  }
}

// Singleton instance
let vkApiServiceInstance: VKApiService | null = null;

/**
 * Get VK API Service singleton instance
 */
export function getVKApiService(): VKApiService {
  if (!vkApiServiceInstance) {
    vkApiServiceInstance = new VKApiService();
  }
  return vkApiServiceInstance;
}

/**
 * Create new VK API Service instance with custom token
 */
export function createVKApiService(accessToken: string): VKApiService {
  return new VKApiService(accessToken);
}

export default VKApiService;
