import {GenericRequestState} from "../../../models/internal";
import useGenericRequest from "../base/useGenericRequest";
import {RemoteStorageValueDTO} from "../../../models/server";
import {remoteStorageEntity} from "../../../entities/remote-storage.entity";

interface Options {
  manual?: boolean;
  cache?: boolean;
  throttle?: boolean;
  encrypt?: boolean;
}

function useRemoteStorageGetValue(
  identifier: string,
  options: Options = {
    manual: false,
    cache: false,
    throttle: false,
    encrypt: false,
  }
): GenericRequestState<RemoteStorageValueDTO> {
  return useGenericRequest<RemoteStorageValueDTO>(
    {
      url: `${remoteStorageEntity.api.path}/getValue?identifier=${identifier}`,
      method: "GET",
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
export default useRemoteStorageGetValue;
