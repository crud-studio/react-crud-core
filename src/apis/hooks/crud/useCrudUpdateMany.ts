import {GenericRequestStateMany} from "../../../models/internal";
import {BaseEntity} from "../../../models/entity";
import useGenericRequestMany from "../base/useGenericRequestMany";

interface Options {
  encrypt?: boolean;
}

function useCrudUpdateMany<RequestRO, ResponseRO>(
  entity: BaseEntity,
  updateItems: RequestRO[] | undefined,
  options: Options = {
    encrypt: false,
  }
): GenericRequestStateMany<RequestRO, ResponseRO> {
  return useGenericRequestMany<RequestRO, ResponseRO>(
    {
      url: `${entity.api.path}/many`,
      method: "PUT",
      data: updateItems,
    },
    {
      manual: true,
      clearCache: true,
      cacheName: entity.api.cacheName,
      encrypt: options?.encrypt,
    }
  );
}
export default useCrudUpdateMany;
