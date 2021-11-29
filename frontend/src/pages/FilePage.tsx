import * as React from "react";
import {
    Box,
    Grid,
    Paper,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    Typography
} from "@mui/material";
import {File} from "../types/File";
import {Mutation} from "../types/Mutation";
import {Project} from "../types/Project";
import {Job} from "../types/Job";
import CodeEditor from "../components/CodeEditor";

type FileState = {
    file: File
    project: Project
    job: Job
}


class FilePage extends React.Component<any, FileState> {

    constructor(props: any) {
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
            <Typography>File: {this.state.file ? this.state.file.path : <></>}</Typography>
            <Box>
            </Box>
            <Grid container spacing={2}>
                <Grid item xs={6}>
                    {this.state.file ? <CodeEditor file={this.state.file}></CodeEditor> : <></>}
                </Grid>
                <Grid item xs={6}>

                </Grid>
            </Grid>
        </>
    ;
}

export default FilePage;
0