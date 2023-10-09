import { createAsyncThunk, createSlice, current } from "@reduxjs/toolkit"
import { httpListDrives, httpNavigateFileSystem } from "../../requests/filesystem";

const initialState = {
    items: [],
    currentPath: '',
    history: [],
};

export const fetchDrives = createAsyncThunk(
    'ITEMS_CONTAINER/fetch-drives',
    async() => {
        return await httpListDrives();
    }
);

export const navigateFS = createAsyncThunk(
    'ITEMS_CONTAINER/navigate-fs',
    async(_, thunkApi) => {
        const currentPath = thunkApi.getState().itemsContainer.currentPath;
        return await httpNavigateFileSystem(currentPath);
    }
);


const ItemsContainerSlice = createSlice({
    name: 'ITEMS_CONTAINER',
    initialState,
    reducers: {
        setItems: (state, action) => {
            state.items = action.payload;
        },
        forwardPath: (state, action) => {
            state.currentPath += action.payload + '\\';
            state.history.push(state.currentPath);
        }
    },
    extraReducers: (builder) => {
        builder
            .addCase(fetchDrives.fulfilled, (state, action) => {
                const drives = action.payload.data.drives;
                const items = drives.map(i => ({ name: i, type: "drive" }));
                state.items = items;
            })
            .addCase(navigateFS.fulfilled, (state, action) => {
                let items = action.payload.data.items;
                items = items.map(i => ({name: i, type: "directory"}));
                state.items = items;
            })
    }
});


const {reducer, actions} = ItemsContainerSlice;

export const {
    setItems,
    forwardPath,
} = actions;
export default reducer;