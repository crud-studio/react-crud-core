import useGenericRequest from "../base/useGenericRequest";
import {GenericRequestState} from "../../../models/internal";

interface Options {
  manual?: boolean;
}

function useMediaFileDownload(
  fileUuid: string,
  options: Options = {
    manual: false,
  }
): GenericRequestState<boolean> {
  return useGenericRequest<boolean>(
    {
      url: `/mediaFile/download/${fileUuid}`,
      method: "GET",
      responseType: "blob",
    },
    {
      manual: options.manual,
      cache: true,
      throttle: true,
      resultTransformer: (responseData) => responseData,
      successTransformer: (responseData) => !!responseData,
    }
  );
}
export default useMediaFileDownload;
