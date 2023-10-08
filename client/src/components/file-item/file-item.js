import { Box, Typography } from "@mui/material";
import { FileIcon, defaultStyles } from 'react-file-icon';
import folderImage from "../../images/folder.png";

const FileItem = props => {
    const {name, ext} = props;


    return (
        <Box sx={{width: '100px', display: 'flex', flexWrap: 'wrap', justifyContent: 'center'}}>
            {
                ext === "directory"
                ?
                <>
                    <img src={folderImage} style={{objectFit: 'contain', width: '100px'}} alt="folder"/>
                    <Typography sx={{mt: 1}}>{`${name}`}</Typography>
                </>
                :
                <>
                    <FileIcon extension={ext} {...defaultStyles[ext]} />
                    <Typography sx={{mt: 1}}>{`${name}.${ext}`}</Typography>
                </>
            }
            
        </Box>
    );
}

export default FileItem;