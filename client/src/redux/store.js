import { configureStore } from "@reduxjs/toolkit";
import itemsContainerSlice from "../components/items-container/itemsContainerSlice";

const store = configureStore({
    reducer: {
        itemsContainer: itemsContainerSlice,
    },
    middleware: (getDefaultMiddleware) => getDefaultMiddleware({ serializableCheck: false }),
    devTools: process.env.REACT_APP_VERSION_TYPE === "production" ? false : true,
});

export {
    store,
};