import { ListItem, ListItemButton, ListItemIcon, ListItemText } from "@mui/material";
import { useDispatch } from "react-redux";
import { fetchDrives, setCurrentPath, setHistory } from "../items-container/itemsContainerSlice";


const LeftBarLink = props => {
    const {icon, text} = props;
    const dispatch = useDispatch();


    const handleClick = () => {
        if (text === "Home") {
            dispatch(fetchDrives());
            dispatch(setCurrentPath(""));
            dispatch(setHistory(["Home"]));
        } else if (text === "Trash") {
            dispatch(setCurrentPath())
        }
    }

    return (
        <ListItem key={text} disablePadding onClick={handleClick}>
            <ListItemButton>
                <ListItemIcon>
                    {icon}
                </ListItemIcon>
                <ListItemText primary={text} />
            </ListItemButton>
        </ListItem>
    );
}

export default LeftBarLink;