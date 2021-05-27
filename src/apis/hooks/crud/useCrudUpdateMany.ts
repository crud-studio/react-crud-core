import {GenericRequestStateMany} from "../../../models/internal";
import {BaseEntity} from "../../../models/entity";
import useGenericRequestMany from "../base/useGenericRequestMany";

function useCrudUpdateMany<RequestRO, ResponseRO>(
  entity: BaseEntity,
  updateItems: RequestRO[] | undefined
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
    }
  );
}
export default useCrudUpdateMany;
