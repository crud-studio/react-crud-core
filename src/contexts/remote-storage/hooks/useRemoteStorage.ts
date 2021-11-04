import {useContext} from "react";
import {RemoteStorageContext, IRemoteStorageContext} from "../RemoteStorageContext";

const useRemoteStorage = (): IRemoteStorageContext => {
  const context = useContext(RemoteStorageContext);

  if (!context) throw new Error("RemoteStorageContext must be used inside RemoteStorageProvider");

  return context;
};
export default useRemoteStorage;
