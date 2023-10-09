import { Button, Tooltip, Typography } from "@mui/material";
import { FileIcon, defaultStyles } from 'react-file-icon';
import folderImage from "../../images/folder.png";
import driveImage from "../../images/drive.png";
import { useDispatch } from "react-redux";
import { forwardPath } from "../items-container/itemsContainerSlice";

const FileItem = props => {
    const {name, ext} = props;
    const dispatch = useDispatch();

    const onClickHandler = () => {
        console.log(ext)
        if (["drive", "directory"].includes(ext)) {
            dispatch(forwardPath(name))
        }
    }

    return (
        <Tooltip title={name}>
            <Button sx={{width: '100px', display: 'flex', flexWrap: 'wrap', justifyContent: 'center', cursor: 'pointer'}} onClick={onClickHandler}>
                {
                    (() => {
                        if (ext === "directory") {
                            return (
                                <>
                                    <img src={folderImage} style={{objectFit: 'contain', width: '100px'}} alt="folder"/>
                                    <Typography sx={{ mt: 1, textTransform: 'capitalize'}} noWrap variant="body2">{`${name}`}</Typography>
                                </>
                            );
                        } else if (ext === "drive") {
                            return (
                                <>
                                    <img src={driveImage} style={{objectFit: 'contain', width: '100px'}} alt="drive"/>
                                    <Typography sx={{mt: 1, textTransform: 'capitalize'}} noWrap variant="body2">{`${name}`}</Typography>
                                </>
                            );
                        } else {
                            return (
                                <>
                                    <FileIcon extension={ext} {...defaultStyles[ext]} />
                                    <Typography sx={{mt: 1, textTransform: 'capitalize'}} noWrap variant="body2">{`${name}.${ext}`}</Typography>
                                </>
                            );
                        }
                    })()
                }
    
            </Button>
        </Tooltip>
    );
}

export default FileItem;