/* tslint:disable */
/* eslint-disable */

export interface AbstractJpaRO {
  id: number;
}

export interface AbstractJpaUpdatableRO extends AbstractJpaRO {
  creationTime?: DateAsNumber;
  lastUpdateTime?: DateAsNumber;
}

export interface ResultErrorDTO {
  key: string;
  message?: string;
  params: KeyValuePair<string, any | undefined>[];
  stackTrace?: string;
}

export interface ResultRO<Payload> {
  success: boolean;
  requestId?: string;
  errorObject?: ResultErrorDTO;
  result?: Payload;
  paging?: PagingRO;
}

export interface ManyCrudResult<RequestRO, ResponseRO> {
  failed: ManyFailedReason<RequestRO>[];
  successful: ResponseRO[];
}

export interface ManyFailedReason<RequestRO> {
  object: RequestRO;
  reason: string;
}

export interface OrderDTO {
  by?: string;
  descending: boolean;
}

export interface FilterField {
  fieldName?: string;
  operation: FilterFieldOperation;
  dataType?: FilterFieldDataType;
  enumType?: string;
  values?: any[];
  children?: FilterField[];
  validated?: boolean;
  value1?: any;
  value2?: any;
}

export interface BaseModelFilter {
  start: number;
  limit: number;
  orders: OrderDTO[];
  returnColumn?: string;
  cacheKey?: string;
}

export interface DynamicModelFilter extends BaseModelFilter {
  filterFields: FilterField[];
}

export interface PagingRO {
  start: number;
  limit: number;
  total: number;
  hasMore: boolean;
}

export interface ParamDefinition {
  name: string;
  type: string;
}

export interface ExceptionDisplayDTO {
  key: string;
  fullName: string;
  params: ParamDefinition[];
}

export interface ErrorField {
  fieldName: string;
  message: string;
  attributes: {[index: string]: any};
}

export interface KeyValuePair<K, V> {
  key: K;
  value: V;
}

export interface MediaFileRO extends AbstractJpaUpdatableRO {
  uuid?: string;
  name?: string;
  extension?: string;
  size?: number;
  alias?: string;
  description?: string;
  creatorObjectId?: number;
  creatorObjectType?: string;
  fileHash?: string;
}

export interface MinimalMediaFileRO extends AbstractJpaUpdatableRO {
  uuid?: string;
  name?: string;
  extension?: string;
  size?: number;
  alias?: string;
}

export type DateAsNumber = number;

export type FilterFieldOperation =
  | "Equal"
  | "NotEqual"
  | "In"
  | "NotIn"
  | "GreaterThan"
  | "GreaterEqual"
  | "LowerThan"
  | "LowerEqual"
  | "Between"
  | "Contains"
  | "IsNull"
  | "IsNotNull"
  | "And"
  | "Or"
  | "Not"
  | "ContainsIn"
  | "NotContainsIn"
  | "RawJunction"
  | "StartsWith"
  | "EndsWith"
  | "Noop";

export type FilterFieldDataType =
  | "String"
  | "Integer"
  | "Long"
  | "Double"
  | "Boolean"
  | "Date"
  | "Object"
  | "Enum"
  | "None";
