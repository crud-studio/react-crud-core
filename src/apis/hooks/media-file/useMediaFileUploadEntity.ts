import {GenericRequestState} from "../../../models/internal";
import {MediaFileRO} from "../../../models/server";
import {BaseEntity} from "../../../models/entity";
import useGenericRequestUpload from "../base/useGenericRequestUpload";
import {useMemo} from "react";

function useMediaFileUploadEntity(
  file: File | undefined,
  entity: BaseEntity,
  entityId: number | undefined,
  columnName: string
): GenericRequestState<MediaFileRO> {
  const url = useMemo<string>(
    () => `/mediaFile/uploadAndAssociate/${entityId}/${entity.name}/${columnName}`,
    [entity, entityId, columnName]
  );

  return useGenericRequestUpload<MediaFileRO>(file, url);
}
export default useMediaFileUploadEntity;
