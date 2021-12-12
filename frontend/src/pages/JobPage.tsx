import React from "react";
import {Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Typography} from "@mui/material";
import {Link, useParams} from "react-router-dom";
import {Job} from "../types/Job";
import {File} from "../types/File";
import {useEffect, useState} from "react";
import {RouteParams} from "../components/Routes";

type JobState = {
    job: Job
}


const JobPage = () => {

    let initialState: JobState = {
        job: null
    }

    const [state, setJob] = useState(initialState);
    let {jobId, projectId} = useParams()

    useEffect(() => {
        fetch(`/api/v1/jobs/${jobId}/`)
            .then(res => res.json())
            .then(res => setJob({
                job: res
            }))
    }, []);


    return (
        <>
            <Typography>Build Files</Typography>
            <TableContainer component={Paper}>
                <Table>
                    <TableHead>
                        <TableRow>
                            <TableCell>ID</TableCell>
                            <TableCell>Path</TableCell>
                            <TableCell>Mutations</TableCell>
                            <TableCell>Time</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {state.job != null ? state.job.files.map((file: File) =>
                            <TableRow key={file.id}>
                                <TableCell>{file.id}</TableCell>
                                <TableCell>
                                    <Link
                                        to={`/projects/${projectId}/jobs/${file.job}/files/${file.id}/`}>
                                        {file.path}
                                    </Link>
                                </TableCell>
                                <TableCell>{file.total_mutations}</TableCell>
                                <TableCell>{file.created_at}</TableCell>
                            </TableRow>
                        ) : <></>}
                    </TableBody>
                </Table>
            </TableContainer>
        </>);
}

export default JobPage;
