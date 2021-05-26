import {AxiosAdapter, AxiosPromise} from "axios";
import LRUCache from "lru-cache";
import {buildCacheKey} from "./utils/buildCacheKey";

declare module "axios" {
  interface AxiosRequestConfig {
    forceUpdate?: boolean;
    cache?: boolean | LRUCache<string, any>;
    clearCache?: boolean;
    cacheName?: string;
  }
}

export type RecordedCache = {
  cacheName?: string;
  responsePromise?: AxiosPromise;
};

const FIVE_MINUTES = 1000 * 60 * 5;
const CAPACITY = 100;

export type Options = {
  cacheFlag?: string;
  clearCacheFlag?: string;
  cacheNameFlag?: string;
  defaultCache?: LRUCache<string, RecordedCache>;
};

export default function cacheAdapterEnhancer(adapter: AxiosAdapter, options: Options = {}): AxiosAdapter {
  const {
    cacheFlag = "cache",
    clearCacheFlag = "clearCache",
    cacheNameFlag = "cacheName",
    defaultCache = new LRUCache<string, RecordedCache>({
      maxAge: FIVE_MINUTES,
      max: CAPACITY,
    }),
  } = options;

  return (config) => {
    const {url, method, params, paramsSerializer, data, forceUpdate} = config;

    const useCache =
      (config as any)[cacheFlag] !== void 0 && (config as any)[cacheFlag] !== null && (config as any)[cacheFlag];
    const clearCache =
      (config as any)[clearCacheFlag] !== void 0 &&
      (config as any)[clearCacheFlag] !== null &&
      (config as any)[clearCacheFlag];
    const cacheName =
      (config as any)[cacheNameFlag] !== void 0 &&
      (config as any)[cacheNameFlag] !== null &&
      (config as any)[cacheNameFlag];

    if (clearCache && cacheName) {
      defaultCache.keys().forEach((key) => {
        const value = defaultCache.peek(key);
        if (value && value.cacheName === cacheName) {
          defaultCache.del(key);
        }
      });
    }

    if (useCache) {
      // build the cache key according to the url and params
      const cacheKey = buildCacheKey(url, params, paramsSerializer, method, data);
      const cacheValue = defaultCache.get(cacheKey);

      let responsePromise = cacheValue?.responsePromise;

      if (!responsePromise || forceUpdate) {
        responsePromise = (async () => {
          try {
            return await adapter(config);
          } catch (reason) {
            defaultCache.del(cacheKey);
            throw reason;
          }
        })();

        // put the promise for the non-transformed response into cache as a placeholder
        defaultCache.set(cacheKey, {
          responsePromise,
          cacheName,
        });

        return responsePromise;
      }

      return responsePromise;
    }

    return adapter(config);
  };
}
