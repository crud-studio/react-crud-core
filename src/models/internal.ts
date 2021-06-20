import {ManyFailedReason} from "./server";

export interface GenericRequestState<ResponseRO> {
  result: ResponseRO | undefined;
  loading: boolean;
  error: any;
  executed: boolean;
  executeRequest: () => void;
  cancelRequest: () => void;
}

export interface GenericRequestStateMany<RequestRO, ResponseRO>
  extends Omit<GenericRequestState<ResponseRO>, "result"> {
  successful: ResponseRO[] | undefined;
  failed: ManyFailedReason<RequestRO>[] | undefined;
}

export interface GenericRequestStateSearch<ResponseRO> extends GenericRequestState<ResponseRO[]> {
  totalItemCount: number;
  totalPageCount: number;
  hasMore: boolean;
}

export interface GenericRequestStateUpload<ResponseRO> extends GenericRequestState<ResponseRO> {
  progress: number;
}
