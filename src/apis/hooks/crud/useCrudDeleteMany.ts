import {GenericRequestStateMany} from "../../../models/internal";
import {BaseEntity} from "../../../models/entity";
import useGenericRequestMany from "../base/useGenericRequestMany";

function useCrudDeleteMany(entity: BaseEntity, ids: number[] | undefined): GenericRequestStateMany<number, number> {
  return useGenericRequestMany<number, number>(
    {
      url: `${entity.api.path}/many`,
      method: "DELETE",
      data: ids,
    },
    {
      manual: true,
      clearCache: true,
      cacheName: entity.api.cacheName,
    }
  );
}
export default useCrudDeleteMany;
