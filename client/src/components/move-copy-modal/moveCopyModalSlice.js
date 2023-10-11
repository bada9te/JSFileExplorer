import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { httpCopyFileOrFolder, httpMoveFileOrFoler } from "../../requests/filesystem";

const initialState = {
    filePath: null,
    targetPath: null,
    action: "copy",
};


export const moveOrCopy = createAsyncThunk(
    'move-or-copy',
    async(_, thunkApi) => {
        const state = thunkApi.getState().moveCopyModal;
        if (state.action === "copy") {
            return await httpCopyFileOrFolder(state.filePath, state.targetPath);
        } else {
            return await httpMoveFileOrFoler(state.filePath, state.targetPath);
        }
    }
);


const MoveCopyModalSlice = createSlice({
    name: 'MOVE_COPY_MODAL',
    initialState,
    reducers: {
        setFilePath: (state, action) => {
            state.filePath = action.payload;
        },
        setTargetPath: (state, action) => {
            state.targetPath = action.payload;
        },
    },
});

const {reducer, actions} = MoveCopyModalSlice;

export const {
    setFilePath,
    setTargetPath,
} = actions;

export default reducer;