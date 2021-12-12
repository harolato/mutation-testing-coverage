import React from "react";
import {useEffect, useState} from "react";
import {Box, Grid, Typography} from "@mui/material";
import {MutantStatusType, Mutation} from "../types/Mutation";
import CodeEditor from "../components/CodeEditor";
import MutationsView from "../components/MutationsView";
import {Outlet, useNavigate, useParams} from "react-router-dom";
import {first} from "lodash/fp";
import {useGlobalState} from "../providers/GlobalStateProvider";


const FilePage = () => {

    const [state, dispatch] = useGlobalState();
    let {fileId, projectId, jobId, mutantId} = useParams();
    const navigate = useNavigate();
    const [pageDataLoaded, setPageDataLoaded] = useState(false);

    let getFirstSurvived = (mutants: Mutation[]) => {
        return first(mutants.filter((mut: Mutation) => {
            return mut.result !== 'K'
        }))
    }

    let redirectToFirstMutant = (mutants: Mutation[]) => {
        let first_ = getFirstSurvived(mutants);
        if (first_) {
            navigate(`mutant/${first_.id}/`);
        }
    }

    const handleLineSelection = (mutations: Mutation[]) => {
        if (mutations.length <= 0) return;

        dispatch({
            ...state,
            selected_line_mutations: mutations,
        });
        redirectToFirstMutant(mutations);
    }

    let filterMutants: (mutants: Mutation[]) => Mutation[] = (mutants: Mutation[]) => {
        if (!state.layout.show_killed_mutants) {
            mutants = mutants.filter(mutant => mutant.result !== 'K');
            mutants = mutants.filter(mutant => mutant.status !== MutantStatusType.Ignore)
        }

        return mutants.sort((a: Mutation, b: Mutation) => {
            return a.start_line < b.start_line ? -1 : 1; // Sort Low -> High
        });
    }

    let loadData = () => {
        Promise.all([
            fetch(`/api/v1/projects/${projectId}/`),
            fetch(`/api/v1/files/${fileId}/`),
            fetch(`/api/v1/jobs/${jobId}/`)
        ])
            .then(([r1, r2, r3]) => Promise.all([r1.json(), r2.json(), r3.json()]))
            .then(([project, file, job]) => {
                    dispatch({
                        ...state,
                        project: project,
                        file: file,
                        job: job,
                        mutants: filterMutants(file.mutations),
                    });
                    setPageDataLoaded(true);
                }
            );
    }

    useEffect(() => {
        loadData();
    }, []);

    useEffect(() => {
        if (pageDataLoaded) {
            let filtered_mutants = filterMutants(state.file.mutations);
            let found_mutant: Mutation = first(state.mutants.filter(mutant => mutant.id == mutantId));
            if (!found_mutant) {
                if (state.mutants.length > 0) {
                    navigate(`/projects/${projectId}/jobs/${jobId}/files/${fileId}/mutant/${first(state.mutants).id}/`);
                } else {
                    navigate(`/projects/${projectId}/jobs/${jobId}/files/${fileId}/`);
                }
            }
            dispatch({
                ...state,
                mutants: filtered_mutants,
                mutant: found_mutant
            });

            if (!mutantId) {
                redirectToFirstMutant(filtered_mutants);
            }
        }
    }, [state.layout.show_killed_mutants, mutantId, state.selected_line_mutations, pageDataLoaded, state.file]);

    if (state.file == null) {
        return null;
    }

    return (
        <>
            <Typography>File {state.project.id}: {state.file ? state.file.path : <></>}</Typography>
            <Box>
            </Box>
            <Grid container spacing={2}>
                <Grid item xs={6}>
                    {state.file ?
                        <CodeEditor
                            file={state.file}
                            mutants={state.mutants}
                            onLineSelected={handleLineSelection}
                            currently_viewing_mutant={state.mutant}
                        />
                        :
                        <></>}
                </Grid>
                <Grid item xs={6}>
                    <Outlet/>
                    <MutationsView mutants={state.mutants} selected={state.selected_line_mutations}/>
                </Grid>
            </Grid>

        </>);
}

export default FilePage;
