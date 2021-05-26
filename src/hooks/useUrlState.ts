import {Dispatch, SetStateAction, useEffect, useState} from "react";
import _ from "lodash";
import {addUrlParams, getUrlParam, removeUrlParam} from "../helpers/UrlUtils";

export const useUrlState = <T>(
  urlParam: string,
  defaultValue: T,
  shouldSaveState: ((state: T) => boolean) | null = null,
  stateParser: ((urlState: string) => T | null) | null = null,
  stateStringify: ((state: T) => string) | null = null,
  addToHistory: boolean = false
): [T, Dispatch<SetStateAction<T>>] => {
  const getInitialState = (): T => {
    let urlParamValue = getUrlParam(urlParam, "");
    if (urlParamValue && stateParser) {
      return stateParser(urlParamValue) || defaultValue;
    }
    return defaultValue;
  };

  const [state, setState] = useState<T>(getInitialState());

  const shouldSaveStateInternal = (state: T): boolean => {
    if (shouldSaveState) {
      return shouldSaveState(state);
    }
    return !!state;
  };

  useEffect(() => {
    if (state && shouldSaveStateInternal(state)) {
      const paramValue: string = stateStringify ? stateStringify(state) : _.toString(state);
      addUrlParams({[urlParam]: paramValue}, addToHistory);
    } else {
      removeUrlParam(urlParam, addToHistory);
    }
  }, [state]);

  return [state, setState];
};
