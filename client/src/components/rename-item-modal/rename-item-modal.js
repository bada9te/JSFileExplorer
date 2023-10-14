import * as React from 'react';
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import { useDispatch, useSelector } from 'react-redux';
import { setIsOpen } from './renameItemModalSlice';
import { FormGroup } from '@mui/material';
import { renameItem, resetSelectedItems } from '../items-container/itemsContainerSlice';
import { unwrapResult } from '@reduxjs/toolkit';
import { fetchSubTree } from '../directory-tree/directoryTreeSlice';
import { setIsShowing, setText } from '../notification/notificationSlice';


export default function RenameItemModal() {
    const dispatch = useDispatch();
    const isOpen = useSelector(state => state.renameItemModal.isOpen);
    const currentPath = useSelector(state => state.itemsContainer.currentPath);
    const selectedItemToRenamePath = useSelector(state => state.itemsContainer.selectedItemToRenamePath);

    const inputRef = React.useRef();

    const handleClose = () => {
        dispatch(setIsOpen(false));
    };

    // create file or folder
    const handleRename = () => {
        const name = inputRef.current.value;
        
        dispatch(renameItem({
            source: selectedItemToRenamePath, 
            destination: `${selectedItemToRenamePath.slice(0, selectedItemToRenamePath.lastIndexOf('\\'))}\\${name}`,
        }))
            .then(unwrapResult)
            .then(result => {
                if (result.data.done) {
                    dispatch(fetchSubTree(currentPath.slice(0, currentPath.length - 1)));
                    dispatch(setText("Item renamed"));
                    dispatch(setIsShowing(true));
                }
            });
        dispatch(resetSelectedItems());
        
    }


    return (
        <Dialog open={isOpen} onClose={handleClose}>
            <DialogTitle>Rename</DialogTitle>
            <DialogContent>
                <DialogContentText>
                    Pls, provide new file or folder name you want to apply.
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
            </DialogContent>
            <DialogActions>
                <Button onClick={handleClose}>Cancel</Button>
                <Button onClick={handleRename}>Rename</Button>
            </DialogActions>
        </Dialog>
    );
}
