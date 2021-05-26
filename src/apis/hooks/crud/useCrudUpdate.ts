import {GenericRequestState} from "../../../declerations/internal";
import {BaseEntity} from "../../../declerations/entity";
import useGenericRequest from "../base/useGenericRequest";
import {BaseJpaRO} from "../../../declerations/server";
import {PartialDeep} from "type-fest";

function useCrudUpdate<ResponseRO extends BaseJpaRO>(
  entity: BaseEntity,
  dataItem: PartialDeep<ResponseRO> | undefined
): GenericRequestState<ResponseRO> {
  return useGenericRequest<ResponseRO>(
    {
      url: `${entity.api.path}/${dataItem?.id}`,
      method: "PUT",
      data: dataItem,
    },
    {
      manual: true,
      clearCache: true,
      cacheName: entity.api.cacheName,
    }
  );
}
export default useCrudUpdate;
