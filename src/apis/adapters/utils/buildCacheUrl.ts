import _ from "lodash";

function encode(val: string): string {
  return encodeURIComponent(val)
    .replace(/%3A/gi, ":")
    .replace(/%24/g, "$")
    .replace(/%2C/gi, ",")
    .replace(/%20/g, "+")
    .replace(/%5B/gi, "[")
    .replace(/%5D/gi, "]");
}

function isURLSearchParams(val: any): boolean {
  return typeof URLSearchParams !== "undefined" && val instanceof URLSearchParams;
}

/**
 * Build a URL by appending params to the end
 *
 * @param {string} url The base of the url (e.g., http://www.google.com)
 * @param {object} [params] The params to be appended
 * @returns {string} The formatted url
 */
export function buildCacheUrl(url: string, params: object, paramsSerializer: any): string {
  /*eslint no-param-reassign:0*/
  if (!params) {
    return url;
  }

  var serializedParams;
  if (paramsSerializer) {
    serializedParams = paramsSerializer(params);
  } else if (isURLSearchParams(params)) {
    serializedParams = params.toString();
  } else {
    var parts: any[] = [];

    _.forEach(params, function serialize(val: any, key: string) {
      if (val === null || typeof val === "undefined") {
        return;
      }

      if (_.isArray(val)) {
        key = key + "[]";
      } else {
        val = [val];
      }

      _.forEach(val, function parseValue(v) {
        if (_.isDate(v)) {
          v = v.toISOString();
        } else if (_.isObject(v)) {
          v = JSON.stringify(v);
        }
        parts.push(encode(key) + "=" + encode(v));
      });
    });

    serializedParams = parts.join("&");
  }

  if (serializedParams) {
    var hashmarkIndex = url.indexOf("#");
    if (hashmarkIndex !== -1) {
      url = url.slice(0, hashmarkIndex);
    }

    url += (url.indexOf("?") === -1 ? "?" : "&") + serializedParams;
  }

  return url;
}
