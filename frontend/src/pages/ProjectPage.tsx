import * as React from "react";
import {Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Typography} from "@mui/material";
import {Link} from "react-router-dom";
import {Project} from "../types/Project";
import {Job} from "../types/Job";

type ProjectState = {
    project: Project
}

class ProjectPage extends React.Component<any, ProjectState> {

    constructor(props:any) {
        super(props);
        this.state = {
            project: null
        }
    }

    componentDidMount() {
        fetch(`/api/v1/projects/${this.props.match.params.projectId}/`)
            .then(res => res.json())
            .then(res => this.setState({
                project: res
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
                            <TableCell>Hash</TableCell>
                            <TableCell>Build Via</TableCell>
                            <TableCell>Time</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {this.state.project != null ?this.state.project.job_project.map((job: Job) =>
                            <TableRow key={job.id}>
                                <TableCell>{job.id}</TableCell>
                                <TableCell>
                                    <Link to={`/project/${job.project}/job/${job.id}`}>
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
    ;
}

export default ProjectPage;
