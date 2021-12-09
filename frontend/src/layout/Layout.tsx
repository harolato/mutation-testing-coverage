import * as React from "react";
import {AppBar, Box, Drawer, FormControlLabel, FormGroup, Grid, Switch, Toolbar, Typography} from "@mui/material";
import SideMenu from "./SideMenu";
import PageRoutes from "../components/Routes";
import {useGlobalState} from "../providers/GlobalStateProvider";
import NotificationToast from "../components/NotificationToast";

const drawerWidth = 240;

const Layout = () => {
    const [state, dispatch] = useGlobalState()
    const changeShowMutants = () => {
        dispatch({
            layout: {
                show_killed_mutants: !state.layout.show_killed_mutants
            }
        });
    }

    return (
        <>
            <Box sx={{display: 'flex'}}>
                <AppBar position={"fixed"} sx={{zIndex: (theme) => theme.zIndex.drawer + 1}}>
                    <Toolbar>
                        <Grid md={10} item>
                            <Typography
                                variant={"h6"}
                                noWrap
                                component={"div"}
                                sx={{
                                    mr: 2,
                                }}
                            >
                                Mutation Testing & Test Amplification Tool
                            </Typography>
                        </Grid>

                        <Grid
                            item
                            md={2}
                        >
                            <FormGroup>
                                <FormControlLabel
                                    control={<Switch
                                    color="warning"
                                    checked={state.layout.show_killed_mutants}
                                    onChange={() => changeShowMutants()}
                                    />} label="Show Killed mutants"/>
                            </FormGroup>
                        </Grid>
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
            <NotificationToast/>
        </>);
}
export default Layout
