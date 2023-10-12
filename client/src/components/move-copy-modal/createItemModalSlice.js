import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { httpCreateFileOrFolder } from "../../requests/filesystem";

const initialState = {
    isOpen: false,
};


export const createItem = createAsyncThunk(
    'create',
    async({name, path, isFolder}) => {
        return await httpCreateFileOrFolder({path, name, type: isFolder ? "folder" : "file"});
    }
);


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