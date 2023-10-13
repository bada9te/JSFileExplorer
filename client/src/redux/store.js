import { configureStore } from "@reduxjs/toolkit";
import itemsContainerSlice from "../components/items-container/itemsContainerSlice";
import controlBtnsSlice from "../components/control-btns/controlBtnsSlice";
import directoryTreeSlice from "../components/directory-tree/directoryTreeSlice";
import createItemModalSlice from "../components/move-copy-modal/createItemModalSlice";
import notificationSlice from "../components/notification/notificationSlice";

const store = configureStore({
    reducer: {
        itemsContainer: itemsContainerSlice,
        controlBtns: controlBtnsSlice,
        directoryTree: directoryTreeSlice,
        createItemModal: createItemModalSlice,
        notification: notificationSlice,
    },
    middleware: (getDefaultMiddleware) => getDefaultMiddleware({ serializableCheck: false }),
    devTools: process.env.REACT_APP_VERSION_TYPE === "production" ? false : true,
});

export {
    store,
};