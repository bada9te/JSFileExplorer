import { createAsyncThunk, createSlice, current } from "@reduxjs/toolkit";
import { httpGetDirectoryTree } from "../../requests/filesystem";

const initialState = {
    tree: null,
    upTime: 0,
};

export const fetchTree = createAsyncThunk(
    'fetch-tree',
    async(_, thunkApi) => {
        const path = thunkApi.getState().itemsContainer.currentPath;
        return await httpGetDirectoryTree(path);
    }
);

export const fetchSubTree = createAsyncThunk(
    'fetch-subtree',
    async(path) => {
        return await httpGetDirectoryTree(path);
    }
)


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
            })
            .addCase(fetchSubTree.fulfilled, (state, action) => {
                // extract subtree location
                let objectPath = action.meta.arg.split('\\').slice(1, action.meta.arg.length).filter(i => i !== "");

                // update tree
                let tree = JSON.parse(JSON.stringify(current(state.tree)));
                let currentLevel = tree;

                for (let i = 0; i < objectPath.length - 1; i++) {
                    const key = objectPath[i];
                    currentLevel = currentLevel[key];
                }
                
                const lastKey = objectPath[objectPath.length - 1];
                currentLevel[lastKey] = action.payload.data.tree;

                // save
                state.tree = tree;
                state.upTime++;
            });
    }
});


const {reducer, actions} = DirectoryTreeSlice;

export const {
    setTree,
} = actions;

export default reducer;