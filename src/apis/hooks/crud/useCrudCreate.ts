import {GenericRequestState} from "../../../declerations/internal";
import useGenericRequest from "../base/useGenericRequest";
import {BaseJpaRO} from "../../../declerations/server";
import {PartialDeep} from "type-fest";
import {BaseEntity} from "../../../declerations/entity";

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
