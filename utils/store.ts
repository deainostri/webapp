import React from "react";

export const createContext = (storeInstance: any) =>
    React.createContext(storeInstance);

export function useStore(storeClass: any, storeContext: any) {
    const store = React.useContext(storeContext);

    if (!store) {
        throw new Error("useStore must be used within a StoreProvider.");
    }

    return store;
}
