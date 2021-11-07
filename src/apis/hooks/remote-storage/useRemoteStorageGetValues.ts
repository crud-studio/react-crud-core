import {GenericRequestState} from "../../../models/internal";
import {BaseEntity} from "../../../models/entity";
import useGenericRequest from "../base/useGenericRequest";
import {DynamicModelFilter, RemoteStorageValueDTO} from "../../../models/server";
import {remoteStorageEntity} from "../../../entities/remote-storage.entity";

interface Options {
  manual?: boolean;
  cache?: boolean;
  throttle?: boolean;
  encrypt?: boolean;
}

function useRemoteStorageGetValues(
  filter?: DynamicModelFilter,
  options: Options = {
    manual: false,
    cache: false,
    throttle: false,
    encrypt: false,
  }
): GenericRequestState<RemoteStorageValueDTO[]> {
  return useGenericRequest<RemoteStorageValueDTO[]>(
    {
      url: `${remoteStorageEntity.api.path}/getValues`,
      method: "POST",
      data: filter || {},
    },
    {
      manual: options?.manual,
      cache: options?.cache,
      cacheName: remoteStorageEntity.api.cacheName,
      throttle: options?.throttle,
      encrypt: options?.encrypt,
    }
  );
}
export default useRemoteStorageGetValues;
