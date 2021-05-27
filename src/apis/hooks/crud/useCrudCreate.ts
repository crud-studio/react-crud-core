import {GenericRequestState} from "../../../models/internal";
import useGenericRequest from "../base/useGenericRequest";
import {BaseJpaRO} from "../../../models/server";
import {PartialDeep} from "type-fest";
import {BaseEntity} from "../../../models/entity";

function useCrudCreate<RequestRO, ResponseRO extends BaseJpaRO>(
  entity: BaseEntity,
  dataItem: PartialDeep<RequestRO> | undefined,
): GenericRequestState<ResponseRO> {
  return useGenericRequest<ResponseRO>(
    {
      url: `${entity.api.path}`,
      method: "POST",
      data: dataItem,
    },
    {
      manual: true,
      clearCache: true,
      cacheName: entity.api.cacheName,
    }
  );
}
export default useCrudCreate;
