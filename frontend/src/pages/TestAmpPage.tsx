import React, {useEffect, useState} from "react";
import {useGlobalState} from "../providers/GlobalStateProvider";
import {Box, Button, Grid, TextField, Typography} from "@mui/material";
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
            <Grid container columns={12} spacing={10} sx={{mb: 2}} justifyContent={"space-between"}>
                <Grid item xs={6}>
                    <TextField label={"Rename to"} fullWidth={true} defaultValue={amplifiedTest.test_name}></TextField>
                </Grid>
                <Grid item xs={6} textAlign={"right"}>
                    <Button variant={"contained"} color={"primary"}>Save</Button>
                </Grid>
            </Grid>
            <Grid container spacing={2}>
                <Grid item xs={6}>
                    <BasicCodeEditor source_code={amplifiedTest.source_code}/>
                </Grid>
                <Grid item xs={6}>
                    <BasicCodeEditor source_code={amplifiedTest.original_test.source_code}/>
                </Grid>
            </Grid>
            <Grid container columns={12} sx={{mt: 2}} justifyContent={"space-between"}>
                <Grid item xs={6}>
                    <Button variant={"contained"} color={"primary"}>Evaluate & Push</Button>
                </Grid>
                <Grid item xs={6}>
                    Errors....
                </Grid>
            </Grid>
        </>
    );
}

export default TestAmpPage;