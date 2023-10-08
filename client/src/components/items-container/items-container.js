import { Stack } from "@mui/material";
import FileItem from "../file-item/file-item";

const ItemsContainer = props => {
    return (
        <Stack spacing={2} sx={{display: 'flex', justifyContent: {xs: 'space-around', sm: 'flex-start'}, alignItems: 'center'}} direction="row" useFlexGap flexWrap="wrap">
            <FileItem name="testFolder1" ext="directory"/>
            <FileItem name="testFolder2" ext="directory"/>
            <FileItem name="testFolder3" ext="directory"/>
            <FileItem name="a" ext="txt"/>
            <FileItem name="b" ext="xls"/>
            <FileItem name="c" ext="psd"/>
            <FileItem name="a" ext="txt"/>
            <FileItem name="b" ext="xls"/>
            <FileItem name="c" ext="psd"/>
            <FileItem name="a" ext="pdf"/>
            <FileItem name="b" ext="xls"/>
        </Stack>
    );
}

export default ItemsContainer;