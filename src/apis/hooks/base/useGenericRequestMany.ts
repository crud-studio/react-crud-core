import {useEffect, useState} from "react";
import useGenericRequest, {RequestConfig, RequestOptions} from "./useGenericRequest";
import {ManyCrudResult, ManyFailedReason} from "../../../declerations/server";
import {GenericRequestStateMany} from "../../../declerations/internal";

function useGenericRequestMany<RequestRO, ResponseRO>(
  config: RequestConfig,
  options: RequestOptions<ManyCrudResult<RequestRO, ResponseRO>> = {}
): GenericRequestStateMany<RequestRO, ResponseRO> {
  const [successful, setSuccessful] = useState<ResponseRO[] | undefined>(undefined);
  const [failed, setFailed] = useState<ManyFailedReason<RequestRO>[] | undefined>(undefined);
  const [executed, setExecuted] = useState<boolean>(false);

  const {result, loading, error, executeRequest, cancelRequest} = useGenericRequest<
    ManyCrudResult<RequestRO, ResponseRO>
  >(config, options);

  useEffect(() => {
    if (result) {
      setExecuted(true);
      setSuccessful(result.successful);
      setFailed(result.failed);
    }
  }, [result]);

  return {successful, failed, loading, error, executed, executeRequest, cancelRequest};
}

export default useGenericRequestMany;
