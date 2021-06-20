/* tslint:disable */
/* eslint-disable */

export interface KeyValuePair<K, V> {
  key: K;
  value: V;
}

export interface ResultErrorDTO {
  key: string;
  message?: string;
  params: KeyValuePair<string, any | undefined>[];
  stackTrace?: string;
}

export interface ResultRO<Payload> {
  requestId?: string;
  success: boolean;
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
  orderBy: string;
  orderDesc: boolean;
  orders: OrderDTO[];
  returnColumn: string;
  cacheKey: string;
}

export interface DynamicModelFilter extends BaseModelFilter {
  filterFields: FilterField[];
}

export interface BaseRO<ID> {
  id: ID;
  creationTime: number;
}

export interface BaseJpaRO extends BaseRO<number> {
  id: number;
}

export interface BaseJpaUpdatableRO extends BaseJpaRO {
  lastUpdateTime: number;
}

export interface PagingRO {
  start: number;
  limit: number;
  total: number;
  hasMore: boolean;
}

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
