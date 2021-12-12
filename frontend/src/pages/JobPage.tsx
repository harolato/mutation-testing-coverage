import React from "react";
import {Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Typography} from "@mui/material";
import {Link, useParams} from "react-router-dom";
import {File} from "../types/File";
import {useGlobalState} from "../providers/GlobalStateProvider";


const JobPage = () => {

    const [state, dispatch] = useGlobalState();
    let {projectId} = useParams();

    if ( !state.job ) {
        return null;
    }

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
                        {state.job.files.map((file: File) =>
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
                        )}
                    </TableBody>
                </Table>
            </TableContainer>
        </>);
}

export default JobPage;
