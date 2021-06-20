import {GenericRequestState} from "../../../models/internal";
import {BaseEntity} from "../../../models/entity";
import useGenericRequest from "../base/useGenericRequest";
import {FilterField} from "../../../models/server";

interface Options {
  manual?: boolean;
  cache?: boolean;
  throttle?: boolean;
}

function useCrudSearchCount(
  entity: BaseEntity,
  filterFields: FilterField[],
  options: Options = {
    manual: false,
    cache: false,
    throttle: false,
  }
): GenericRequestState<number> {
  return useGenericRequest<number>(
    {
      url: `${entity.api.path}/search/count`,
      method: "POST",
      data: {
        filterFields: filterFields,
      },
    },
    {
      manual: options?.manual,
      cache: options?.cache,
      cacheName: entity.api.cacheName,
      throttle: options?.throttle,
    }
  );
}
export default useCrudSearchCount;
