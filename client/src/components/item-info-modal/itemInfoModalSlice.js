import { createSlice } from "@reduxjs/toolkit";

const initialState = {
    isOpen: false,
    target: null,
};


const ItemInfoModalSlice = createSlice({
    name: 'ITEM_INFO_MODAL',
    initialState,
    reducers: {
        setIsOpen: (state, action) => {
            state.isOpen = action.payload;
        },
        setTarget: (state, action) => {
            state.target = action.payload;
        }
    },
});


const {reducer, actions} = ItemInfoModalSlice;

export const {
    setIsOpen,
    setTarget,
} = actions;

export default reducer;