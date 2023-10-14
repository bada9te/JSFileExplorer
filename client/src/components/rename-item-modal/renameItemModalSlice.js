import { createSlice } from "@reduxjs/toolkit";
import { renameItem } from "../items-container/itemsContainerSlice";

const initialState = {
    isOpen: false,
};


const RenameItemModalSlice = createSlice({
    name: 'RENAME_ITEM_MODAL',
    initialState,
    reducers: {
        setIsOpen: (state, action) => {
            state.isOpen = action.payload;
        }
    },
    extraReducers: (builder) => {
        builder
            .addCase(renameItem.fulfilled, (state, action) => {
                state.isOpen = false;
            });
    }
});

const {reducer, actions} = RenameItemModalSlice;

export const {
    setIsOpen,
} = actions;

export default reducer;