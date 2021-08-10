import {GenericRequestState} from "../../../models/internal";
import {BaseEntity} from "../../../models/entity";
import useGenericRequest from "../base/useGenericRequest";
import {AbstractJpaRO} from "../../../models/server";
import {PartialDeep} from "type-fest";

interface Options {
  encrypt?: boolean;
}

function useCrudUpdate<ResponseRO extends AbstractJpaRO>(
  entity: BaseEntity,
  dataItem: PartialDeep<ResponseRO> | undefined,
  options: Options = {
    encrypt: false,
  }
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
      encrypt: options?.encrypt,
    }
  );
}
export default useCrudUpdate;
