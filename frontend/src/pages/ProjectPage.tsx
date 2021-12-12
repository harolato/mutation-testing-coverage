import React from "react";
import {Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Typography} from "@mui/material";
import {Link} from "react-router-dom";
import {Job} from "../types/Job";

import {useGlobalState} from "../providers/GlobalStateProvider";

const ProjectPage = () => {

    const [state, dispatch] = useGlobalState();

    if ( !state.project ) {
        return null;
    }

    return (
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
                        {state.project.jobs.map((job: Job) =>
                            <TableRow key={job.id}>
                                <TableCell>{job.id}</TableCell>
                                <TableCell>
                                    <Link to={`/projects/${job.project}/jobs/${job.id}/`}>
                                        {job.git_commit_sha}
                                    </Link>
                                </TableCell>
                                <TableCell>{job.service_name}</TableCell>
                                <TableCell>{job.created_at}</TableCell>
                            </TableRow>
                        )}
                    </TableBody>
                </Table>
            </TableContainer>
        </>
    );
}

export default ProjectPage;
