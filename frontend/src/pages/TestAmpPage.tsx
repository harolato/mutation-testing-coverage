import React, {useEffect, useState} from "react";
import {useGlobalState} from "../providers/GlobalStateProvider";
import {Grid} from "@mui/material";
import {useParams} from "react-router-dom";
import BasicCodeEditor from "../components/BasicCodeEditor";
import {useLoading} from "../providers/LoadingStateProvider";

const TestAmpPage = () => {
    const [state, dispatch] = useGlobalState();
    const {loading, setLoading} = useLoading();
    const [amplifiedTest, setamplifiedTest] = useState(null);
    let {amplifiedTestId} = useParams();

    useEffect(() => {
        fetch(`/api/v1/test_amp/${amplifiedTestId}/`)
            .then(response => response.json())
            .then((response_json) => {
                setamplifiedTest(response_json)
                setLoading(false)
            });
    }, [amplifiedTestId])

    if (!amplifiedTest) return null;

    return (
        <>
            <Grid container spacing={2}>
                <Grid item xs={6}>
                    <BasicCodeEditor source_code={amplifiedTest.source_code}/>
                </Grid>
                <Grid item xs={6}>
                    <BasicCodeEditor source_code={amplifiedTest.original_test.source_code}/>
                </Grid>
            </Grid>
        </>
    );
}

export default TestAmpPage;