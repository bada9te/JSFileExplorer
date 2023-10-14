import { configureStore } from "@reduxjs/toolkit";
import itemsContainerSlice from "../components/items-container/itemsContainerSlice";
import controlBtnsSlice from "../components/control-btns/controlBtnsSlice";
import directoryTreeSlice from "../components/directory-tree/directoryTreeSlice";
import createItemModalSlice from "../components/create-item-modal/createItemModalSlice";
import notificationSlice from "../components/notification/notificationSlice";
import renameItemModalSlice from "../components/rename-item-modal/renameItemModalSlice";

const store = configureStore({
    reducer: {
        itemsContainer: itemsContainerSlice,
        controlBtns: controlBtnsSlice,
        directoryTree: directoryTreeSlice,
        createItemModal: createItemModalSlice,
        notification: notificationSlice,
        renameItemModal: renameItemModalSlice,
    },
    middleware: (getDefaultMiddleware) => getDefaultMiddleware({ serializableCheck: false }),
    devTools: process.env.REACT_APP_VERSION_TYPE === "production" ? false : true,
});

export {
    store,
};