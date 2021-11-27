import * as React from "react";
import {Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Typography} from "@mui/material";
import {Link} from "react-router-dom";
import {Job} from "../types/Job";
import {File} from "../types/File";

type JobState = {
    job: Job
}


class JobPage extends React.Component<any, JobState> {

    constructor(props:any) {
        super(props);
        this.state = {
            job: null
        }
    }

    componentDidMount() {
        fetch(`/api/v1/jobs/${this.props.match.params.jobId}/`)
            .then(res => res.json())
            .then(res => this.setState({
                job: res
            }))
    }


    render = () =>
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
                        {this.state.job != null ?this.state.job.files.map((file: File) =>
                            <TableRow key={file.id}>
                                <TableCell>{file.id}</TableCell>
                                <TableCell>
                                    <Link to={`/project/${this.props.match.params.projectId}/job/${file.job}/file/${file.id}`}>
                                        {file.path}
                                    </Link>
                                </TableCell>
                                <TableCell>{file.mutations.length}</TableCell>
                                <TableCell>{file.created_at}</TableCell>
                            </TableRow>
                        ) : <></>}
                    </TableBody>
                </Table>
            </TableContainer>
        </>
    ;
}

export default JobPage;
