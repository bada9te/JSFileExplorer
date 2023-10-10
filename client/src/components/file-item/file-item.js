import { Button, Tooltip, Typography } from "@mui/material";
import { FileIcon, defaultStyles } from 'react-file-icon';
import folderImage from "../../images/folder.png";
import driveImage from "../../images/drive.png";
import { useDispatch } from "react-redux";
import { forwardPath, setHistory } from "../items-container/itemsContainerSlice";

const FileItem = props => {
    const {meta} = props;
    let extension = meta.item.split('.');
    extension = extension[extension.length - 1];
    const dispatch = useDispatch();

    const onClickHandler = () => {
        if (meta?.isDrive) {
            dispatch(setHistory(["Home"]));
        }
        dispatch(forwardPath(meta.item))
    }

    return (
        <Tooltip title={meta.item}>
            <Button sx={{width: '100px', display: 'flex', flexWrap: 'wrap', justifyContent: 'center', cursor: 'pointer'}} onClick={onClickHandler}>
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
    );
}

export default FileItem;