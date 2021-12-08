import * as React from "react";
import {
    Box, Button, ButtonGroup,
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
import ReactionComponent from "../components/ReactionComponent";
import * as _ from "lodash";
import {useGlobalState} from "../providers/GlobalStateProvider";

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

    const [state, dispatch] = useGlobalState();

    let {fileId, projectId, jobId} = useParams();

    const handleMutationSelection = (mutation: Mutation) => {
        setFilepageState({...filepageState, current_mutation: mutation});
    }

    const handleLineSelection = (mutations: Mutation[]) => {
        setFilepageState({
            ...filepageState,
            selected_line_mutations: mutations,
            current_mutation: null
        });
    }

    useEffect(() => {
        fetch(`/api/v1/files/${fileId}/`)
            .then(res => res.json())
            .then(res => {
                const first_survived: Mutation = _.first(res.mutations.filter((mut: Mutation) => {
                    return mut.result === 'S'
                }))
                setFilepageState({
                    ...filepageState,
                    file: res,
                    current_mutation: first_survived
                });
            })
        fetch(`/api/v1/projects/${projectId}/`)
            .then(res => res.json())
            .then(res => setFilepageState({
                ...filepageState,
                project: res
            }))
        fetch(`/api/v1/jobs/${jobId}/`)
            .then(res => res.json())
            .then(res => setFilepageState({
                ...filepageState,
                job: res
            }))
    }, []);

    const closeLine = () => {
        setFilepageState({
            ...filepageState,
            current_mutation: null
        });
    }

    const closeDiff = () => {
        setFilepageState({
            ...filepageState,
            selected_line_mutations: []
        })
    }

    const getMutants = () => {
        return filepageState.file.mutations.filter((mutant) => {
            return (state.layout.show_killed_mutants) ? true : mutant.result !== 'K'
        });
    }

    const getCurrentMutantIndex = () => {
        return getMutants().findIndex((mutant, a, i) => {
            return mutant.id == filepageState.current_mutation.id;
        })
    }

    const previousMutant = () => {
        let previous = getCurrentMutantIndex() - 1;
        if (previous < 0) {
            return false;
        }
        setFilepageState({
            ...filepageState,
            current_mutation: getMutants()[previous]
        });
    }

    const nextMutant = () => {
        let next = getCurrentMutantIndex() + 1;
        if (next > getMutants().length) {
            return false;
        }
        setFilepageState({
            ...filepageState,
            current_mutation: getMutants()[next]
        });
    }

    const hasNext = () => {
        let next = getCurrentMutantIndex() + 1;
        if (next > getMutants().length - 1) {
            return false;
        }
        return true;
    }

    const hasPrevious = () => {
        let next = getCurrentMutantIndex() - 1;
        if (next < 0) {
            return false;
        }
        return true;
    }

    return (
        <>
            <Typography>File: {filepageState.file ? filepageState.file.path : <></>}</Typography>
            <Box>
            </Box>
            <Grid container spacing={2}>
                <Grid item xs={6}>
                    {filepageState.file ?
                        <CodeEditor
                            file={filepageState.file}
                            onLineSelected={handleLineSelection}
                            currently_viewing_mutant={filepageState.current_mutation}
                        />
                        :
                        <></>}
                </Grid>
                <Grid item xs={6}>
                    {filepageState.current_mutation ?
                        <>
                            <CodeDiffEditor
                                original={filepageState.file.source_code}
                                mutated={filepageState.current_mutation.source_code}
                                mutation={filepageState.current_mutation}
                            />
                            <ReactionComponent mutant={filepageState.current_mutation}/>

                            <ButtonGroup variant={"contained"} aria-label="contained primary button group">
                                <Button disabled={!hasPrevious()} onClick={() => previousMutant()}>Previous</Button>
                                <Button disabled={!hasNext()} onClick={() => nextMutant()}>Next</Button>
                            </ButtonGroup>

                            <MutationsView
                                mutations={getMutants()}
                                currently_viewing={filepageState.current_mutation}
                                onMutationSelected={handleMutationSelection}
                            />
                        </>
                        :
                        filepageState.selected_line_mutations.length > 0 ?
                            <>
                                <MutationsView
                                    mutations={filepageState.selected_line_mutations}
                                    currently_viewing={filepageState.current_mutation}
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
