import {useEffect, useState} from "react";
import {GenericRequestStateUpload} from "../../../declerations/internal";
import useGenericRequest from "./useGenericRequest";

function useGenericRequestUpload<ResponseRO>(file: File | undefined, url: string): GenericRequestStateUpload<ResponseRO> {
  const [progress, setProgress] = useState<number>(0);
  const [formData, setFormData] = useState<FormData | null>(null);

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

  const executeRequest = () => {
    if (!file) {
      return;
    }

    setProgress(0);

    let fileFormData = new FormData();
    fileFormData.append("file", file);
    fileFormData.append("alias", file.name);
    fileFormData.append("type", "File");
    setFormData(fileFormData);
  };

  useEffect(() => {
    if (formData) {
      executeRequestInternal();
    }
  }, [formData]);

  return {result, loading, error, executed, progress, executeRequest, cancelRequest};
}

export default useGenericRequestUpload;
