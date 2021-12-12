import React from "react";
import {Outlet} from "react-router-dom";
import BreadcrumbsComponent from "../components/BreadcrumbsComponent";
import {LinearProgress} from "@mui/material";
import {useLoading} from "../providers/LoadingStateProvider";
import LoadDataComponent from "../components/LoadDataComponent";

const HomePage = () => {
    const {loading, setLoading} = useLoading();
    return (<>
        <LoadDataComponent/>
        <BreadcrumbsComponent/>
        {loading ? (<LinearProgress/>) : null}
        <Outlet/>
    </>);
}
export default HomePage