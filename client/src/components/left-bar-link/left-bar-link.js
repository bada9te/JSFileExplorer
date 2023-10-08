import { ListItem, ListItemButton, ListItemIcon, ListItemText } from "@mui/material";


const LeftBarLink = props => {
    const {icon, text} = props;

    return (
        <ListItem key={text} disablePadding>
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