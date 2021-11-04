import {useState, Dispatch, SetStateAction} from "react";
import LocalStorageWrapper from "../helpers/LocalStorageWrapper";
import _ from "lodash";

export const useLocalStorageState = <S>(key: string, initialValue?: S): [S, Dispatch<SetStateAction<S>>] => {
  const [item, setInnerValue] = useState<S>(() => {
    const valueItem = LocalStorageWrapper.get(key);
    return !_.isNil(valueItem) ? valueItem : initialValue;
  });

  const setValue = (value: SetStateAction<S>): SetStateAction<S> => {
    const valueToStore = value instanceof Function ? value(item) : value;
    setInnerValue(valueToStore);
    if (!_.isNil(valueToStore)) {
      LocalStorageWrapper.set(key, valueToStore);
    } else {
      LocalStorageWrapper.remove(key);
    }
    return value;
  };

  return [item, setValue];
};
