import {GenericRequestStateMany} from "../../../models/internal";
import {BaseEntity} from "../../../models/entity";
import useGenericRequestMany from "../base/useGenericRequestMany";
import {PartialDeep} from "type-fest";

interface Options {
  encrypt?: boolean;
}

function useCrudCreateMany<RequestRO, ResponseRO>(
  entity: BaseEntity,
  createItems: PartialDeep<RequestRO>[] | undefined,
  options: Options = {
    encrypt: false,
  }
): GenericRequestStateMany<PartialDeep<RequestRO>, ResponseRO> {
  return useGenericRequestMany<PartialDeep<RequestRO>, ResponseRO>(
    {
      url: `${entity.api.path}/many`,
      method: "POST",
      data: createItems,
    },
    {
      manual: true,
      clearCache: true,
      cacheName: entity.api.cacheName,
      encrypt: options?.encrypt,
    }
  );
}
export default useCrudCreateMany;
