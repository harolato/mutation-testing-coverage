import * as React from "react";
import {
    Box,
    Grid,
    Typography
} from "@mui/material";
import {File} from "../types/File";
import {Mutation} from "../types/Mutation";
import {Project} from "../types/Project";
import {Job} from "../types/Job";
import CodeEditor from "../components/CodeEditor";
import CodeDiffEditor from "../components/CodeDiffEditor";
import MutationsView from "../components/MutationsView";

type FileState = {
    file: File
    project: Project
    job: Job
    selected_line_mutations: Mutation[]
    current_mutation: Mutation
}


class FilePage extends React.Component<any, FileState> {

    constructor(props: any) {
        super(props);
        this.state = {
            file: null,
            project: null,
            job: null,
            current_mutation: null,
            selected_line_mutations: []
        }
        this.handleLineSelection = this.handleLineSelection.bind(this)
        this.handleMutationSelection = this.handleMutationSelection.bind(this)
    }

    handleMutationSelection(mutation: Mutation) {
        this.setState({current_mutation: mutation})
    }

    handleLineSelection(mutations: Mutation[]) {
        this.setState({current_mutation: null})
        this.setState({selected_line_mutations: mutations})
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
                    {this.state.file ? <CodeEditor
                        file={this.state.file}
                        onLineSelected={this.handleLineSelection}
                    /> : <></>}
                </Grid>
                <Grid item xs={6}>
                    {this.state.current_mutation ?
                        <>
                            <CodeDiffEditor
                                original={this.state.file.source_code}
                                mutated={this.state.current_mutation.source_code}
                                mutation={this.state.current_mutation}
                            />
                            <MutationsView
                                mutations={[this.state.current_mutation]}
                                onMutationSelected={this.handleMutationSelection}
                            />
                        </>
                        :
                        this.state.selected_line_mutations.length > 0 ?
                            <MutationsView
                                mutations={this.state.selected_line_mutations}
                                onMutationSelected={this.handleMutationSelection}
                            />
                            :
                            <></>
                    }
                </Grid>
            </Grid>
        </>
    ;
}

export default FilePage;
0