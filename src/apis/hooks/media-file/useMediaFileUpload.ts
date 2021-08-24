import {GenericRequestState, GenericRequestStateUpload} from "../../../models/internal";
import {MediaFileAclMode, MediaFileRO} from "../../../models/server";
import useGenericRequestUpload from "../base/useGenericRequestUpload";
import {useMemo} from "react";

interface Options {
  acl?: MediaFileAclMode;
}

function useMediaFileUpload(file: File | undefined, options?: Options): GenericRequestStateUpload<MediaFileRO> {
  const url = useMemo<string>(() => `/mediaFile/uploadAndAssociate`, []);
  const data = useMemo<{[key: string]: any}>(() => ({aclMode: options?.acl || "PRIVATE"}), [options]);

  return useGenericRequestUpload<MediaFileRO>(file, url, data);
}
export default useMediaFileUpload;
