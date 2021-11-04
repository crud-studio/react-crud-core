import {BaseEntity} from "../models/entity";

export const remoteStorageEntity: BaseEntity = {
  name: "remote-storage",
  api: {
    path: "/secure/remoteStorage",
    cacheName: "remoteStorage",
    defaultOrders: [{by: "id", descending: true}],
  },
};
