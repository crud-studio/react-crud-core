import {useCallback, useEffect, useState} from "react";
import {GenericRequestState} from "../../../models/internal";
import {BaseEntity} from "../../../models/entity";
import useCrudCreate from "./useCrudCreate";
import useCrudUpdate from "./useCrudUpdate";
import _ from "lodash";
import {AbstractJpaRO} from "../../../models/server";
import {PartialDeep} from "type-fest";

interface Options {
  encrypt?: boolean;
}

function useCrudCreateOrUpdate<ResponseRO extends AbstractJpaRO>(
  entity: BaseEntity,
  dataItem: PartialDeep<ResponseRO> | undefined,
  options: Options = {
    encrypt: false,
  }
): GenericRequestState<ResponseRO> {
  const [requestItem, setRequestItem] = useState<PartialDeep<ResponseRO> | undefined>(undefined);
  const [pendingRequestItem, setPendingRequestItem] = useState<PartialDeep<ResponseRO> | undefined>(undefined);
  const [result, setResult] = useState<ResponseRO | undefined>(undefined);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<any>(undefined);
  const [executed, setExecuted] = useState<boolean>(false);

  useEffect(() => {
    if (requestItem) {
      if (_.isNumber(requestItem.id) && requestItem.id > 0) {
        updateState.executeRequest();
      } else {
        createState.executeRequest();
      }
    }
  }, [requestItem]);

  const createState = useCrudCreate<ResponseRO, ResponseRO>(entity, requestItem, options);
  const updateState = useCrudUpdate<ResponseRO>(entity, requestItem, options);

  useEffect(() => {
    if (createState.result) {
      setResult(createState.result);
      setError(undefined);
    }
  }, [createState.result]);

  useEffect(() => {
    if (updateState.result) {
      setResult(updateState.result);
      setError(undefined);
    }
  }, [updateState.result]);

  const executeRequestInternal = useCallback(
    (requestItem: any): void => {
      setRequestItem(requestItem);
      setLoading(true);
    },
    [setRequestItem, setLoading]
  );

  const executeRequest = useCallback((): void => {
    if (loading || pendingRequestItem) {
      setPendingRequestItem(dataItem);
    } else {
      executeRequestInternal(dataItem);
    }
  }, [dataItem, loading, pendingRequestItem, setPendingRequestItem, executeRequestInternal]);

  const cancelRequest = useCallback((): void => {
    if (createState.loading) {
      createState.cancelRequest();
    }
    if (updateState.loading) {
      updateState.cancelRequest();
    }
  }, [createState, updateState]);

  useEffect(() => {
    if (!loading && pendingRequestItem) {
      executeRequestInternal(pendingRequestItem);
      setPendingRequestItem(undefined);
    }
  }, [loading]);

  useEffect(() => {
    setLoading((createState && createState.loading) || (updateState && updateState.loading));
  }, [createState.loading, updateState.loading]);

  useEffect(() => {
    setError(createState && createState.error);
  }, [createState.error]);

  useEffect(() => {
    setError(updateState && updateState.error);
  }, [updateState.error]);

  useEffect(() => {
    setExecuted(createState.executed || updateState.executed);
  }, [createState.executed, updateState.executed]);

  return {result, loading, error, executed, executeRequest, cancelRequest};
}

export default useCrudCreateOrUpdate;
