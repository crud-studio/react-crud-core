import useAxios from "axios-hooks";
import {useCallback, useEffect, useState} from "react";
import {GenericRequestState} from "../../../models/internal";
import _ from "lodash";
import {createGlobalState, useUpdateEffect} from "react-use";

export interface RequestConfig {
  url: string;
  method: "GET" | "POST" | "PUT" | "DELETE";
  data?: any;
  headers?: any;
  responseType?: "arraybuffer" | "blob" | "document" | "json" | "text" | "stream" | undefined;
  onUploadProgress?: (progressEvent: any) => void;
}

export interface RequestOptions<ResponseRO> {
  manual?: boolean;
  cache?: boolean;
  clearCache?: boolean;
  cacheName?: string;
  cacheAutoReload?: boolean;
  throttle?: boolean;
  autoCancel?: boolean;
  timeout?: number;
  resultTransformer?: (responseData: any) => ResponseRO | null;
  successTransformer?: (responseData: any) => boolean;
}

const useGlobalClearedCacheName = createGlobalState<{cacheName: string} | undefined>(undefined);

function useGenericRequest<ResponseRO>(
  config: RequestConfig,
  {
    manual = true,
    cache = false,
    clearCache = false,
    cacheName,
    cacheAutoReload = false,
    throttle = false,
    autoCancel = true,
    timeout = 0,
    resultTransformer,
    successTransformer,
  }: RequestOptions<ResponseRO> = {}
): GenericRequestState<ResponseRO> {
  const [requestConfig, setRequestConfig] = useState<RequestConfig | undefined>(undefined);
  const [pendingRequestConfig, setPendingRequestConfig] = useState<RequestConfig | undefined>(undefined);
  const [clearedCacheName, setClearedCacheName] = useGlobalClearedCacheName();

  const [result, setResult] = useState<ResponseRO | undefined>(undefined);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<any>(undefined);
  const [executed, setExecuted] = useState<boolean>(false);

  const [{data: responseData, loading: requestLoading, error: serverError}, executeAxiosRequest, manualCancel] =
    useAxios(
      {
        url: requestConfig?.url || "",
        method: requestConfig?.method || "GET",
        data: requestConfig?.data,
        headers: requestConfig?.headers,
        responseType: requestConfig?.responseType,
        cache: cache,
        clearCache: clearCache,
        cacheName: cacheName,
        throttle: throttle,
        timeout: timeout,
        onUploadProgress: requestConfig?.onUploadProgress,
      },
      {manual: true}
    );

  useEffect(() => {
    if (!manual && config) {
      executeRequest();
    }
  }, [manual]);

  useUpdateEffect(() => {
    if (
      !manual &&
      config &&
      requestConfig &&
      !_.isEqual(config, requestConfig) &&
      !_.isEqual(config, pendingRequestConfig)
    ) {
      executeRequest();
    }
  }, [config]);

  useEffect(() => {
    if (!responseData) {
      return;
    }

    const success = successTransformer ? successTransformer(responseData) : responseData.success;
    if (success) {
      setResult(resultTransformer ? resultTransformer(responseData) : responseData.result);
      setExecuted(true);
      setError(undefined);

      if (clearCache && cacheName) {
        setClearedCacheName({cacheName: cacheName});
      }
    } else {
      setResult(undefined);
      setError(responseData.error || true);
    }
  }, [responseData]);

  useEffect(() => {
    if (requestConfig) {
      setResult(undefined);
      setLoading(true);
      setError(undefined);
      setExecuted(false);
      executeAxiosRequest();
    }
  }, [requestConfig]);

  const executeRequest = useCallback((): void => {
    if (!config) {
      return;
    }

    if (loading) {
      setPendingRequestConfig(config);
    } else {
      setRequestConfig({...config});
    }
  }, [config, loading, setPendingRequestConfig, setRequestConfig]);

  useUpdateEffect(() => {
    if (!loading && pendingRequestConfig) {
      setRequestConfig({...pendingRequestConfig});
      setPendingRequestConfig(undefined);
    }
  }, [loading]);

  const cancelRequest = useCallback((): void => {
    manualCancel();
  }, [manualCancel]);

  useEffect(() => {
    return () => {
      if (autoCancel) {
        manualCancel();
      }
    };
  }, []);

  useEffect(() => {
    setLoading(requestLoading);
  }, [requestLoading]);

  useEffect(() => {
    if (serverError) {
      setError(serverError);
    }
  }, [serverError]);

  useUpdateEffect(() => {
    if (cache && cacheAutoReload && cacheName && clearedCacheName) {
      if (cacheName === clearedCacheName.cacheName) {
        executeRequest();
      }
    }
  }, [clearedCacheName]);

  return {result, loading, error, executed, executeRequest, cancelRequest};
}

export default useGenericRequest;
