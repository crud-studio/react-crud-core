import {useState, Dispatch, SetStateAction} from "react";
import LocalStorageWrapper from "../helpers/LocalStorageWrapper";
import _ from "lodash";

type Options = {
  encrypted?: boolean;
};

export const useLocalStorageState = <S>(
  key: string,
  initialState: S | (() => S),
  options: Options = {encrypted: true}
): [S, Dispatch<SetStateAction<S>>] => {
  const [item, setInnerValue] = useState<S>(() => {
    if (options.encrypted) {
      const valueItem = LocalStorageWrapper.get(key);
      if (!_.isNil(valueItem)) {
        return valueItem;
      }
    } else {
      const valueItemString = localStorage.getItem(key);
      if (!_.isNil(valueItemString)) {
        return JSON.parse(valueItemString);
      }
    }
    return _.isFunction(initialState) ? initialState() : initialState;
  });

  const setValue = (value: SetStateAction<S>): void => {
    setInnerValue((currentInnerValue) => {
      const valueToStore = _.isFunction(value) ? value(currentInnerValue) : value;

      if (!_.isNil(valueToStore)) {
        if (options.encrypted) {
          LocalStorageWrapper.set(key, valueToStore);
        } else {
          localStorage.setItem(key, JSON.stringify(valueToStore));
        }
      } else {
        if (options.encrypted) {
          LocalStorageWrapper.remove(key);
        } else {
          localStorage.removeItem(key);
        }
      }

      return valueToStore;
    });
  };

  return [item, setValue];
};
