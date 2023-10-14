import { Button, Menu, MenuItem, Tooltip, Typography } from "@mui/material";
import { FileIcon, defaultStyles } from 'react-file-icon';
import folderImage from "../../images/folder.png";
import driveImage from "../../images/drive.png";
import { useDispatch, useSelector } from "react-redux";
import { copyItem, deleteItem, forwardPath, resetSelectedItems, setHistory, setSelectedItemPath, setSelectedItemToCopyPath, setSelectedItemToMovePath } from "../items-container/itemsContainerSlice";
import { useState } from "react";
import { ContentCopyOutlined, DeleteOutline, DriveFileMoveOutlined, DriveFileRenameOutline } from '@mui/icons-material';
import { setBackwardAllowed, setForwardAllowed } from "../control-btns/controlBtnsSlice";
import { unwrapResult } from "@reduxjs/toolkit";
import { setIsShowing, setText } from "../notification/notificationSlice";
import { fetchSubTree } from "../directory-tree/directoryTreeSlice";

const FileItem = props => {
    const {meta} = props;

    let extension = meta.item.split('.');
    extension = extension[extension.length - 1];
    const dispatch = useDispatch();
    const currentPath = useSelector(state => state.itemsContainer.currentPath);

    // menu
    const [anchorEl, setAnchorEl] = useState(null);
    const open = Boolean(anchorEl);
    const openMenu = (event) => {
        event.preventDefault();
        setAnchorEl(event.currentTarget);
    };
    const handleClose = () => {
        setAnchorEl(null);
    };

    // file
    const onClickHandler = () => {
        if (meta?.isDrive) {
            dispatch(setForwardAllowed(false));
            dispatch(setBackwardAllowed(false));
            dispatch(setHistory(["Home"]));
        }

        if (!meta?.isFile) {
            dispatch(forwardPath(meta.item));
        }
    }

    // delete handler
    const deleteHandler = async() => {
        dispatch(deleteItem({item: meta.item, isFolder: meta.isDirectory}))
            .then(unwrapResult)
            .then(result => {
                console.log(result)
                if (result.data.done) {
                    dispatch(setText("Item removed"));
                    dispatch(setIsShowing(true));
                    dispatch(fetchSubTree(currentPath.slice(0, currentPath.length - 1)));
                }
            });
        handleClose();
    }
    // copy handler
    const copyHandler = () => {
        dispatch(resetSelectedItems());
        dispatch(setSelectedItemToCopyPath(`${currentPath}\\${meta.item}`));
        handleClose();
    }

    // rename (move) handler
    const moveHandler = () => {
        dispatch(resetSelectedItems());
        dispatch(setSelectedItemToMovePath(`${currentPath}\\${meta.item}`));
        handleClose();
    }



    return (
        <>
        <Tooltip title={meta.item}>
            <Button 
                sx={{
                    width: '100px', 
                    display: 'flex', 
                    flexWrap: 'wrap', 
                    justifyContent: 'center', 
                    cursor: 'pointer'
                }} 
                onClick={onClickHandler}
                onContextMenu={openMenu} 
            >
                {
                    (() => {
                        if (meta?.isDirectory) {
                            return (
                                <>
                                    <img src={folderImage} style={{objectFit: 'contain', width: '100px'}} alt="folder"/>
                                    <Typography sx={{ mt: 1, textTransform: 'capitalize'}} noWrap variant="body2">{`${meta.item}`}</Typography>
                                </>
                            );
                        } else if (meta?.isDrive) {
                            return (
                                <>
                                    <img src={driveImage} style={{objectFit: 'contain', width: '100px'}} alt="drive"/>
                                    <Typography sx={{mt: 1, textTransform: 'capitalize'}} noWrap variant="body2">{`${meta.item}`}</Typography>
                                </>
                            );
                        } else {
                            return (
                                <>
                                    <FileIcon extension={extension} {...defaultStyles[extension]} />
                                    <Typography sx={{mt: 1, textTransform: 'capitalize'}} noWrap variant="body2">{`${meta.item}`}</Typography>
                                </>
                            );
                        }
                    })()
                }
    
            </Button>
        </Tooltip>
        <Menu
            sx={{zIndex: 9999}}
            id="basic-menu"
            anchorEl={anchorEl}
            open={open}
            onClose={handleClose}
            MenuListProps={{
                'aria-labelledby': 'basic-button',
            }}
        >
            <MenuItem onClick={deleteHandler} disabled={meta?.isDrive}><DeleteOutline sx={{mr: 1}}/>Delete</MenuItem>
            <MenuItem onClick={() => {}} disabled={meta?.isDrive}><DriveFileRenameOutline sx={{mr: 1}}/>Rename</MenuItem>
            <MenuItem onClick={moveHandler} disabled={meta?.isDrive}><DriveFileMoveOutlined sx={{mr: 1}}/>Move</MenuItem>
            <MenuItem onClick={copyHandler} disabled={meta?.isDrive}><ContentCopyOutlined sx={{mr: 1}}/>Copy</MenuItem>
            { meta?.isDrive && <MenuItem onClick={handleClose}>File operations are not available on drives!</MenuItem> }
        </Menu>
        </>
    );
}

export default FileItem;