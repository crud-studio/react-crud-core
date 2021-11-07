import SecureLS from "secure-ls";
import _ from "lodash";

let securedLS: SecureLS;
let cache: any = {};

const LocalStorageWrapper = {
  getLocalStorage: function (): SecureLS {
    if (!securedLS) {
      securedLS = new SecureLS({encodingType: "aes"});
    }
    return securedLS;
  },

  get: function (key: string): any {
    if (_.has(cache, key)) {
      return cache[key];
    }

    let ls = this.getLocalStorage();

    let value = undefined;
    if (ls.getAllKeys().includes(key)) {
      try {
        value = ls.get(key);
      } catch (e) {}
    }

    cache[key] = value;
    return value;
  },

  set: function (key: string, value: any): void {
    let ls = this.getLocalStorage();
    ls.set(key, value);
    cache[key] = value;
  },

  remove: function (key: string): void {
    let ls = this.getLocalStorage();
    ls.remove(key);
    delete cache[key];
  },
};
export default LocalStorageWrapper;
