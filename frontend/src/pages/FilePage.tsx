import React from "react";
import {useEffect, useState} from "react";
import {Grid} from "@mui/material";
import {MutantStatusType, Mutation} from "../types/Mutation";
import CodeEditor from "../components/CodeEditor";
import MutationsView from "../components/MutationsView";
import {Outlet, useNavigate, useParams} from "react-router-dom";
import {first} from "lodash/fp";
import {useGlobalState} from "../providers/GlobalStateProvider";
import {useLoading} from "../providers/LoadingStateProvider";
import {GlobalStateType} from "../types/GlobalStateType";


const FilePage = () => {

    const [state, dispatch] = useGlobalState();
    const {loading, setLoading} = useLoading();
    let {fileId, projectId, jobId, mutantId} = useParams();
    const navigate = useNavigate();

    let getFirstSurvived = (mutants: Mutation[]) => {
        return first(mutants.filter((mut: Mutation) => {
            return mut.result !== 'K'
        }))
    }

    let redirectToFirstMutant = (mutants: Mutation[]) => {
        let first_ = getFirstSurvived(mutants);
        if (first_) {
            dispatch({
                ...state,
                mutant: first_
            });
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

    useEffect(() => {
        if (state.file) {
            let filtered_mutants = filterMutants(state.file.mutations);
            let found_mutant: Mutation = first(filtered_mutants.filter(mutant => mutant.id == mutantId));
            dispatch((prevState: GlobalStateType) => {
                return {
                    ...prevState,
                    mutants: filtered_mutants,
                    mutant: found_mutant
                };
            });

            if (!found_mutant) {
                if (state.mutants.length > 0) {
                    redirectToFirstMutant(filtered_mutants);
                } else {
                    navigate(`/projects/${projectId}/jobs/${jobId}/files/${fileId}/`);
                }
            }
            if (!mutantId || !state.mutant) {
                redirectToFirstMutant(filtered_mutants);
            }
        }
    }, [state.layout.show_killed_mutants, mutantId, state.selected_line_mutations, loading, state.file]);

    if (state.file == null) {
        return null;
    }

    return (
        <Grid container spacing={2}>
            <Grid item xs={6}>
                <CodeEditor
                    file={state.file}
                    mutants={state.mutants}
                    onLineSelected={handleLineSelection}
                    currently_viewing_mutant={state.mutant}
                />
            </Grid>
            <Grid item xs={6}>
                <Outlet/>
                <MutationsView mutants={state.mutants} selected={state.selected_line_mutations}/>
            </Grid>
        </Grid>
    );
}

export default FilePage;
