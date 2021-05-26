import {useUrlState} from "./useUrlState";
import {Dispatch, SetStateAction} from "react";

export const useUrlStateString = (
  urlParam: string,
  defaultValue: string | null = null,
  shouldSaveState: ((state: string | null) => boolean) | null = null,
  stateParser: ((urlState: string) => string | null) | null = null,
  stateStringify: ((state: string | null) => string) | null = null,
  addToHistory: boolean = false
): [string | null, Dispatch<SetStateAction<string | null>>] => {
  return useUrlState<string | null>(
    urlParam,
    defaultValue,
    shouldSaveState,
    stateParser || ((urlState: string) => urlState),
    stateStringify || ((state: string | null) => state || ""),
    addToHistory
  );
};
