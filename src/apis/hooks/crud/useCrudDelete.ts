import {GenericRequestState} from "../../../models/internal";
import {BaseEntity} from "../../../models/entity";
import useGenericRequest from "../base/useGenericRequest";

function useCrudDelete(entity: BaseEntity, id: number | undefined): GenericRequestState<boolean> {
  return useGenericRequest<boolean>(
    {
      url: `${entity.api.path}/${id}`,
      method: "DELETE",
    },
    {
      manual: true,
      clearCache: true,
      cacheName: entity.api.cacheName,
      resultTransformer: (responseData) => responseData.success,
    }
  );
}
export default useCrudDelete;
