import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { httpGetDirectoryTree } from "../../requests/filesystem";

const initialState = {
    tree: null,
};

export const fetchTree = createAsyncThunk(
    'fetch-tree',
    async(_, thunkApi) => {
        const requestedPath = thunkApi.getState().itemsContainer.currentPath;
        return await httpGetDirectoryTree(requestedPath);
    }
);


const DirectoryTreeSlice = createSlice({
    name: 'DIRECTORY_TREE',
    initialState,
    reducers: {
        setTree: (state, action) => {
            state.tree = action.payload;
        }
    },
    extraReducers: (builder) => {
        builder
            .addCase(fetchTree.fulfilled, (state, action) => {
                state.tree = action.payload.data.tree;
            });
    }
});


const {reducer, actions} = DirectoryTreeSlice;

export const {
    setTree,
} = actions;

export default reducer;