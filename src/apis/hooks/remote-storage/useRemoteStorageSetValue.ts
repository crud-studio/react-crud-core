import {GenericRequestState} from "../../../models/internal";
import {BaseEntity} from "../../../models/entity";
import useGenericRequest from "../base/useGenericRequest";
import {DynamicModelFilter, RemoteStorageValueDTO} from "../../../models/server";
import {remoteStorageEntity} from "../../../entities/remote-storage.entity";
import {useEffect, useRef} from "react";

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
  const formDataRef = useRef<FormData | null>(null);

  useEffect(() => {
    const formData = new FormData();
    formData.set("identifier", identifier);
    formData.set("value", value);
    formDataRef.current = formData;
  }, [identifier, value]);

  return useGenericRequest<RemoteStorageValueDTO>(
    {
      url: `${remoteStorageEntity.api.path}/setValue`,
      method: "POST",
      data: formDataRef.current,
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
