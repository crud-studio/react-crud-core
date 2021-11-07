import React, {FunctionComponent, PropsWithChildren, useCallback, useEffect, useMemo, useRef, useState} from "react";
import {useLocalStorageState} from "../../hooks/useLocalStorageState";
import {
  PARAM_REMOTE_STORAGE_IDENTIFIERS_TO_DELETE,
  PARAM_REMOTE_STORAGE_LAST_UPDATE_TIME,
  PARAM_REMOTE_STORAGE_VALUES,
  PARAM_REMOTE_STORAGE_VALUES_TO_SAVE,
} from "../../constants/localStorageKeys";
import {RemoteStorageValueDTO} from "../../models/server";
import _ from "lodash";
import useRemoteStorageDeleteValue from "../../apis/hooks/remote-storage/useRemoteStorageDeleteValue";
import useRemoteStorageSetValue from "../../apis/hooks/remote-storage/useRemoteStorageSetValue";
import useRemoteStorageGetValues from "../../apis/hooks/remote-storage/useRemoteStorageGetValues";

interface IRemoteStorageContext {
  initialized: boolean;
  lastUpdateTime: number;
  getValue: <T>(identifier: string) => T | null;
  setValue: <T>(identifier: string, value: T | null) => void;
  deleteValue: (identifier: string) => void;
}

const RemoteStorageContext = React.createContext<IRemoteStorageContext>(undefined!);

interface IProps extends PropsWithChildren<any> {
  loggedIn: boolean;
  autoRefresh?: boolean;
}

interface RemoteStorageValueTimed extends RemoteStorageValueDTO {
  updateTime: number;
}

