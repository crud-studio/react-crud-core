import {GenericRequestState} from "../../../models/internal";
import {BaseEntity} from "../../../models/entity";
import useGenericRequest from "../base/useGenericRequest";
import {DynamicModelFilter, RemoteStorageValueDTO} from "../../../models/server";
import {remoteStorageEntity} from "../../../entities/remote-storage.entity";
import {useEffect, useRef} from "react";

interface Options {}

function useRemoteStorageDeleteValue(identifier: string, options: Options = {}): GenericRequestState<boolean> {
  return useGenericRequest<boolean>(
    {
      url: `${remoteStorageEntity.api.path}/deleteValue?identifier=${identifier}`,
      method: "DELETE",
    },
    {
      manual: true,
      clearCache: true,
      cacheName: remoteStorageEntity.api.cacheName,
      resultTransformer: (responseData) => responseData.success,
    }
  );
}
export default useRemoteStorageDeleteValue;
