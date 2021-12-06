import * as React from "react";
import {
    Box, Button,
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
import {useEffect, useState} from "react";
import {useParams} from "react-router-dom";
import {RouteParams} from "../components/Routes";

type FileState = {
    file: File
    project: Project
    job: Job
    selected_line_mutations: Mutation[]
    current_mutation: Mutation
}

const FilePage = () => {

    const [filepageState, setFilepageState] = useState<FileState>({
            file: null,
            project: null,
            job: null,
            current_mutation: null,
            selected_line_mutations: []
        });

    let { fileId, projectId, jobId } = useParams();

    const handleMutationSelection = (mutation: Mutation) => {
        setFilepageState({...filepageState, current_mutation: mutation});
    }

    const handleLineSelection = (mutations: Mutation[]) => {
        setFilepageState({...filepageState, current_mutation: null});
        setFilepageState({...filepageState, selected_line_mutations: mutations});
    }


    useEffect(() => {
        fetch(`/api/v1/files/${fileId}/`)
            .then(res => res.json())
            .then(res => setFilepageState({...filepageState,
                file: res
            }))
        fetch(`/api/v1/projects/${projectId}/`)
            .then(res => res.json())
            .then(res => setFilepageState({...filepageState,
                project: res
            }))
        fetch(`/api/v1/jobs/${jobId}/`)
            .then(res => res.json())
            .then(res => setFilepageState({...filepageState,
                job: res
            }))
    }, []);

    const closeLine = () => {
        setFilepageState({...filepageState,
            current_mutation: null
        });
    }

    const closeDiff = () => {
        setFilepageState({...filepageState,
            selected_line_mutations : []
        })
    }

    return(
        <>
            <Typography>File: {filepageState.file ? filepageState.file.path : <></>}</Typography>
            <Box>
            </Box>
            <Grid container spacing={2}>
                <Grid item xs={6}>
                    {filepageState.file ? <CodeEditor
                        file={filepageState.file}
                        onLineSelected={handleLineSelection}
                    /> : <></>}
                </Grid>
                <Grid item xs={6}>
                    {filepageState.current_mutation ?
                        <>
                            <Button
                                variant={"contained"}
                                onClick={() => closeLine()}
                            >Back</Button>
                            <CodeDiffEditor
                                original={filepageState.file.source_code}
                                mutated={filepageState.current_mutation.source_code}
                                mutation={filepageState.current_mutation}
                            />
                            <MutationsView
                                mutations={[filepageState.current_mutation]}
                                onMutationSelected={handleMutationSelection}
                            />
                        </>
                        :
                        filepageState.selected_line_mutations.length > 0 ?
                            <>
                                <Button
                                    variant={"contained"}
                                    onClick={() => closeDiff()}
                                >Back</Button>
                                <MutationsView
                                    mutations={filepageState.selected_line_mutations}
                                    onMutationSelected={handleMutationSelection}
                                />
                            </>
                            :
                            <></>
                    }
                </Grid>
            </Grid>
        </>);
}

export default FilePage;
