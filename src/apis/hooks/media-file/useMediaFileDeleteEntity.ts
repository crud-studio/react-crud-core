import {GenericRequestState} from "../../../models/internal";
import {BaseEntity} from "../../../models/entity";
import useGenericRequest from "../base/useGenericRequest";

function useMediaFileDeleteEntity(
  entity: BaseEntity,
  entityId: number | undefined,
  columnName: string
): GenericRequestState<boolean> {
  return useGenericRequest<boolean>(
    {
      url: `/mediaFile/deleteAssociatedMediaFile/${entityId}/${entity.name}/${columnName}`,
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
export default useMediaFileDeleteEntity;
