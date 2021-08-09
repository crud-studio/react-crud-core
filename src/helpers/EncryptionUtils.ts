import {ec} from "elliptic";
import CryptoJS from "crypto-js";
import _ from "lodash";
import BN from "bn.js";
import {PARAM_CLIENT_PRIVATE_KEY, PARAM_CLIENT_PUBLIC_KEY} from "../constants/localStorageKeys";
import LocalStorageWrapper from "./LocalStorageWrapper";

const EncryptionUtils = {
  ec: new ec("secp256k1"),

  generateClientKeyPair: function (): void {
    const keyPair = this.ec.genKeyPair();
    const base64PrivateKey = Buffer.from(keyPair.getPrivate("hex"), "hex").toString("base64");
    const base64PublicKey = Buffer.from(keyPair.getPublic("array")).toString("base64");
    LocalStorageWrapper.set(PARAM_CLIENT_PRIVATE_KEY, base64PrivateKey);
    LocalStorageWrapper.set(PARAM_CLIENT_PUBLIC_KEY, base64PublicKey);
  },

  clearClientKeyPair: function (): void {
    LocalStorageWrapper.remove(PARAM_CLIENT_PRIVATE_KEY);
    LocalStorageWrapper.remove(PARAM_CLIENT_PUBLIC_KEY);
  },

  getClientPrivateKeyBase64: function (): string {
    const clientPrivateKey = LocalStorageWrapper.get(PARAM_CLIENT_PRIVATE_KEY);
    if (!!clientPrivateKey) {
      return clientPrivateKey;
    }

    this.generateClientKeyPair();
    return LocalStorageWrapper.get(PARAM_CLIENT_PRIVATE_KEY);
  },

  getClientPublicKeyBase64: function (): string {
    const clientPublicKey = LocalStorageWrapper.get(PARAM_CLIENT_PUBLIC_KEY);
    if (!!clientPublicKey) {
      return clientPublicKey;
    }

    this.generateClientKeyPair();
    return LocalStorageWrapper.get(PARAM_CLIENT_PUBLIC_KEY);
  },

  getClientKeyPair: function (): ec.KeyPair {
    const clientPrivateKey = Buffer.from(this.getClientPrivateKeyBase64(), "base64");
    return this.ec.keyFromPrivate(clientPrivateKey);
  },

  getServerKeyPair: function (serverPublicKeyBase64: string): ec.KeyPair {
    const serverPublicKey = Buffer.from(serverPublicKeyBase64, "base64");
    return this.ec.keyFromPublic(serverPublicKey);
  },

  getDerivedKey: function (serverPublicKeyBase64: string): BN {
    const clientKeyPair = this.getClientKeyPair();
    const serverKeyPair = this.getServerKeyPair(serverPublicKeyBase64);
    return clientKeyPair.derive(serverKeyPair.getPublic());
  },

  getEmptyIV: function (): CryptoJS.lib.WordArray {
    return CryptoJS.enc.Hex.parse("00000000000000000000000000000000");
  },

  decrypt: function (serverPublicKeyBase64: string, cipherTextBase64: string): string {
    const derivedKey = this.getDerivedKey(serverPublicKeyBase64);
    const decrypted = CryptoJS.AES.decrypt(cipherTextBase64, CryptoJS.enc.Hex.parse(derivedKey.toString(16)), {
      iv: this.getEmptyIV(),
    });
    return decrypted.toString(CryptoJS.enc.Utf8);
  },

  encrypt: function (serverPublicKeyBase64: string, data: any): string {
    const derivedKey = this.getDerivedKey(serverPublicKeyBase64);
    const dataString = _.isString(data) ? data : JSON.stringify(data);
    const encrypted = CryptoJS.AES.encrypt(dataString, CryptoJS.enc.Hex.parse(derivedKey.toString(16)), {
      iv: this.getEmptyIV(),
    });
    return encrypted.toString();
  },
};

export default EncryptionUtils;
