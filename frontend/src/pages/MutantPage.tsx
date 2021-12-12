import React from "react";
import {
    Grid, LinearProgress,
} from "@mui/material";
import {useState} from "react";
import CodeDiffEditor from "../components/CodeDiffEditor";
import ReactionComponent from "../components/ReactionComponent";
import GHCommentIssueComponent from "../components/GHCommentIssueComponent";
import {MutantStatusType, Mutation} from "../types/Mutation";
import {useGlobalState} from "../providers/GlobalStateProvider";
import MutantCoverageComponent from "../components/MutantCoverageComponent";

const MutantPage = () => {
    const [state, dispatch] = useGlobalState();
    const [fixMutant, setFixMutant] = useState<Mutation>(null)
    const [openFix, setOpenFix] = useState<boolean>(false)

    // const getMutants = () => {
    //     return filepageState.file.mutations.filter((mutant) => {
    //         return (state.layout.show_killed_mutants) ? true : mutant.result !== 'K'
    //     });
    // }
    //
    // const getCurrentMutantIndex = () => {
    //     return getMutants().findIndex((mutant, a, i) => {
    //         return mutant.id == filepageState.current_mutation.id;
    //     })
    // }
    //
    // const previousMutant = () => {
    //     let previous = getCurrentMutantIndex() - 1;
    //     if (previous < 0) {
    //         return false;
    //     }
    //     setFilepageState({
    //         ...filepageState,
    //         current_mutation: getMutants()[previous]
    //     });
    // }
    //
    // const nextMutant = () => {
    //     let next = getCurrentMutantIndex() + 1;
    //     if (next > getMutants().length) {
    //         return false;
    //     }
    //     setFilepageState({
    //         ...filepageState,
    //         current_mutation: getMutants()[next]
    //     });
    // }
    //
    // const hasNext = () => {
    //     let next = getCurrentMutantIndex() + 1;
    //     if (next > getMutants().length - 1) {
    //         return false;
    //     }
    //     return true;
    // }
    //
    // const hasPrevious = () => {
    //     let next = getCurrentMutantIndex() - 1;
    //     if (next < 0) {
    //         return false;
    //     }
    //     return true;
    // }

    const closeFix = () => {
        setOpenFix(false);
    }

    const handleUpdateMutantStatus = (status_id: number, mutant: Mutation) => {
        dispatch({
            ...state,
            file: {
                ...state.file,
                mutations: state.file.mutations.map((mutation: Mutation) => {
                    if (mutant.id == mutation.id) {
                        mutation.status = status_id;
                    }
                    return mutation;
                })
            }

        })

        if (status_id !== MutantStatusType.Fix) return;

        setFixMutant(mutant);
        setOpenFix(true);
    }

    if (!state.mutant) {
        return (<LinearProgress/>);
    }

    return (
        <>
            <CodeDiffEditor
                original={state.file.source_code}
                mutated={state.mutant.source_code}
                mutation={state.mutant}
            />
            <GHCommentIssueComponent
                onClose={closeFix}
                open={openFix}
                mutant={fixMutant}
                project={state.project}
            />
            <MutantCoverageComponent mutant={state.mutant}/>
            <Grid container columns={12} justifyContent={"space-between"}>
                <Grid item xs={3}>
                    <ReactionComponent
                        mutant={state.mutant}
                        updateMutantStatusState={handleUpdateMutantStatus}
                    />
                </Grid>
                {/*<Grid item xs={3}>*/}
                {/*    <ButtonGroup variant={"contained"} aria-label="contained primary button group">*/}
                {/*        <Button disabled={!hasPrevious()}*/}
                {/*                onClick={() => previousMutant()}>Previous</Button>*/}
                {/*        <Button disabled={!hasNext()} onClick={() => nextMutant()}>Next</Button>*/}
                {/*    </ButtonGroup>*/}
                {/*</Grid>*/}
            </Grid>

        </>);
}

export default MutantPage;
