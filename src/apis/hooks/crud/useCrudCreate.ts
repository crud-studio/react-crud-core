import {GenericRequestState} from "../../../models/internal";
import useGenericRequest from "../base/useGenericRequest";
import {AbstractJpaRO} from "../../../models/server";
import {PartialDeep} from "type-fest";
import {BaseEntity} from "../../../models/entity";

interface Options {
  encrypt?: boolean;
}

function useCrudCreate<RequestRO, ResponseRO extends AbstractJpaRO>(
  entity: BaseEntity,
  dataItem: PartialDeep<RequestRO> | undefined,
  options: Options = {
    encrypt: false,
  }
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
      encrypt: options?.encrypt,
    }
  );
}
export default useCrudCreate;
