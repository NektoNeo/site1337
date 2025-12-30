/**
 * VK API Service
 * Client for interacting with VK Market API
 *
 * VK API Documentation: https://dev.vk.com/method/market
 * API Version: 5.199
 *
 * Performance Optimizations:
 * - Request deduplication for concurrent identical requests
 * - Retry logic with exponential backoff
 * - Parallel batch fetching with controlled concurrency
 * - Rate limiting (3 requests per second)
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

// Retry configuration
const MAX_RETRIES = 3;
const RETRY_BASE_DELAY_MS = 1000;
const RETRY_MAX_DELAY_MS = 10000;

// Concurrency control for parallel fetches
const MAX_CONCURRENT_REQUESTS = 2; // Conservative to respect rate limits

/**
 * VK API Error class
 */
export class VKApiServiceError extends Error {
  public code: number;
  public vkErrorCode?: number;
  public isRetryable: boolean;

  constructor(message: string, code: number, vkErrorCode?: number) {
    super(message);
    this.name = 'VKApiServiceError';
    this.code = code;
    this.vkErrorCode = vkErrorCode;
    // Retryable errors: rate limit (6), server errors (5xx), network errors
    this.isRetryable = vkErrorCode === 6 || code >= 500 || code === 0;
  }
}

/**
 * Request deduplication manager
 * Prevents duplicate concurrent requests to the same endpoint
 */
class RequestDeduplicator {
  private pendingRequests = new Map<string, Promise<unknown>>();

  /**
   * Get or create a pending request
   * If a request with the same key is in-flight, returns the existing promise
   */
  async dedupe<T>(key: string, fetcher: () => Promise<T>): Promise<T> {
    const existing = this.pendingRequests.get(key);
    if (existing) {
      return existing as Promise<T>;
    }

    const promise = fetcher()
      .finally(() => {
        this.pendingRequests.delete(key);
      });

    this.pendingRequests.set(key, promise);
    return promise;
  }

  /**
   * Check if there's a pending request for the given key
   */
  hasPending(key: string): boolean {
    return this.pendingRequests.has(key);
  }

  /**
   * Get current pending request count
   */
  get pendingCount(): number {
    return this.pendingRequests.size;
  }
}

const requestDeduplicator = new RequestDeduplicator();

/**
 * Rate limiter for VK API (3 requests per second)
 * Uses token bucket algorithm for smoother rate limiting
 */
class RateLimiter {
  private lastRequestTime = 0;
  private readonly minInterval = 334; // ~3 requests per second
  private requestQueue: Array<() => void> = [];
  private isProcessing = false;

  async waitForSlot(): Promise<void> {
    return new Promise((resolve) => {
      this.requestQueue.push(resolve);
      this.processQueue();
    });
  }

  private async processQueue(): Promise<void> {
    if (this.isProcessing || this.requestQueue.length === 0) return;

    this.isProcessing = true;

    while (this.requestQueue.length > 0) {
      const now = Date.now();
      const timeSinceLastRequest = now - this.lastRequestTime;

      if (timeSinceLastRequest < this.minInterval) {
        await new Promise(resolve =>
          setTimeout(resolve, this.minInterval - timeSinceLastRequest)
        );
      }

      this.lastRequestTime = Date.now();
      const resolve = this.requestQueue.shift();
      if (resolve) resolve();
    }

    this.isProcessing = false;
  }
}

const rateLimiter = new RateLimiter();

/**
 * Calculate exponential backoff delay
 */
function getRetryDelay(attempt: number): number {
  const delay = RETRY_BASE_DELAY_MS * Math.pow(2, attempt);
  // Add jitter to prevent thundering herd
  const jitter = Math.random() * 0.3 * delay;
  return Math.min(delay + jitter, RETRY_MAX_DELAY_MS);
}

/**
 * Sleep for specified milliseconds
 */
function sleep(ms: number): Promise<void> {
  return new Promise(resolve => setTimeout(resolve, ms));
}

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
   * Generate cache key for request deduplication
   */
  private getRequestKey(method: string, params: Record<string, unknown>): string {
    const sortedParams = Object.keys(params)
      .sort()
      .map(k => `${k}=${params[k]}`)
      .join('&');
    return `${method}:${sortedParams}`;
  }

  /**
   * Make a request to VK API with retry logic and deduplication
   */
  private async request<T>(
    method: string,
    params: Record<string, unknown>
  ): Promise<T> {
    const requestKey = this.getRequestKey(method, params);

    // Use deduplication to prevent concurrent identical requests
    return requestDeduplicator.dedupe(requestKey, async () => {
      return this.executeRequest<T>(method, params);
    });
  }

  /**
   * Execute the actual API request with retry logic
   */
  private async executeRequest<T>(
    method: string,
    params: Record<string, unknown>,
    attempt: number = 0
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
      });

      if (!response.ok) {
        const error = new VKApiServiceError(
          `HTTP error: ${response.status} ${response.statusText}`,
          response.status
        );

        // Retry on server errors
        if (error.isRetryable && attempt < MAX_RETRIES) {
          const delay = getRetryDelay(attempt);
          console.warn(`[VK API] Retrying ${method} in ${delay}ms (attempt ${attempt + 1}/${MAX_RETRIES})`);
          await sleep(delay);
          return this.executeRequest<T>(method, params, attempt + 1);
        }

        throw error;
      }

      const data = await response.json();

      // Check for VK API error
      if (isVKApiError(data)) {
        const apiError = data as VKApiError;
        const error = new VKApiServiceError(
          `VK API Error: ${apiError.error.error_msg}`,
          500,
          apiError.error.error_code
        );

        // Retry on rate limit or server errors
        if (error.isRetryable && attempt < MAX_RETRIES) {
          const delay = getRetryDelay(attempt);
          console.warn(`[VK API] Retrying ${method} in ${delay}ms (attempt ${attempt + 1}/${MAX_RETRIES}) - VK error: ${apiError.error.error_code}`);
          await sleep(delay);
          return this.executeRequest<T>(method, params, attempt + 1);
        }

        throw error;
      }

      return (data as VKApiResponse<T>).response;
    } catch (error) {
      if (error instanceof VKApiServiceError) {
        throw error;
      }

      // Network errors are retryable
      if (attempt < MAX_RETRIES) {
        const delay = getRetryDelay(attempt);
        console.warn(`[VK API] Network error, retrying ${method} in ${delay}ms (attempt ${attempt + 1}/${MAX_RETRIES})`);
        await sleep(delay);
        return this.executeRequest<T>(method, params, attempt + 1);
      }

      throw new VKApiServiceError(
        `Failed to fetch from VK API: ${error instanceof Error ? error.message : 'Unknown error'}`,
        0 // Network error
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
