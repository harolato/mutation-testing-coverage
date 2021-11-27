import * as React from "react";
import {AppBar, Box, Drawer, Toolbar} from "@mui/material";
import SideMenu from "./SideMenu";
import PageRoutes from "../components/Routes";

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
                    <SideMenu/>
                </Drawer>
                <Box
                    component={"main"}
                    sx={{flexGrow: 1, p: 3}}
                >
                    <Toolbar/>
                    <PageRoutes/>
                </Box>
            </Box>
        </>
    ;
}