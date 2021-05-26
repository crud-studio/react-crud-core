import {AxiosAdapter, AxiosPromise, AxiosRequestConfig} from "axios";
import LRUCache from "lru-cache";
import {buildCacheKey} from "./utils/buildCacheKey";

declare module "axios" {
  interface AxiosRequestConfig {
    throttle?: boolean;
  }
}

export type RecordedCache = {
  timestamp: number;
  value?: AxiosPromise;
};

export type Options = {
  threshold?: number;
  throttleFlag?: string;
  cache?: LRUCache<string, RecordedCache>;
};

export default function throttleAdapterEnhancer(adapter: AxiosAdapter, options: Options = {}): AxiosAdapter {
  const {threshold = 1000, throttleFlag = "throttle", cache = new LRUCache<string, RecordedCache>({max: 10})} = options;

  const recordCacheWithRequest = (index: string, config: AxiosRequestConfig) => {
    const responsePromise = (async () => {
      try {
        const response = await adapter(config);

        cache.set(index, {
          timestamp: Date.now(),
          value: Promise.resolve(response),
        });

        return response;
      } catch (reason) {
        cache.del(index);
        throw reason;
      }
    })();

    cache.set(index, {
      timestamp: Date.now(),
      value: responsePromise,
    });

    return responsePromise;
  };

  return (config) => {
    const {url, method, params, paramsSerializer, data} = config;
    const useThrottle =
      (config as any)[throttleFlag] !== void 0 &&
      (config as any)[throttleFlag] !== null &&
      (config as any)[throttleFlag];

    if (useThrottle) {
      // build the cache key according to the url and params
      const cacheKey = buildCacheKey(url, params, paramsSerializer, method, data);

      const now = Date.now();
      const cachedRecord = cache.get(cacheKey) || {timestamp: now};

      if (now - cachedRecord.timestamp <= threshold) {
        const responsePromise = cachedRecord.value;
        if (responsePromise) {
          return responsePromise;
        }
      }

      return recordCacheWithRequest(cacheKey, config);
    }

    return adapter(config);
  };
}
