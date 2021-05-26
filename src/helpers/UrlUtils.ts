import _ from "lodash";

export type UrlOptions = {
  queryStringParams?: {[key: string]: string};
  withOrigin?: boolean;
};

export const buildUrl = (url: string, options?: UrlOptions): string => {
  if (!options) {
    return url;
  }

  const origin = window.location.origin;
  const urlObject = new URL(url, origin);

  _.forEach(options?.queryStringParams, (value: string, key: string) => {
    urlObject.searchParams.append(key, value);
  });

  url = urlObject.href;

  if (!options.withOrigin) {
    url = url.replace(origin, "");
  }

  return url;
};

export const getUrlParams = (): {[key: string]: string} => {
  let result: {[key: string]: string} = {};

  const searchParams = new URLSearchParams(window.location.search);
  searchParams.forEach((value, key) => {
    result[key] = value;
  });

  return result;
};

export const getUrlParam = (key: string, defaultValue: string = ""): string => {
  const searchParams = new URLSearchParams(window.location.search);
  const value = searchParams.get(key);
  return value || defaultValue;
};

export const setUrlParams = (params: {[key: string]: string}, addToHistory = false) => {
  let currentParams = getUrlParams();
  if (_.isEqualWith(currentParams, params, (x, y) => x == y)) {
    return;
  }

  updateQuerystring(getUrlParamsQuerystring(params), addToHistory);
};

export const addUrlParams = (params: {[key: string]: string}, addToHistory = false) => {
  let currentParams = getUrlParams();
  if (_.isMatchWith(currentParams, params, (x, y) => x == y)) {
    return;
  }

  updateQuerystring(getUrlParamsQuerystring(_.merge(getUrlParams(), params)), addToHistory);
};

export const removeUrlParam = (param: string, addToHistory = false) => {
  let params = getUrlParams();
  if (!_.has(params, param)) {
    return;
  }
  _.unset(params, param);

  updateQuerystring(getUrlParamsQuerystring(params), addToHistory);
};

export const getUrlParamsQuerystring = (params: {[key: string]: string}) => {
  const searchParams = new URLSearchParams();

  if (params) {
    _.forEach(params, function (value, key) {
      searchParams.set(key, value);
    });
  }

  return searchParams.toString();
};

export const updateQuerystring = (querystring: string, addToHistory: boolean) => {
  let url = querystring ? `?${querystring}` : document.location.href.split("?")[0];
  if (addToHistory) {
    window.history.pushState(null, "", url);
  } else {
    window.history.replaceState(null, "", url);
  }
};
