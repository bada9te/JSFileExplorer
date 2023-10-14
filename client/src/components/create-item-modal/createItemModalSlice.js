import { createSlice } from "@reduxjs/toolkit";
import { createItem } from "../items-container/itemsContainerSlice";

const initialState = {
    isOpen: false,
};


const CreateItemModalSlice = createSlice({
    name: 'CREATE_ITEM_MODAL',
    initialState,
    reducers: {
        setIsOpen: (state, action) => {
            state.isOpen = action.payload;
        }
    },
    extraReducers: (builder) => {
        builder
            .addCase(createItem.fulfilled, (state, action) => {
                state.isOpen = false;
            });
    }
});

const {reducer, actions} = CreateItemModalSlice;

export const {
    setIsOpen,
} = actions;

export default reducer;