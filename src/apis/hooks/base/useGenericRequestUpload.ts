import {useCallback, useEffect, useState} from "react";
import {GenericRequestStateUpload} from "../../../models/internal";
import useGenericRequest from "./useGenericRequest";
import _ from "lodash";

function useGenericRequestUpload<ResponseRO>(
  file: File | undefined,
  url: string,
  data?: {[key: string]: any}
): GenericRequestStateUpload<ResponseRO> {
  const [progress, setProgress] = useState<number>(0);
  const [formData, setFormData] = useState<FormData | undefined>(undefined);

  const {
    result,
    loading,
    error,
    executed,
    executeRequest: executeRequestInternal,
    cancelRequest,
  } = useGenericRequest<ResponseRO>(
    {
      url: url,
      method: "POST",
      data: formData,
      headers: {
        "Content-Type": "multipart/form-data",
      },
      onUploadProgress: function (progressEvent) {
        if (!progressEvent || !progressEvent.total) {
          return;
        }
        setProgress(Math.floor((progressEvent.loaded / progressEvent.total) * 100));
      },
    },
    {
      manual: true,
    }
  );

  const executeRequest = useCallback((): void => {
    if (!file) {
      return;
    }

    setProgress(0);

    let fileFormData = new FormData();
    fileFormData.append("file", file);
    fileFormData.append("alias", file.name);
    fileFormData.append("type", "File");

    if (data) {
      _.forEach(data, function (value, key) {
        fileFormData.append(key, value);
      });
    }

    setFormData(fileFormData);
  }, [file, data, setProgress, setFormData]);

  useEffect(() => {
    if (formData) {
      executeRequestInternal();
    }
  }, [formData]);

  return {result, loading, error, executed, progress, executeRequest, cancelRequest};
}

export default useGenericRequestUpload;
