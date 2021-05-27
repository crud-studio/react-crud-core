import LocalStorageWrapper from "./LocalStorageWrapper";
import {PARAM_UPDATE_PACKS} from "../constants/localStorageKeys";
import {v4 as uuidv4} from "uuid";
import {URL_PARAM_UPDATE_PACK} from "../constants/urlKeys";

const UpdatePackUtils = {
  addUpdatePack(updatePack: object): string {
    let id = uuidv4().substr(0, 8);
    LocalStorageWrapper.set(PARAM_UPDATE_PACKS, {
      [id]: updatePack,
    });
    return id;
  },

  popUpdatePack(id: string): object | null | undefined {
    let updatePacks = LocalStorageWrapper.get(PARAM_UPDATE_PACKS) || {};
    LocalStorageWrapper.remove(PARAM_UPDATE_PACKS);
    return updatePacks[id];
  },

  getUpdatePackUrlParam(): string {
    return URL_PARAM_UPDATE_PACK;
  },
};

export default UpdatePackUtils;
