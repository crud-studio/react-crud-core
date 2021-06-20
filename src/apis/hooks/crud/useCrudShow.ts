import {GenericRequestState} from "../../../models/internal";
import {BaseEntity} from "../../../models/entity";
import useGenericRequest from "../base/useGenericRequest";

interface Options {
  manual?: boolean;
  cache?: boolean;
  throttle?: boolean;
}

function useCrudShow<ResponseRO>(
  entity: BaseEntity,
  id: number | undefined,
  options: Options = {
    manual: false,
    cache: false,
    throttle: false,
  }
): GenericRequestState<ResponseRO> {
  return useGenericRequest<ResponseRO>(
    {
      url: `${entity.api.path}/${id}`,
      method: "GET",
    },
    {
      manual: options?.manual || !id,
      cache: options?.cache,
      cacheName: entity.api.cacheName,
      throttle: options?.throttle,
    }
  );
}
export default useCrudShow;
