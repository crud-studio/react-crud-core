import cacheAdapterEnhancer from "./apis/adapters/cacheAdapterEnhancer";
import throttleAdapterEnhancer from "./apis/adapters/throttleAdapterEnhancer";
import useGenericRequest from "./apis/hooks/base/useGenericRequest";
import {RequestConfig, RequestOptions} from "./apis/hooks/base/useGenericRequest";
import useGenericRequestMany from "./apis/hooks/base/useGenericRequestMany";
import useGenericRequestUpload from "./apis/hooks/base/useGenericRequestUpload";
import useCrudCreate from "./apis/hooks/crud/useCrudCreate";
import useCrudCreateMany from "./apis/hooks/crud/useCrudCreateMany";
import useCrudCreateOrUpdate from "./apis/hooks/crud/useCrudCreateOrUpdate";
import useCrudCreateOrUpdateMany from "./apis/hooks/crud/useCrudCreateOrUpdateMany";
import useCrudDelete from "./apis/hooks/crud/useCrudDelete";
import useCrudDeleteMany from "./apis/hooks/crud/useCrudDeleteMany";
import useCrudSearch from "./apis/hooks/crud/useCrudSearch";
import useCrudSearchCount from "./apis/hooks/crud/useCrudSearchCount";
import useCrudShow from "./apis/hooks/crud/useCrudShow";
import useCrudUpdate from "./apis/hooks/crud/useCrudUpdate";
import useCrudUpdateMany from "./apis/hooks/crud/useCrudUpdateMany";
import {BaseEntity} from './declerations/entity';
import {
    GenericRequestState,
    GenericRequestStateMany,
    GenericRequestStateSearch,
    GenericRequestStateUpload
} from './declerations/internal';
import {
    BaseJpaRO,
    FilterField,
    FilterFieldOperation,
    BaseJpaUpdatableRO,
    BaseRO,
    BaseModelFilter,
    DynamicModelFilter,
    FilterFieldDataType,
    OrderDTO,
    KeyValuePair,
    ManyCrudResult,
    ManyFailedReason,
    ResultRO,
    PagingRO,
    ResultErrorDTO
} from './declerations/server';
import LocalStorageWrapper from "./helpers/LocalStorageWrapper";
import UpdatePackUtils from './helpers/UpdatePackUtils';
import {UrlOptions, addUrlParams, buildUrl, getUrlParam, getUrlParams, getUrlParamsQuerystring, removeUrlParam, setUrlParams, updateQuerystring} from './helpers/UrlUtils';
import useDebounceFn from "./hooks/useDebounceFn";
import {useItemDetailsState} from "./hooks/useItemDetailsState";
import {useItemIdUrlState} from "./hooks/useItemIdUrlState";
import {usePagination} from "./hooks/usePagination";
import useScript from "./hooks/useScript";
import {useUrlState} from "./hooks/useUrlState";
import {useUrlStateString} from "./hooks/useUrlStateString";

export {cacheAdapterEnhancer, throttleAdapterEnhancer};

export {useGenericRequest, RequestConfig, RequestOptions, useGenericRequestMany, useGenericRequestUpload};
export {
    useCrudCreate,
    useCrudCreateMany,
    useCrudCreateOrUpdate,
    useCrudCreateOrUpdateMany,
    useCrudDelete,
    useCrudDeleteMany,
    useCrudSearch,
    useCrudSearchCount,
    useCrudShow,
    useCrudUpdate,
    useCrudUpdateMany
};

export {BaseEntity};
export {GenericRequestState, GenericRequestStateMany, GenericRequestStateSearch, GenericRequestStateUpload};
export {
    BaseJpaRO,
    FilterField,
    FilterFieldOperation,
    BaseJpaUpdatableRO,
    BaseRO,
    BaseModelFilter,
    DynamicModelFilter,
    FilterFieldDataType,
    OrderDTO,
    KeyValuePair,
    ManyCrudResult,
    ManyFailedReason,
    ResultRO,
    PagingRO,
    ResultErrorDTO
};

export {LocalStorageWrapper, UpdatePackUtils};
export {UrlOptions, addUrlParams, buildUrl, getUrlParam, getUrlParams, getUrlParamsQuerystring, removeUrlParam, setUrlParams, updateQuerystring};

export {
    useDebounceFn,
    useItemDetailsState,
    useItemIdUrlState,
    usePagination,
    useScript,
    useUrlState,
    useUrlStateString
};
