import {buildCacheUrl} from "./buildCacheUrl";

export function buildCacheKey(
  url: string | undefined,
  params: object,
  paramsSerializer: any,
  method?: string,
  data?: string
) {
  let cacheKey = buildSortedURL(url || "", params, paramsSerializer);
  if (!!data) {
    cacheKey += `|${method || ""}|${data || ""}`;
  }
  return cacheKey;
}

export function buildSortedURL(url: string, params: object, paramsSerializer: any): string {
  const builtURL = buildCacheUrl(url, params, paramsSerializer);

  const [urlPath, queryString] = builtURL.split("?");

  if (queryString) {
    const paramsPair = queryString.split("&");
    return `${urlPath}?${paramsPair.sort().join("&")}`;
  }

  return builtURL;
}
