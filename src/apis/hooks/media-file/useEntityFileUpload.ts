import {GenericRequestState} from "../../../models/internal";
import {MediaFileRO} from "../../../models/server";
import {BaseEntity} from "../../../models/entity";
import useGenericRequestUpload from "../base/useGenericRequestUpload";
import {useMemo} from "react";

function useEntityFileUpload(
  entity: BaseEntity,
  entityId: number | undefined,
  columnName: string,
  file: File | undefined
): GenericRequestState<MediaFileRO> {
  const url = useMemo<string>(
    () => `/mediaFile/uploadAndAssociate/${entityId}/${entity.name}/${columnName}`,
    [entity, entityId, columnName]
  );

  return useGenericRequestUpload<MediaFileRO>(file, url);
}
export default useEntityFileUpload;
