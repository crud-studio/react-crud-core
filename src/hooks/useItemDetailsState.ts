import {useCallback, useEffect, useRef, useState} from "react";
import {useItemIdUrlState} from "./useItemIdUrlState";
import useCrudShow from "../apis/hooks/crud/useCrudShow";
import useCrudCreateOrUpdate from "../apis/hooks/crud/useCrudCreateOrUpdate";
import _ from "lodash";
import {useUpdateEffect} from "react-use";
import {v4 as uuidv4} from "uuid";
import useDebounceFn from "./useDebounceFn";
import UpdatePackUtils from "../helpers/UpdatePackUtils";
import {useUrlStateString} from "./useUrlStateString";
import {PartialDeep} from "type-fest";
import {BaseEntity} from "../models/entity";
import {BaseJpaRO} from "../models/server";
import {URL_PARAM_UPDATE_PACK} from "../constants/urlKeys";

export const useItemDetailsState = <EntityRO extends BaseJpaRO>(
  entity: BaseEntity,
  generateEmptyItem: (() => EntityRO) | undefined,
  generateUrlFn: (id?: number) => string,
): {
  initialValue: Partial<EntityRO>;
  item: (EntityRO & {uniqueKey?: string}) | undefined;
  setItem: (updatedItem: EntityRO & {uniqueKey?: string}) => void;
  itemId: number;
  editable: boolean;
  loading: boolean;
  saving: boolean;
  hasChanges: boolean;
  saveItem: () => void;
  updateItem: (itemData: PartialDeep<EntityRO>, debounced: boolean) => void;
  refreshItem: () => void;
} => {
  const [itemId, setItemId] = useItemIdUrlState(generateUrlFn);
  const [initialValue, setInitialValue] = useState<Partial<EntityRO>>({});
  const [updatePackId, setUpdatePackId] = useUrlStateString(URL_PARAM_UPDATE_PACK);

  const [dataItem, setDataItem] = useState<(PartialDeep<EntityRO> & {uniqueKey?: string}) | undefined>(undefined);
  const saveState = useCrudCreateOrUpdate<EntityRO>(entity, dataItem);
  const [saving, setSaving] = useState<boolean>(false);

  const [hasChanges, setHasChanges] = useState<boolean>(false);
  const lastChangeTime = useRef<number>(0);
  const lastSaveTime = useRef<number>(0);

  const [saveMillis, setSaveMillis] = useState<number>(0);
  const saveDebounced = useDebounceFn(setSaveMillis, 2500);

  const [item, setItemInternal] = useState<(EntityRO & {uniqueKey?: string}) | undefined>(undefined);
  const setItem = useCallback(
    (updatedItem: EntityRO & {uniqueKey?: string}): void => {
      if (updatePackId) {
        const updatePack = UpdatePackUtils.popUpdatePack(updatePackId);
        console.log(updatePackId, updatePack);
        setUpdatePackId("");

        if (updatePack) {
          updatedItem = _.merge({}, updatedItem, updatePack);
          if (!!updatedItem.id) {
            saveItem();
          }
        }
      }

      if (!item) {
        setInitialValue(updatedItem);
      }

      setItemInternal((item: EntityRO | undefined) => {
        if (!item || !updatedItem) {
          return updatedItem;
        } else {
          return {...item, ...updatedItem};
        }
      });
    },
    [item, setItemInternal, updatePackId, setUpdatePackId, setDataItem]
  );

  const editable = true;

  const showState = useCrudShow<EntityRO>(entity, itemId, {manual: true});
  const [refresh, setRefresh] = useState<number>(0);

  useEffect(() => {
    if (itemId && (!item || item.id !== itemId)) {
      showState.executeRequest();
    }

    if (!itemId && generateEmptyItem) {
      setItem(_.merge({uniqueKey: uuidv4()}, generateEmptyItem()));
    }
  }, [itemId]);

  useUpdateEffect(() => {
    if (itemId) {
      showState.executeRequest();
    }
  }, [refresh]);

  const refreshItem = useCallback((): void => {
    setRefresh((refresh) => refresh + 1);
  }, []);

  useEffect(() => {
    if (showState && showState.result) {
      setItem(_.merge({uniqueKey: uuidv4()}, showState.result));
    }
  }, [showState.result]);

  useEffect(() => {
    if (dataItem) {
      setSaving(true);
      lastSaveTime.current = new Date().getTime();
      saveState.executeRequest();
    }
  }, [dataItem]);

  useEffect(() => {
    if (saveState && saveState.result) {
      let hasChanges = lastChangeTime.current > lastSaveTime.current;

      if (!item || item.id !== saveState.result.id || !hasChanges) {
        setItem(saveState.result);
        setItemId(saveState.result.id);
      }

      setSaving(false);
      setHasChanges(hasChanges);
    }
  }, [saveState.result]);

  useEffect(() => {
    if (saveState && saveState.error) {
      setSaving(false);
    }
  }, [saveState.error]);

  const saveItem = (): void => {
    const now = new Date().getTime();
    setSaveMillis(now);
    saveDebounced(now);
  };

  useEffect(() => {
    if (item && editable && saveMillis) {
      saveDebounced(0);

      setDataItem(_.merge({}, item as PartialDeep<EntityRO> & {uniqueKey?: string}));
    }
  }, [saveMillis]);

  const updateItem = useCallback(
    (itemData: PartialDeep<EntityRO>, debounced: boolean = true): void => {
      setItem(
        _.mergeWith({}, item, itemData, (objValue, srcValue) => {
          if (_.isArray(srcValue)) {
            return srcValue;
          }
        })
      );

      let now = new Date().getTime();

      setHasChanges(true);
      lastChangeTime.current = now;

      if (debounced) {
        saveDebounced(now);
      } else {
        setSaveMillis(now);
      }
    },
    [setItem, setHasChanges, saveDebounced, setSaveMillis]
  );

  return {
    initialValue,
    item,
    setItem,
    itemId,
    editable,
    loading: showState.loading,
    saving,
    hasChanges,
    saveItem,
    updateItem,
    refreshItem,
  };
};
