import cacheAdapterEnhancer from "./apis/adapters/cacheAdapterEnhancer";
import throttleAdapterEnhancer from "./apis/adapters/throttleAdapterEnhancer";
import useGenericRequest from "./apis/hooks/base/useGenericRequest";
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
import * as Entity from './declerations/entity'
import * as Internal from './declerations/internal'
import * as Server from './declerations/server'
import LocalStorageWrapper from "./helpers/LocalStorageWrapper";
import * as UrlUtils from './helpers/UrlUtils'
import * as UpdatePackUtils from './helpers/UpdatePackUtils'
import useDebounceFn from "./hooks/useDebounceFn";
import {useItemDetailsState} from "./hooks/useItemDetailsState";
import {useItemIdUrlState} from "./hooks/useItemIdUrlState";
import {usePagination} from "./hooks/usePagination";
import useScript from "./hooks/useScript";
import {useUrlState} from "./hooks/useUrlState";
import {useUrlStateString} from "./hooks/useUrlStateString";

export {cacheAdapterEnhancer, throttleAdapterEnhancer};

export {useGenericRequest, useGenericRequestMany, useGenericRequestUpload};
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

export {Entity, Internal, Server};

export {LocalStorageWrapper, UpdatePackUtils, UrlUtils};

export {
    useDebounceFn,
    useItemDetailsState,
    useItemIdUrlState,
    usePagination,
    useScript,
    useUrlState,
    useUrlStateString
};
