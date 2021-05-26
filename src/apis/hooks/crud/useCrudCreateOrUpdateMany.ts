import {GenericRequestStateMany} from "../../../declerations/internal";
import {BaseEntity} from "../../../declerations/entity";
import useGenericRequestMany from "../base/useGenericRequestMany";
import {PartialDeep} from "type-fest";

function useCrudCreateOrUpdateMany<RequestRO, ResponseRO>(
  entity: BaseEntity,
  items: PartialDeep<RequestRO>[] | undefined
): GenericRequestStateMany<PartialDeep<RequestRO>, ResponseRO> {
  return useGenericRequestMany<PartialDeep<RequestRO>, ResponseRO>(
    {
      url: `${entity.api.path}/createOrUpdate/many`,
      method: "POST",
      data: items,
    },
    {
      manual: true,
      clearCache: true,
      cacheName: entity.api.cacheName,
    }
  );
}
export default useCrudCreateOrUpdateMany;
