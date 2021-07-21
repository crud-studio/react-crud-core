import {Dispatch, SetStateAction, useState} from "react";
import {useUpdateEffect} from "react-use";
import {useParams} from "react-router-dom";

export const useItemIdUrlState = (
  generateUrlFn: (id?: number) => string
): [number, Dispatch<SetStateAction<number>>] => {
  const params = useParams();

  const getUrlId = (): number => {
    return parseInt(params.id || "0");
  };

  const [itemId, setItemId] = useState<number>(getUrlId());
  // When the item is saved we update the url to the new item id so it will show on refresh.
  useUpdateEffect(() => {
    if (getUrlId() === 0 && itemId > 0) {
      let newUrl = generateUrlFn(itemId);
      if (newUrl.indexOf("?") < 0) {
        const querystring = window.location.search || "";
        newUrl += querystring;
      }
      window.history.replaceState({}, "", newUrl);
    }
  }, [itemId]);

  return [itemId, setItemId];
};
