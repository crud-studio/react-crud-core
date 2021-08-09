import {AxiosAdapter, AxiosRequestConfig, AxiosResponse} from "axios";
import EncryptionUtils from "../../helpers/EncryptionUtils";

declare module "axios" {
  interface AxiosRequestConfig {
    encrypt?: boolean;
  }
}

export type Options = {
  encryptionFlag?: string;
};

const CLIENT_PUBLIC_KEY_HEADER = "x-client-public-key";
const SERVER_PUBLIC_KEY_HEADER = "x-server-public-key";
const SERVER_PUBLIC_KEY_PARAM = "p64ifAFDkBzL86uG1";

export default function encryptionAdapterEnhancer(adapter: AxiosAdapter, options: Options = {}): AxiosAdapter {
  const {encryptionFlag = "encrypt"} = options;

  const sendRequestWithEncryption = (config: AxiosRequestConfig) => {
    return (async () => {
      const {data, headers} = config;
      const serverPublicKey = localStorage.getItem(SERVER_PUBLIC_KEY_PARAM);

      let response: AxiosResponse;
      let encryptedRequest: boolean;

      try {
        const updatedData = !!data && !!serverPublicKey ? EncryptionUtils.encrypt(serverPublicKey, data) : data;

        const encryptionHeaders = {[CLIENT_PUBLIC_KEY_HEADER]: EncryptionUtils.getClientPublicKeyBase64()};
        const updatedHeaders = headers ? {...headers, ...encryptionHeaders} : encryptionHeaders;

        response = await adapter({...config, data: updatedData, headers: updatedHeaders});
        encryptedRequest = true;
      } catch (e) {
        console.warn("Client SSL Encryption failed.", serverPublicKey);

        response = await adapter(config);
        encryptedRequest = false;
      }

      const responseServerPublicKey = response.headers?.[SERVER_PUBLIC_KEY_HEADER];
      if (!!responseServerPublicKey) {
        localStorage.setItem(SERVER_PUBLIC_KEY_PARAM, responseServerPublicKey);
      }

      if (encryptedRequest && response.data) {
        const decryptedData = EncryptionUtils.decrypt(serverPublicKey || responseServerPublicKey, response.data);
        return {...response, data: decryptedData};
      }

      return response;
    })();
  };

  return (config) => {
    const useEncryption =
      (config as any)[encryptionFlag] !== void 0 &&
      (config as any)[encryptionFlag] !== null &&
      (config as any)[encryptionFlag];
    if (!useEncryption) {
      return adapter(config);
    }

    const serverPublicKey = localStorage.getItem(SERVER_PUBLIC_KEY_PARAM);
    const canEncrypt = !config.data || !!serverPublicKey;
    if (!canEncrypt) {
      return adapter(config);
    }

    return sendRequestWithEncryption(config);
  };
}
