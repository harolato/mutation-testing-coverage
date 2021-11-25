import * as React from "react";
import {AppBar, Box, Drawer, ListItemButton, Toolbar} from "@mui/material";
import List from '@mui/material/List';
import Divider from '@mui/material/Divider';
import ListItem from '@mui/material/ListItem';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import {FileOpen, Home, Logout, Settings} from "@mui/icons-material";

const drawerWidth = 240;

export default class Layout extends React.Component<any, any> {

    constructor(props: any) {
        super(props);
    }

    render = () =>
        <>
            <Box sx={{display: 'flex'}}>
                <AppBar position={"fixed"} sx={{zIndex: (theme) => theme.zIndex.drawer + 1}}>
                    <Toolbar>
                        Mutation Testing Coverage Visualisation Tool
                    </Toolbar>
                </AppBar>
                <Drawer
                    variant={"permanent"}
                    sx={{
                        width: drawerWidth,
                        flexShrink: 0,
                        [`& .MuiDrawer-paper`]: {width: drawerWidth, boxSizing: 'border-box'},
                    }}
                >
                    <Toolbar/>
                    <Box sx={{overflow: 'auto'}}>
                        <List>
                            <ListItem>
                                <ListItemButton component={"a"} href={"#"}>
                                    <ListItemIcon>
                                        <Home/>
                                    </ListItemIcon>
                                    <ListItemText primary="Home"/>
                                </ListItemButton>
                            </ListItem>
                            <ListItem>
                                <ListItemButton component={"a"} href={"#"}>
                                    <ListItemIcon>
                                        <FileOpen/>
                                    </ListItemIcon>
                                    <ListItemText primary="Projects"/>
                                </ListItemButton>
                            </ListItem>
                            <ListItem>
                                <ListItemButton component={"a"} href={"#"}>
                                    <ListItemIcon>
                                        <Settings/>
                                    </ListItemIcon>
                                    <ListItemText primary="Settings"/>
                                </ListItemButton>
                            </ListItem>
                            <Divider/>
                            <ListItem>
                                <ListItemButton component={"a"} href={"/logout"}>
                                    <ListItemIcon>
                                        <Logout/>
                                    </ListItemIcon>
                                    <ListItemText primary="Log out"/>
                                </ListItemButton>
                            </ListItem>
                        </List>
                    </Box>
                </Drawer>
                <Box
                    component={"main"}
                    sx={{flexGrow: 1, p: 3}}
                >
                    <Toolbar/>
                    {this.props.children}
                </Box>
            </Box>
        </>
    ;
}