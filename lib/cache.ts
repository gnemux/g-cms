/**
 * Cache data type
 * @template T Type of cached data
 */
type CacheData<T> = {
  data: T;           // Cached data
  timestamp: number; // Cache timestamp
}

/**
 * Asset cache type
 * Used to store binary resource files
 */
type AssetCache = {
  buffer: Buffer;     // Binary data
  contentType: string;// Content type
  sha: string;        // Git SHA value
  timestamp: number;  // Cache timestamp
}

/**
 * Global cache type definition
 * Ensure consistency with definition in PostService.ts
 */
declare global {
  var __postCache: {
    instance: any;                           // Cache instance
    cache: Map<string, CacheData<any>>;      // Data cache
    assetCache: Map<string, AssetCache>;     // Asset cache
    initialized: boolean;                     // Initialization status
    forceRefresh: boolean;                   // Force refresh flag
  }
}

// Initialize global cache object
if (!global.__postCache) {
  global.__postCache = {
    instance: undefined,
    cache: new Map(),
    assetCache: new Map(),
    initialized: false,
    forceRefresh: false
  }
}

/**
 * Post cache management class
 * Provides functionality for cache creation, retrieval, and invalidation
 */
class PostCache {
  private _cacheEnabled: boolean; // Cache switch status

  /**
   * Private constructor to ensure singleton pattern
   */
  private constructor() {
    this._cacheEnabled = process.env.NEXT_PUBLIC_ENABLE_CACHE !== 'false';
    console.log('cache: Initializing cache instance, cache switch:', this._cacheEnabled)
  }

  /**
   * Get global cache instance
   * @returns PostCache instance
   */
  static getInstance(): PostCache {
    if (!global.__postCache.instance) {
      global.__postCache.instance = new PostCache();
    }
    return global.__postCache.instance;
  }

  /**
   * Get cached data
   * @template T Data type
   * @param key Cache key
   * @param fetchFn Function to fetch data
   * @returns Promise<T>
   */
  async get<T>(key: string, fetchFn: () => Promise<T>): Promise<T> {
    if (!this._cacheEnabled) {
      console.log('cache: Cache disabled, fetching new data')
      return await fetchFn();
    }

    const cached = global.__postCache.cache.get(key);
    if (cached) {
      console.log(`cache: Cache hit, key: ${key}`)
      return cached.data as T;
    }

    console.log(`cache: Cache miss, key: ${key}, fetching new data`)
    const data = await fetchFn();
    global.__postCache.cache.set(key, { 
      data, 
      timestamp: Date.now() 
    });
    global.__postCache.initialized = true;
    return data;
  }

  /**
   * Clear cache
   * @param key Optional cache key, clears all cache if not provided
   */
  invalidate(key?: string) {
    if (key) {
      console.log(`cache: Clearing cache, key: ${key}`)
      global.__postCache.cache.delete(key);
    } else {
      console.log('cache: Clearing all cache')
      global.__postCache.cache.clear();
    }
    global.__postCache.initialized = false;
  }

  /**
   * Check if cache is initialized
   */
  isInitialized(): boolean {
    return global.__postCache.initialized;
  }

  /**
   * Get cache switch status
   */
  isCacheEnabled(): boolean {
    return this._cacheEnabled;
  }

  /**
   * Get cache debug information
   */
  getDebugInfo() {
    const debugCache = new Map<string, {
      timestamp: number;
      dataPreview: any;
    }>()

    global.__postCache.cache.forEach((value, key) => {
      debugCache.set(key, {
        timestamp: value.timestamp,
        dataPreview: this.createDataPreview(value.data)
      })
    })

    return debugCache
  }

  /**
   * Create data preview
   * @private
   */
  private createDataPreview(data: any) {
    if (Array.isArray(data)) {
      return {
        type: 'array',
        length: data.length,
        items: data.map(item => {
          if (typeof item === 'object') {
            return {
              ...Object.fromEntries(
                Object.entries(item).map(([k, v]) => [
                  k,
                  typeof v === 'string' && v.length > 100 
                    ? v.slice(0, 100) + '...' 
                    : v
                ])
              )
            }
          }
          return item
        })
      }
    }

    if (typeof data === 'object' && data !== null) {
      return {
        type: 'object',
        keys: Object.keys(data),
        preview: Object.fromEntries(
          Object.entries(data).map(([k, v]) => [
            k,
            typeof v === 'string' && v.length > 100 
              ? v.slice(0, 100) + '...' 
              : v
          ])
        )
      }
    }

    return {
      type: typeof data,
      value: data
    }
  }
}

// Export cache singleton
export const postCache = PostCache.getInstance();