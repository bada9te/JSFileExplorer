import { createAsyncThunk, createSlice, current } from "@reduxjs/toolkit"
import { httpListDrives, httpNavigateFileSystem } from "../../requests/filesystem";
import { createItem } from "../move-copy-modal/createItemModalSlice";

const initialState = {
    items: [],
    currentPath: '',
    history: ['Home'],
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
            if (state.currentPath !== "") {
                state.currentPath += action.payload + '\\';
            } else {
                state.currentPath += action.payload;
            }
            
            let hs = current(state.history);
            if (hs[hs.length - 1] !== action.payload) {
                state.history.push(state.currentPath);
            }
        },
        setHistory: (state, action) => {
            state.history = action.payload;
        },
        setCurrentPath: (state, action) => {
            state.currentPath = action.payload;
        }
    },
    extraReducers: (builder) => {
        builder
            .addCase(fetchDrives.fulfilled, (state, action) => {
                const drives = action.payload.data.drives;
                const items = drives.map(i => ({ meta: { item: i, isDrive: true, isDirectory: false, isFile: false }}));
                state.items = items;
            })
            .addCase(navigateFS.fulfilled, (state, action) => {
                let items = action.payload.data.items
                            .map(i => ({ meta: {...i, isDrive: false} }))
                            .sort((a, b) => Number(b.meta.isDirectory) - Number(a.meta.isDirectory));
                state.items = items;
            })
            .addCase(createItem.fulfilled, (state, action) => {
                const result = action.payload.data;
                if (result.done) {
                    const itemToAdd = result.target.item;

                    //const items = JSON.parse(JSON.stringify(current(state.items)));
                    state.items.push({meta: itemToAdd});

                }
            })
    }
});


const {reducer, actions} = ItemsContainerSlice;

export const {
    setItems,
    forwardPath,
    setHistory,
    setCurrentPath,
} = actions;
export default reducer;