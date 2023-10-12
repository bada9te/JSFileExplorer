import { createSlice } from "@reduxjs/toolkit";


const initialState = {
    backwardAllowed: false,
    forwardAllowed: false,
};

const ControlBtnsSlice = createSlice({
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

const { reducer, actions } = ControlBtnsSlice;

export const {
    setBackwardAllowed,
    setForwardAllowed,
} = actions;

export default reducer;