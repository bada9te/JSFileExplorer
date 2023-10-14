import * as React from 'react';
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import { useDispatch, useSelector } from 'react-redux';
import { setIsOpen } from './createItemModalSlice';
import { Checkbox, FormControlLabel, FormGroup } from '@mui/material';
import { createItem } from '../items-container/itemsContainerSlice';
import { unwrapResult } from '@reduxjs/toolkit';
import { fetchSubTree } from '../directory-tree/directoryTreeSlice';
import { setIsShowing, setText } from '../notification/notificationSlice';

export default function CreateItemModal() {
    const dispatch = useDispatch();
    const isOpen = useSelector(state => state.createItemModal.isOpen);
    const currentPath = useSelector(state => state.itemsContainer.currentPath);

    const inputRef = React.useRef();
    const checkboxRef = React.useRef();

    const handleClose = () => {
        dispatch(setIsOpen(false));
    };

    // create file or folder
    const handleCreate = () => {
        const name = inputRef.current.value;
        const isFolder = checkboxRef.current.checked;
        
        dispatch(createItem({path: currentPath, name, isFolder}))
            .then(unwrapResult)
            .then(result => {
                if (result.data.done) {
                    dispatch(fetchSubTree(currentPath.slice(0, currentPath.length - 1)));
                    dispatch(setText("Item created"));
                    dispatch(setIsShowing(true));
                }
            });
    }


    return (
        <Dialog open={isOpen} onClose={handleClose}>
            <DialogTitle>Create</DialogTitle>
            <DialogContent>
                <DialogContentText>
                    Pls, provide the file or folder name you want to create.
                </DialogContentText>
                <FormGroup>
                    <TextField
                        autoFocus
                        margin="dense"
                        id="name"
                        label="File or folder name"
                        type="text"
                        fullWidth
                        variant="standard"
                        inputRef={inputRef}
                    />
                </FormGroup>
                <FormGroup>
                    <FormControlLabel control={<Checkbox inputRef={checkboxRef} />} label="Folder" />
                </FormGroup>
            </DialogContent>
            <DialogActions>
                <Button onClick={handleClose}>Cancel</Button>
                <Button onClick={handleCreate}>Create</Button>
            </DialogActions>
        </Dialog>
    );
}
