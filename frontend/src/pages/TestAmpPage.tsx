import React, {useEffect, useState} from "react";
import {useGlobalState} from "../providers/GlobalStateProvider";
import {Button, Grid, TextField} from "@mui/material";
import {useParams} from "react-router-dom";
import BasicCodeEditor from "../components/BasicCodeEditor";
import {useLoading} from "../providers/LoadingStateProvider";
import Cookies from "js-cookie";
import {AjaxResponse} from "../types/AjaxResponse";
import {SourceCode} from "../types/SourceCode";
import ConfirmationDialog from "../components/ConfirmationDialog";

let ampTestInitial:SourceCode = {
    source: '',
    file_type: {
        extensions: [],
        aliases: [],
        id: ''
    },
    total_lines: 0
}

const TestAmpPage = () => {
    const [state, dispatch] = useGlobalState();
    const {loading, setLoading} = useLoading();
    const [amplifiedTest, setamplifiedTest] = useState(null);
    const [openConfirmation, setOpenConfirmation] = useState(false);
    let {amplifiedTestId} = useParams();

    const [testName, setTestName] = useState('')
    const [ampTestSource, setAmpTestSource] = useState(ampTestInitial)

    useEffect(() => {
        fetch(`/api/v1/test_amp/${amplifiedTestId}/`)
            .then(response => response.json())
            .then((response_json) => {
                setamplifiedTest(response_json)
                setAmpTestSource(response_json.source_code);
                setTestName(response_json.test_name)
                setLoading(false)
            });
    }, [amplifiedTestId])

    let codeChangedHandler = (changed_content: string) => {
        setAmpTestSource({
            ...ampTestSource,
            source: changed_content
        })
    }

    let submitAmpTest = () => {
        setLoading(true)
        fetch(`/api/v1/submit_amp_test/`, {
            method: 'POST',
            headers: {
                'X-CSRFToken': Cookies.get('csrftoken'),
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                amp_test_id: amplifiedTestId,
                test_name: testName,
                source_code: ampTestSource.source
            })
        })
            .then(json => json.json())
            .then((response: AjaxResponse) => {
                if (!response.status) {
                    throw Error(response.error)
                }
                setLoading(false)
                dispatch({
                    ...state,
                    notification_toast: {
                        open: true,
                        type: 'success',
                        message: "Submitted"
                    }
                });
            }).catch(error => {
            setLoading(false);
            dispatch({
                ...state,
                notification_toast: {
                    open: true,
                    type: 'error',
                    message: error + ""
                }
            });
        })
    }

    if (!amplifiedTest) return null;

    let resetToOriginalAmpTestSource = () => {
        console.log('confirmed')
    };


    return (
        <>
            <Grid container columns={12} spacing={10} sx={{mb: 2}} justifyContent={"space-between"}>
                <Grid item xs={6}>
                    <TextField label={"Rename to"} fullWidth={true} defaultValue={amplifiedTest.test_name}
                               onChange={(ev: React.ChangeEvent<HTMLInputElement>) => {
                                   setTestName(ev.target.value)
                               }}></TextField>
                </Grid>
                <Grid item xs={6} textAlign={"right"}>
                </Grid>
            </Grid>
            <Grid container spacing={2}>
                <Grid item xs={6}>
                    <BasicCodeEditor
                        source_code={ampTestSource}
                        onChangeHandler={codeChangedHandler}
                    />
                </Grid>
                <Grid item xs={6}>
                    <BasicCodeEditor
                        readonly={true}
                        source_code={amplifiedTest.original_test.source_code}
                    />
                </Grid>
            </Grid>
            <Grid container columns={12} sx={{mt: 2}} justifyContent={"space-between"}>
                <Grid item xs={6}>
                    <Button
                        onClick={submitAmpTest}
                        variant={"contained"}
                        color={"primary"}>
                        Evaluate & Push
                    </Button>
                    <Button
                        sx={{
                            ml:3
                        }}
                        onClick={() => setOpenConfirmation(true)}
                        variant={"contained"}
                        color={"error"}>
                        Reset to original
                    </Button>
                </Grid>
                <Grid item xs={6}>
                    <p>{state.evaluation_status?.status}</p>
                    <p>{state.evaluation_status?.data?.success === true ? "Result: Success" : "Result: Failure"}</p>
                    <p>{state.evaluation_status?.data?.message }</p>
                </Grid>
            </Grid>
            <ConfirmationDialog
                title={"Reset source code?"}
                open={openConfirmation}
                setOpen={setOpenConfirmation}
                onConfirm={resetToOriginalAmpTestSource}
            >
                Are you sure you want to reset your edited amplified test source code? Action is irreversible.
            </ConfirmationDialog>
        </>
    );
}

export default TestAmpPage;