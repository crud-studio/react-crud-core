import {GenericRequestStateMany} from "../../../declerations/internal";
import {BaseEntity} from "../../../declerations/entity";
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
