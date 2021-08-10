import {useCallback, useEffect, useState} from "react";
import {GenericRequestStateSearch} from "../../../models/internal";
import {BaseEntity} from "../../../models/entity";
import useGenericRequest from "../base/useGenericRequest";
import {DynamicModelFilter, FilterField, OrderDTO} from "../../../models/server";

interface Options {
  manual?: boolean;
  count?: boolean;
  cache?: boolean;
  throttle?: boolean;
  cacheAutoReload?: boolean;
  encrypt?: boolean;
}

function useCrudSearch<ResponseRO>(
  entity: BaseEntity,
  currentPage: number,
  pageSize: number,
  filterFields: FilterField[] | undefined,
  orders: OrderDTO[],
  options: Options = {
    manual: false,
    count: true,
    cache: false,
    throttle: false,
    cacheAutoReload: false,
    encrypt: false,
  }
): GenericRequestStateSearch<ResponseRO> {
  const [items, setItems] = useState<ResponseRO[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [totalItemCount, setTotalItemCount] = useState<number>(0);
  const [totalPageCount, setTotalPageCount] = useState<number>(1);
  const [hasMore, setHasMore] = useState<boolean>(true);

  const start = (currentPage - 1) * pageSize;
  const limit = pageSize;

  const countState = useGenericRequest<any>(
    {
      url: `${entity.api.path}/search/count`,
      method: "POST",
      data: {
        filterFields: filterFields,
      },
    },
    {
      manual: options?.manual || !options?.count,
      cache: options?.cache,
      cacheName: entity.api.cacheName,
      cacheAutoReload: options?.cacheAutoReload && options?.count,
      throttle: options?.throttle,
      encrypt: options?.encrypt,
      resultTransformer: (responseData) => responseData,
    }
  );

  useEffect(() => {
    const data = countState.result;
    if (data && data.success) {
      const count = data.result;
      setTotalItemCount(count);
      setTotalPageCount(Math.max(1, Math.ceil(count / pageSize)));
    }
  }, [countState.result]);

  useEffect(() => {
    if (totalItemCount) {
      setTotalPageCount(Math.max(1, Math.ceil(totalItemCount / pageSize)));
    }
  }, [pageSize]);

  const searchState = useGenericRequest<any>(
    {
      url: `${entity.api.path}/search`,
      method: "POST",
      data: <DynamicModelFilter>{
        start: start,
        limit: limit,
        filterFields: filterFields,
        orders: orders,
      },
    },
    {
      manual: options?.manual,
      cache: options?.cache,
      cacheName: entity.api.cacheName,
      cacheAutoReload: options?.cacheAutoReload,
      throttle: options?.throttle,
      resultTransformer: (responseData) => responseData,
    }
  );

  useEffect(() => {
    const data = searchState.result;
    if (data) {
      if (data.success) {
        setItems(data.result);
        setHasMore(data.paging.hasMore || data.paging.start + data.paging.limit < data.paging.total);
        if (!options?.count) {
          setTotalItemCount(data.paging.total || data.paging.start + data.result.length || 0);
        }
      } else {
        setHasMore(false);
      }
    }
  }, [searchState.result]);

  useEffect(() => {
    if (searchState.error) {
      setHasMore(false);
    }
  }, [searchState.error]);

  useEffect(() => {
    setLoading(searchState.loading || countState.loading);
  }, [searchState.loading, countState.loading]);

  const executeRequest = useCallback((): void => {
    setLoading(true);

    if (options?.count) {
      countState.executeRequest();
    }
    searchState.executeRequest();
  }, [countState, countState.executeRequest, searchState.executeRequest, setLoading]);

  const cancelRequest = useCallback((): void => {
    setLoading(false);

    countState.cancelRequest();
    searchState.cancelRequest();
  }, [countState.cancelRequest, searchState.cancelRequest]);

  return {
    result: items,
    totalItemCount,
    totalPageCount,
    hasMore,
    loading,
    error: searchState.error,
    executed: searchState.executed,
    executeRequest,
    cancelRequest,
  };
}

export default useCrudSearch;
