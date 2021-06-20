import Fingerprint2 from "fingerprintjs2";
import {PARAM_FINGERPRINT} from "../constants/localStorageKeys";
import LocalStorageWrapper from "./LocalStorageWrapper";

const Fingerprint = {
  getFingerprint: async function (): Promise<string> {
    let fingerprint = LocalStorageWrapper.get(PARAM_FINGERPRINT);
    if (!!fingerprint) {
      return fingerprint;
    }

    fingerprint = await new Promise((success, fail) => {
      let options = {
        excludes: {
          // Commented out because we save the fingerprint in the local storage
          // screenResolution: true,
          // availableScreenResolution: true,
          // hasLiedResolution: true,
          enumerateDevices: true,
          pixelRatio: true,
          doNotTrack: true,
          fontsFlash: true,
          // platform: true
        },
      };

      Fingerprint2.get(options, function (components) {
        let values = components.map(function (component) {
          return component.value;
        });
        let murmur = Fingerprint2.x64hash128(values.join(""), 31);
        success(murmur);
      });
    })
      .then((response) => response)
      .catch((error) => error);

    LocalStorageWrapper.set(PARAM_FINGERPRINT, fingerprint);
    return fingerprint;
  },

  getFingerprintSync: function (): string | undefined {
    return LocalStorageWrapper.get(PARAM_FINGERPRINT) || undefined;
  },
};

export default Fingerprint;
