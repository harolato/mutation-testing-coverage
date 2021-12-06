import * as React from "react";
import {Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Typography} from "@mui/material";
import {Link, useParams} from "react-router-dom";
import {Project} from "../types/Project";
import {Job} from "../types/Job";
import {useEffect, useState} from "react";
import {RouteParams} from "../components/Routes";

type ProjectState = {
    project: Project
}

const ProjectPage = () => {


    let initialState:ProjectState = {
            project: null
        };
    const [state, setState] = useState<ProjectState>(initialState);
    let {projectId} = useParams()


    useEffect(() => {
        fetch(`/api/v1/projects/${projectId}/`)
            .then(res => res.json())
            .then(res => setState({
                project: res
            }))
    }, [])


    return(
        <>
            <Typography>Recent builds</Typography>
            <TableContainer component={Paper}>
                <Table>
                    <TableHead>
                        <TableRow>
                            <TableCell>ID</TableCell>
                            <TableCell>Hash</TableCell>
                            <TableCell>Build Via</TableCell>
                            <TableCell>Time</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {state.project != null ?state.project.jobs.map((job: Job) =>
                            <TableRow key={job.id}>
                                <TableCell>{job.id}</TableCell>
                                <TableCell>
                                    <Link to={`/projects/${job.project}/jobs/${job.id}`}>
                                        {job.git_commit_sha}
                                    </Link>
                                </TableCell>
                                <TableCell>{job.service_name}</TableCell>
                                <TableCell>{job.created_at}</TableCell>
                            </TableRow>
                        ) : <></>}
                    </TableBody>
                </Table>
            </TableContainer>
        </>
    );
}

export default ProjectPage;
