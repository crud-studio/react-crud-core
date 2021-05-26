// @ts-ignore
import buildURL from "axios/lib/helpers/buildURL";

export function buildCacheKey(
  url: string | undefined,
  params: object,
  paramsSerializer: any,
  method?: string,
  data?: string
) {
  let cacheKey = buildSortedURL(url, params, paramsSerializer);
  if (!!data) {
    cacheKey += `|${method || ""}|${data || ""}`;
  }
  return cacheKey;
}

export function buildSortedURL(...args: any[]) {
  const builtURL = buildURL(...args);

  const [urlPath, queryString] = builtURL.split("?");

  if (queryString) {
    const paramsPair = queryString.split("&");
    return `${urlPath}?${paramsPair.sort().join("&")}`;
  }

  return builtURL;
}
