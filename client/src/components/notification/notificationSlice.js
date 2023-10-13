import { createSlice } from "@reduxjs/toolkit";

const initialState = {
    text: "",
    isShowing: false,
};


const notificationSlice = createSlice({
    name: "NOTIFICATION",
    initialState,
    reducers: {
        setText: (state, action) => {
            state.text = action.payload;
        },
        setIsShowing: (state, action) => {
            state.isShowing = action.payload;
        }
    }
});


const {reducer, actions} = notificationSlice;

export const {
    setText,
    setIsShowing,
} = actions;

export default reducer;