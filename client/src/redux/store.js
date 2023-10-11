import { configureStore } from "@reduxjs/toolkit";
import itemsContainerSlice from "../components/items-container/itemsContainerSlice";
import backForwardBtnsSlice from "../components/back-forward-btns/backForwardBtnsSlice";
import directoryTreeSlice from "../components/directory-tree/directoryTreeSlice";
import moveCopyModalSlice from "../components/move-copy-modal/moveCopyModalSlice";

const store = configureStore({
    reducer: {
        itemsContainer: itemsContainerSlice,
        backForwardBtns: backForwardBtnsSlice,
        directoryTree: directoryTreeSlice,
        moveCopyModal: moveCopyModalSlice,
    },
    middleware: (getDefaultMiddleware) => getDefaultMiddleware({ serializableCheck: false }),
    devTools: process.env.REACT_APP_VERSION_TYPE === "production" ? false : true,
});

export {
    store,
};