import * as React from "react";
import {
    Box,
    List,
    ListItem,
    ListItemButton,
    ListItemText,
} from "@mui/material";
import {FileOpen, Home, Logout, Settings} from "@mui/icons-material";
import {Link} from "react-router-dom";
import ListItemIcon from "@mui/material/ListItemIcon";
import Divider from "@mui/material/Divider";

export default class SideMenu extends React.Component<any, any> {

    constructor(props: any) {
        super(props);
    }


    render = () =>
        <>
            <Box sx={{overflow: 'auto'}}>
                <List>
                    <ListItem>
                        <ListItemButton component={Link} to={"/"}>
                            <ListItemIcon>
                                <Home/>
                            </ListItemIcon>
                            <ListItemText primary="Home"/>
                        </ListItemButton>
                    </ListItem>
                    <ListItem>
                        <ListItemButton component={Link} to={"/projects"}>
                            <ListItemIcon>
                                <FileOpen/>
                            </ListItemIcon>
                            <ListItemText primary="Projects"/>
                        </ListItemButton>
                    </ListItem>
                    <ListItem>
                        <ListItemButton component={Link} to={"/settings"}>
                            <ListItemIcon>
                                <Settings/>
                            </ListItemIcon>
                            <ListItemText primary="Settings"/>
                        </ListItemButton>
                    </ListItem>
                    <Divider/>
                    <ListItem>
                        <ListItemButton component={"a"} href={"/logout/"}>
                            <ListItemIcon>
                                <Logout/>
                            </ListItemIcon>
                            <ListItemText primary="Log out"/>
                        </ListItemButton>
                    </ListItem>
                </List>
            </Box>
        </>
    ;
}