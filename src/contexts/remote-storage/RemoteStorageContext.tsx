import React, {FunctionComponent, PropsWithChildren, useCallback, useEffect, useState} from "react";
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
  getValue: <T>(identifier: string) => T | null;
  setValue: <T>(identifier: string, value: T | null) => void;
  deleteValue: (identifier: string) => void;
}

const RemoteStorageContext = React.createContext<IRemoteStorageContext>(undefined!);

interface IProps extends PropsWithChildren<any> {
  loggedIn: boolean;
  autoRefresh?: boolean;
}

const RemoteStorageProvider: FunctionComponent<IProps> = ({loggedIn, autoRefresh = true, children}) => {
  const [lastUpdateTime, setLastUpdateTime] = useLocalStorageState<number>(PARAM_REMOTE_STORAGE_LAST_UPDATE_TIME, 0);
  const [values, setValues] = useLocalStorageState<RemoteStorageValueDTO[] | null>(PARAM_REMOTE_STORAGE_VALUES, null);
  const [refreshFlag, setRefreshFlag] = useState<number>(0);

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
  const saveState = useRemoteStorageSetValue(selectedValueToSave?.identifier || "", selectedValueToSave?.value || "");
  const deleteState = useRemoteStorageDeleteValue(selectedIdentifierToDelete || "");

  useEffect(() => {
    if (loggedIn && !getValuesState.loading) {
      const now = new Date().getTime();
      if (now - lastUpdateTime > 60000) {
        getValuesState.executeRequest();
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
    if (getValuesState.result) {
      setValues(getValuesState.result);
      setLastUpdateTime(new Date().getTime());
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
    if (saveState.result) {
      const savedValue = saveState.result;
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
      const remoteStorageValue = _.find(values, {identifier: identifier});
      return remoteStorageValue?.value ? JSON.parse(remoteStorageValue.value) : null;
    },
    [values]
  );

  const deleteValue = useCallback(
    (identifier: string): void => {
      setValues((currentValues) => (currentValues || []).filter((value) => value.identifier !== identifier));
      setIdentifiersToDelete((currentIdentifiersToDelete) => [
        ...currentIdentifiersToDelete.filter((i) => i !== identifier),
        identifier,
      ]);
    },
    [values]
  );

  const setValue = useCallback(
    <T,>(identifier: string, value: T | null): void => {
      if (_.isNil(value)) {
        deleteValue(identifier);
        return;
      }

      const valueString = JSON.stringify(value);

      setValues((currentValues) => [
        ...(currentValues || []).filter((v) => v.identifier !== identifier),
        {identifier: identifier, value: valueString},
      ]);

      setValuesToSave((currentValuesToSave) => [
        ...currentValuesToSave.filter((v) => v.identifier !== identifier),
        {identifier: identifier, value: valueString},
      ]);
    },
    [values]
  );

  return (
    <RemoteStorageContext.Provider value={{getValue, setValue, deleteValue}}>{children}</RemoteStorageContext.Provider>
  );
};

export {IRemoteStorageContext, RemoteStorageContext, RemoteStorageProvider};
