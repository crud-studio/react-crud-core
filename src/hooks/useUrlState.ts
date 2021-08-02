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
  const [pathname] = useState<string>(window.location.pathname);

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
    return () => {
      if (_.isEqual(pathname, window.location.pathname) && !!getUrlParam(urlParam)) {
        removeUrlParam(urlParam, false);
      }
    };
  }, [state]);

  return [state, setState];
};
