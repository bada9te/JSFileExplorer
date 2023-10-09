import { Stack } from "@mui/material";
import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import FileItem from "../file-item/file-item";
import { fetchDrives, navigateFS } from "./itemsContainerSlice";

const ItemsContainer = props => {
    const dispatch = useDispatch();
    const items = useSelector(state => state.itemsContainer.items);
    const currentPath = useSelector(state => state.itemsContainer.currentPath);

    useEffect(() => {
        dispatch(fetchDrives());
    }, []);

    useEffect(() => {
        if (currentPath !== "") {
            dispatch(navigateFS());
        }
    }, [currentPath]);

    return (
        <Stack spacing={2} sx={{mb: 10, display: 'flex', justifyContent: {xs: 'space-around', sm: 'flex-start'}, alignItems: 'start'}} direction="row" useFlexGap flexWrap="wrap">
            {
                items.map((item, i) => {
                    return (<FileItem key={i} name={item.name} ext={item.type}/>);
                })
            }
        </Stack>
    );
}

export default ItemsContainer;