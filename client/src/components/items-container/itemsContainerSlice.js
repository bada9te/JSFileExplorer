import { createAsyncThunk, createSlice, current } from "@reduxjs/toolkit"
import { httpCopyFileOrFolder, httpCreateFileOrFolder, httpDeleteFileOrFolder, httpListDrives, httpMoveFileOrFoler, httpNavigateFileSystem } from "../../requests/filesystem";

const initialState = {
    items: [],
    currentPath: '',
    history: ['Home'],
    selectedItemToCopyPath: null,
    selectedItemToMovePath: null,
    selectedItemToRenamePath: null,
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

export const deleteItem = createAsyncThunk(
    'ITEMS_CONTAINER/delete-item',
    async({item, isFolder}, thunkApi) => {
        const currentPath = thunkApi.getState().itemsContainer.currentPath + '\\' + item;
        return await httpDeleteFileOrFolder(currentPath, isFolder ? "folder" : "file");
    }
);

export const createItem = createAsyncThunk(
    'ITEMS_CONTAINER/create-item',
    async({name, path, isFolder}) => {
        return await httpCreateFileOrFolder({path, name, type: isFolder ? "folder" : "file"});
    }
);

export const copyItem = createAsyncThunk(
    'ITEMS_CONTAINER/copy-item',
    async({source, destination}) => {
        return await httpCopyFileOrFolder(source, destination);
    }
);

export const moveItem = createAsyncThunk(
    'ITEMS_CONTAINER/move-item',
    async({source, destination}) => {
        return await httpMoveFileOrFoler(source, destination);
    }
)


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
        },
        setSelectedItemToCopyPath: (state, action) => {
            state.selectedItemToCopyPath = action.payload;
        },
        setSelectedItemToMovePath: (state, action) => {
            state.selectedItemToMovePath = action.payload;
        },
        setSelectedItemToRenamePath: (state, action) => {
            state.selectedItemToRenamePath = action.payload;
        },
        resetSelectedItems: (state, action) => {
            state.selectedItemToCopyPath = null;
            state.selectedItemToMovePath = null;
            state.selectedItemToRenamePath = null;
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
                    state.items.push({meta: result.target.item});
                }
            })
            .addCase(deleteItem.fulfilled, (state, { meta }) => {
                const name = meta.arg.item;
                const items = JSON.parse(JSON.stringify(current(state.items))).filter(i => i.meta.item !== name);
                state.items = items;
            })
            .addCase(copyItem.fulfilled, (state, action) => {
                const result = action.payload.data;
                if (result.done) {
                    state.items.push({meta: result.target.item});
                }
            })
            .addCase(moveItem.fulfilled, (state, action) => {
                const result = action.payload.data;
                if (result.done) {
                    state.items.push({meta: result.target.item});
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
    setSelectedItemToCopyPath,
    setSelectedItemToMovePath,
    setSelectedItemToRenamePath,
    resetSelectedItems,
} = actions;
export default reducer;