import {GenericRequestState} from "../../../models/internal";
import {BaseEntity} from "../../../models/entity";
import useGenericRequest from "../base/useGenericRequest";
import {DynamicModelFilter, RemoteStorageValueDTO} from "../../../models/server";
import {remoteStorageEntity} from "../../../entities/remote-storage.entity";
import {useCallback, useEffect, useRef} from "react";

interface Options {
  encrypt?: boolean;
}

function useRemoteStorageSetValue(
  identifier: string,
  value: string,
  options: Options = {
    encrypt: false,
  }
): GenericRequestState<RemoteStorageValueDTO> {
  return useGenericRequest<RemoteStorageValueDTO>(
    {
      url: `${remoteStorageEntity.api.path}/setValue?identifier=${encodeURIComponent(
        identifier
      )}&value=${encodeURIComponent(value)}`,
      method: "POST",
    },
    {
      manual: true,
      clearCache: true,
      cacheName: remoteStorageEntity.api.cacheName,
      encrypt: options?.encrypt,
    }
  );
}
export default useRemoteStorageSetValue;
