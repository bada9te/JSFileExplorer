import { createSlice } from "@reduxjs/toolkit";


const initialState = {
    backwardAllowed: false,
    forwardAllowed: false,
};

const BackForwardBtnsSlice = createSlice({
    name: 'NAV_BTNS',
    initialState,
    reducers: {
        setBackwardAllowed: (state, action) => {
            state.backwardAllowed = action.payload;
        },
        setForwardAllowed: (state, action) => {
            state.forwardAllowed = action.payload;
        },
    }
});

const { reducer, actions } = BackForwardBtnsSlice;

export const {
    setBackwardAllowed,
    setForwardAllowed,
} = actions;

export default reducer;