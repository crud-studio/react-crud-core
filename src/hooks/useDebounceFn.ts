import {useCallback} from "react";
import _ from "lodash";
import {useUnmount} from "react-use";

const useDebounceFn = (fn: any, wait: number) => {
  const fnDebounced = useCallback(_.debounce(fn, wait), []);

  useUnmount(() => {
    fnDebounced.cancel();
  });

  return fnDebounced;
};

export default useDebounceFn;
