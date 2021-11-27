import * as React from "react";
import {Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Typography} from "@mui/material";
import {File} from "../types/File";
import {Mutation} from "../types/Mutation";
import {Project} from "../types/Project";
import {Job} from "../types/Job";

type FileState = {
    file: File
    project: Project
    job: Job
}


class FilePage extends React.Component<any, FileState> {

    constructor(props:any) {
        super(props);
        this.state = {
            file: null,
            project: null,
            job: null
        }
    }

    componentDidMount() {
        fetch(`/api/v1/files/${this.props.match.params.fileId}/`)
            .then(res => res.json())
            .then(res => this.setState({
                file: res
            }))
        fetch(`/api/v1/projects/${this.props.match.params.projectId}/`)
            .then(res => res.json())
            .then(res => this.setState({
                project: res
            }))
        fetch(`/api/v1/jobs/${this.props.match.params.jobId}/`)
            .then(res => res.json())
            .then(res => this.setState({
                job: res
            }))
    }


    render = () =>
        <>
            <Typography>Recent builds</Typography>
            <TableContainer component={Paper}>
                <Table>
                    <TableHead>
                        <TableRow>
                            <TableCell>ID</TableCell>
                            <TableCell>Description</TableCell>
                            <TableCell>Sourcecode</TableCell>
                            <TableCell>Lines</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {this.state.file != null ?this.state.file.mutations.map((mutation: Mutation) =>
                            <TableRow key={mutation.id}>
                                <TableCell>{mutation.id}</TableCell>
                                <TableCell>{mutation.description}</TableCell>
                                <TableCell>{mutation.mutated_source_code}</TableCell>
                                <TableCell>{mutation.start_line} - {mutation.end_line}</TableCell>
                            </TableRow>
                        ) : <></>}
                    </TableBody>
                </Table>
            </TableContainer>
        </>
    ;
}

export default FilePage;
