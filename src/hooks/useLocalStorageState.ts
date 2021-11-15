import {useState, Dispatch, SetStateAction} from "react";
import LocalStorageWrapper from "../helpers/LocalStorageWrapper";
import _ from "lodash";

export const useLocalStorageState = <S>(key: string, initialState: S | (() => S)): [S, Dispatch<SetStateAction<S>>] => {
  const [item, setInnerValue] = useState<S>(() => {
    const valueItem = LocalStorageWrapper.get(key);
    if (!_.isNil(valueItem)) {
      return valueItem;
    }
    return _.isFunction(initialState) ? initialState() : initialState;
  });

  const setValue = (value: SetStateAction<S>): void => {
    setInnerValue((currentInnerValue) => {
      const valueToStore = _.isFunction(value) ? value(currentInnerValue) : value;

      if (!_.isNil(valueToStore)) {
        LocalStorageWrapper.set(key, valueToStore);
      } else {
        LocalStorageWrapper.remove(key);
      }

      return valueToStore;
    });
  };

  return [item, setValue];
};
