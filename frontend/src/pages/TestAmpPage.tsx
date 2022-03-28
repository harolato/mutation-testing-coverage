import React, {useEffect, useState} from "react";
import {useGlobalState} from "../providers/GlobalStateProvider";
import {Grid} from "@mui/material";
import CodeEditor from "../components/CodeEditor";
import {useParams} from "react-router-dom";


const TestAmpPage = () => {
    const [state, dispatch] = useGlobalState();
    const [mutantCoverage, setMutantCoverage] = useState();
    let {mutantCoverageId} = useParams();

    useEffect(() => {
        fetch(`/api/v1/projects/${mutantCoverageId}/`)
    }, [mutantCoverageId])

    if (!state.project) {
        return null;
    }

    return (
        <>
            <Grid container spacing={2}>
                <CodeEditor
                    file={null}
                    onLineSelected={null}
                    currently_viewing_mutant={null}
                    mutants={null}
                />
            </Grid>
        </>
    );
}

export default TestAmpPage;