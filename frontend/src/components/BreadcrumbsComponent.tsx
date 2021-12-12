import React, {useState} from "react";
import {Link, NavLink, useMatch, useParams, useResolvedPath} from "react-router-dom";
import {Breadcrumbs, Typography} from "@mui/material";
import {useGlobalState} from "../providers/GlobalStateProvider";


const BreadcrumbLink = (props: { to: string, children: any, active?: boolean }) => {
    return (
        <>
            {
                (window.location.pathname == props.to) || props.active ?
                    (<Typography color="text.primary">{props.children}</Typography>) :
                    (<Link to={props.to}>{props.children}</Link>)
            }
        </>)
        ;
}


const BreadcrumbsComponent = () => {
    let {fileId, projectId, jobId, mutantId} = useParams();
    const [state, dispatch] = useGlobalState();


    return (
        <Breadcrumbs sx={{mb: 3}} aria-label="breadcrumb">
            <BreadcrumbLink to={"/"}>
                Home
            </BreadcrumbLink>
            {
                window.location.pathname.indexOf("/settings/") == 0 ? (
                    <BreadcrumbLink to={"/settings/"}>
                        Settings
                    </BreadcrumbLink>
                ) : null
            }
            {
                window.location.pathname.indexOf("/projects/") == 0 ? (
                    <BreadcrumbLink to={"/projects/"}>
                        Projects
                    </BreadcrumbLink>
                ) : null
            }

            {
                projectId && state.project ? (
                    <BreadcrumbLink to={`/projects/${projectId}/`}>
                        {state.project.name}
                    </BreadcrumbLink>
                ) : null
            }
            {
                jobId && state.job ? (
                    <BreadcrumbLink to={`/projects/${projectId}/jobs/${jobId}/`}>
                        {state.job.git_commit_sha}
                    </BreadcrumbLink>
                ) : null
            }
            {
                fileId && state.file ? (
                    <BreadcrumbLink active={!(!(mutantId))}
                                    to={`/projects/${projectId}/jobs/${jobId}/files/${fileId}/`}>
                        {state.file.path}
                    </BreadcrumbLink>
                ) : null
            }
            {
                mutantId && state.mutant ? (
                    <BreadcrumbLink to={`/projects/${projectId}/jobs/${jobId}/files/${fileId}/mutant/${mutantId}/`}>
                        Viewing Mutant
                    </BreadcrumbLink>
                ) : null
            }
        </Breadcrumbs>
    );
}
export default BreadcrumbsComponent