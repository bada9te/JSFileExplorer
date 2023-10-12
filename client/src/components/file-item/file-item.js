import { Button, Menu, MenuItem, Tooltip, Typography } from "@mui/material";
import { FileIcon, defaultStyles } from 'react-file-icon';
import folderImage from "../../images/folder.png";
import driveImage from "../../images/drive.png";
import { useDispatch, useSelector } from "react-redux";
import { forwardPath, setHistory } from "../items-container/itemsContainerSlice";
import { useState } from "react";
import { DeleteOutline, DriveFileMoveOutlined, DriveFileRenameOutline } from '@mui/icons-material';
import { setBackwardAllowed, setForwardAllowed } from "../control-btns/controlBtnsSlice";

const FileItem = props => {
    const {meta, path} = props;

    let extension = meta.item.split('.');
    extension = extension[extension.length - 1];
    const dispatch = useDispatch();

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
        dispatch(forwardPath(meta.item));
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
            <MenuItem onClick={handleClose} disabled={meta?.isDrive}><DeleteOutline sx={{mr: 1}}/>Delete</MenuItem>
            <MenuItem onClick={handleClose} disabled={meta?.isDrive}><DriveFileRenameOutline sx={{mr: 1}}/>Rename</MenuItem>
            <MenuItem onClick={handleClose} disabled={meta?.isDrive}><DriveFileMoveOutlined sx={{mr: 1}}/>Move</MenuItem>
            { meta?.isDrive && <MenuItem onClick={handleClose}>File operations are not available on drives!</MenuItem> }
        </Menu>
        </>
    );
}

export default FileItem;