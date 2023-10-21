import { Box, Button, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle, FormGroup, Stack, TextField } from "@mui/material";
import { useDispatch, useSelector } from "react-redux";
import { setIsOpen } from "./itemInfoModalSlice";


const toNormalDate = (dtStr) => {
    const dt = new Date(dtStr);
    let day = dt.getDay();
    let month = dt.getMonth();
    let year = dt.getFullYear();

    let hours = dt.getHours();
    let minutes = dt.getMinutes();
    let seconds = dt.getSeconds();

    return `
        ${day < 10 ? '0' + day : day}/${month < 10 ? '0' + month : month}/${year} 
        ${hours < 10 ? '0' + hours : hours}:${minutes < 10 ? '0' + minutes : minutes}:${seconds < 10 ? '0' + seconds : seconds}
    `;
}


export default function ItemInfoModal() {
    const dispatch = useDispatch();
    const isOpen = useSelector(state => state.itemInfoModal.isOpen);
    const target = useSelector(state => state.itemInfoModal.target);

    const handleClose = () => {
        dispatch(setIsOpen(false));
    };

    return (
        <Dialog open={isOpen} onClose={handleClose}>
            <DialogTitle>{target.item}</DialogTitle>
            <DialogContent>
                <Stack spacing={2}>
                    <Box>
                        <DialogContentText sx={{fontWeight: 'bold'}}>Type:</DialogContentText>
                        <DialogContentText>
                            {
                                (() => {
                                    if (target.isFile) {
                                        return "File";
                                    } else if (target.isDirectory) {
                                        return "Directory";
                                    } else if (target.isDrive) {
                                        return "Drive";
                                    } else {
                                        return "Unknown";
                                    }
                                })()
                            }
                        </DialogContentText>
                    </Box>

                    <Box>
                        <DialogContentText sx={{fontWeight: 'bold'}}>Created at:</DialogContentText>
                        <DialogContentText>{toNormalDate(target.birthtime)}</DialogContentText>
                    </Box>

                    <Box>
                        <DialogContentText sx={{fontWeight: 'bold'}}>Modified at:</DialogContentText>
                        <DialogContentText>{toNormalDate(target.mtime)}</DialogContentText>
                    </Box>

                    <Box>
                        <DialogContentText sx={{fontWeight: 'bold'}}>Size:</DialogContentText>
                        <DialogContentText>{target.isDirectory || target.isDrive ? "Unknown" : target.size}</DialogContentText>
                    </Box>
                </Stack>
            </DialogContent>
            <DialogActions>
                <Button onClick={handleClose}>Ok</Button>
            </DialogActions>
        </Dialog>
    );
}