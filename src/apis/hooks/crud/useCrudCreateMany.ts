import {GenericRequestStateMany} from "../../../models/internal";
import {BaseEntity} from "../../../models/entity";
import useGenericRequestMany from "../base/useGenericRequestMany";
import {PartialDeep} from "type-fest";

function useCrudCreateMany<RequestRO, ResponseRO>(
  entity: BaseEntity,
  createItems: PartialDeep<RequestRO>[] | undefined
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
    }
  );
}
export default useCrudCreateMany;