const RemoteStorageProvider: FunctionComponent<IProps> = ({loggedIn, autoRefresh = true, children}) => {
  const [lastUpdateTime, setLastUpdateTime] = useLocalStorageState<number>(PARAM_REMOTE_STORAGE_LAST_UPDATE_TIME, 0);
  const [values, setValues] = useLocalStorageState<RemoteStorageValueTimed[] | null>(PARAM_REMOTE_STORAGE_VALUES, null);
  const [refreshFlag, setRefreshFlag] = useState<number>(0);

  const initialized = useMemo<boolean>(() => lastUpdateTime > 0, [lastUpdateTime]);

  const [valuesToSave, setValuesToSave] = useLocalStorageState<RemoteStorageValueDTO[]>(
    PARAM_REMOTE_STORAGE_VALUES_TO_SAVE,
    []
  );
  const [selectedValueToSave, setSelectedValueToSave] = useState<RemoteStorageValueDTO | null>(null);

  const [identifiersToDelete, setIdentifiersToDelete] = useLocalStorageState<string[]>(
    PARAM_REMOTE_STORAGE_IDENTIFIERS_TO_DELETE,
    []
  );
  const [selectedIdentifierToDelete, setSelectedIdentifierToDelete] = useState<string | null>(null);

  const getValuesState = useRemoteStorageGetValues();
  const getValuesRequestTime = useRef<number>(0);

  const saveState = useRemoteStorageSetValue(selectedValueToSave?.identifier || "", selectedValueToSave?.value || "");
  const deleteState = useRemoteStorageDeleteValue(selectedIdentifierToDelete || "");

  useEffect(() => {
    if (loggedIn && !getValuesState.loading) {
      const now = new Date().getTime();
      if (now - lastUpdateTime > 60000) {
        getValuesState.executeRequest();
        getValuesRequestTime.current = now;
      }
    }
  }, [loggedIn, refreshFlag]);

  useEffect(() => {
    const interval = setInterval(() => {
      setRefreshFlag((currentRefreshFlag) => currentRefreshFlag + 1);
    }, 1_800_000);

    return () => {
      clearInterval(interval);
    };
  }, []);

  useEffect(() => {
    const resultValues = getValuesState.result;
    if (resultValues) {
      const now = new Date().getTime();
      setLastUpdateTime(now);
      setValues((currentValues) => {
        const recentClientChanges = (currentValues || []).filter((v) => v.updateTime > getValuesRequestTime.current);
        recentClientChanges.forEach((recentClientChange) => {
          _.remove(resultValues, (v) => v.identifier === recentClientChange.identifier);
        });

        return [
          ...recentClientChanges,
          ...resultValues.map<RemoteStorageValueTimed>((dto) => ({...dto, updateTime: now})),
        ];
      });
    }
  }, [getValuesState.result]);

  useEffect(() => {
    if (saveState.loading) {
      return;
    }

    const selectedValueToSave = _.first(valuesToSave);
    if (selectedValueToSave) {
      setSelectedValueToSave(selectedValueToSave);
    }
  }, [valuesToSave, saveState.result]);

  useEffect(() => {
    if (selectedValueToSave) {
      saveState.executeRequest();
    }
  }, [selectedValueToSave]);

  useEffect(() => {
    const savedValue = saveState.result;
    if (savedValue) {
      setValuesToSave((currentValuesToSave) =>
        // If the value is different it means there is a later update to this identifier and we should not remove it.
        currentValuesToSave.filter((v) => v.identifier !== savedValue.identifier || v.value !== savedValue.value)
      );
    }
  }, [saveState.result]);

  useEffect(() => {
    if (deleteState.loading) {
      return;
    }

    const selectedIdentifierToDelete = _.first(identifiersToDelete);
    if (selectedIdentifierToDelete) {
      setSelectedIdentifierToDelete(selectedIdentifierToDelete);
    }
  }, [identifiersToDelete, deleteState.result]);

  useEffect(() => {
    if (selectedIdentifierToDelete) {
      deleteState.executeRequest();
    }
  }, [selectedIdentifierToDelete]);

  useEffect(() => {
    if (deleteState.result && selectedIdentifierToDelete) {
      setIdentifiersToDelete((currentIdentifiersToDelete) =>
        currentIdentifiersToDelete.filter((i) => i !== selectedIdentifierToDelete)
      );
    }
  }, [deleteState.result]);

  const getValue = useCallback(
    <T,>(identifier: string): T | null => {
      if (!loggedIn) {
        return null;
      }

      const remoteStorageValue = _.find(values, {identifier: identifier});
      return remoteStorageValue?.value ? JSON.parse(remoteStorageValue.value) : null;
    },
    [values, loggedIn]
  );

  const deleteValue = useCallback(
    (identifier: string): void => {
      if (!loggedIn) {
        return;
      }

      setValues((currentValues) => (currentValues || []).filter((value) => value.identifier !== identifier));
      setIdentifiersToDelete((currentIdentifiersToDelete) => [
        ...currentIdentifiersToDelete.filter((i) => i !== identifier),
        identifier,
      ]);
    },
    [loggedIn, setValues, setIdentifiersToDelete]
  );

  const setValue = useCallback(
    <T,>(identifier: string, value: T | null): void => {
      if (!loggedIn) {
        return;
      }

      if (_.isNil(value)) {
        deleteValue(identifier);
        return;
      }

      const valueString = JSON.stringify(value);
      const now = new Date().getTime();

      setValues((currentValues) => [
        ...(currentValues || []).filter((v) => v.identifier !== identifier),
        {identifier: identifier, value: valueString, updateTime: now},
      ]);

      setValuesToSave((currentValuesToSave) => [
        ...currentValuesToSave.filter((v) => v.identifier !== identifier),
        {identifier: identifier, value: valueString},
      ]);
    },
    [values, loggedIn, deleteValue, setValues, setValuesToSave]
  );

  return (
    <RemoteStorageContext.Provider value={{initialized, lastUpdateTime, getValue, setValue, deleteValue}}>
      {children}
    </RemoteStorageContext.Provider>
  );
};

export {IRemoteStorageContext, RemoteStorageContext, RemoteStorageProvider};
