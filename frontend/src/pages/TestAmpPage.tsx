import React, {ChangeEvent, useEffect, useState} from "react";
import {useGlobalState} from "../providers/GlobalStateProvider";
import {
    Box,
    Button,
    FormControl,
    Grid,
    InputLabel,
    MenuItem,
    Modal,
    Select, SelectChangeEvent,
    TextField,
    Typography
} from "@mui/material";
import {useParams} from "react-router-dom";
import BasicCodeEditor from "../components/BasicCodeEditor";
import {useLoading} from "../providers/LoadingStateProvider";
import Cookies from "js-cookie";
import {AjaxResponse} from "../types/AjaxResponse";
import {SourceCode} from "../types/SourceCode";
import ConfirmationDialog from "../components/ConfirmationDialog";

let ampTestInitial: SourceCode = {
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
    const [disableEvalButton, setDisableEvalButton] = useState(false)
    const [PRDialog, setPRDialog] = useState(false);
    const {loading, setLoading} = useLoading();
    const [amplifiedTest, setamplifiedTest] = useState(null);
    const [openConfirmation, setOpenConfirmation] = useState(false);
    let {amplifiedTestId} = useParams();

    const [selectedBranch, setSelectedBranch] = useState("")
    const [selectedBranchTarget, setSelectedBranchTarget] = useState("")

    const [branchList, setBranchList] = useState([])

    const [testName, setTestName] = useState('')
    const [ampTestSource, setAmpTestSource] = useState(ampTestInitial)

    useEffect(() => {
        if (state.evaluation_status?.completed === true) {
            setDisableEvalButton(false)
        }
    }, [state.evaluation_status?.completed])

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

    let submitPR = () => {
        setLoading(true);
        fetch(`/api/v1/submit_amp_test_pullrequest/`, {
            method: 'POST',
            headers: {
                'X-CSRFToken': Cookies.get('csrftoken'),
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                amp_test_id: amplifiedTestId,
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

    let getListOfBranches = () => {
        setLoading(true)
        fetch(`/github_api/v1/project_branches/${amplifiedTest.project_id}/`)
            .then(response => response.json())
            .then(data => {
                setBranchList(data)
                setLoading(false);
            })
            .catch(error => {
                setLoading(false)
                console.log(error)
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
                setDisableEvalButton(true)
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

    let evalResult = () => {
        const style = {
            position: 'absolute' as 'absolute',
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
            width: 400,
            bgcolor: 'background.paper',
            border: '2px solid #000',
            boxShadow: 24,
            p: 4,
        };

        let output = null;
        let result = "Pending";
        if (state.evaluation_status.completed) {
            console.log('1')
            if (state.evaluation_status.success) {
                console.log('2')
                result = "Success";
            } else {
                console.log('3')
                result = "Failure";
            }
        }
        if (state.evaluation_status.completed && state.evaluation_status.success && !state.evaluation_status.running) {
            console.log('4')
            output = <>
                <Button
                    color={"primary"}
                    variant={"contained"}
                    onClick={() => {
                        getListOfBranches()
                        setPRDialog(true)
                    }}
                >
                    Submit PR
                </Button>
                <Modal
                    open={PRDialog}
                    onClose={() => setPRDialog(false)}
                    aria-labelledby="modal-modal-title"
                    aria-describedby="modal-modal-description"
                >
                    <Box sx={style}>
                        <Typography variant={"h3"}>Submit PR</Typography>
                        <Box  sx={{mt:2, mb:2}}>
                            <TextField
                                placeholder="PR description"
                                multiline
                                rows={2}
                                maxRows={4}
                            ></TextField>
                        </Box>
                        <FormControl sx={{mt:2, mb:2}} fullWidth>
                            <InputLabel>Source Branch</InputLabel>
                            <Select
                                labelId="demo-simple-select-label"
                                id="demo-simple-select"
                                value={selectedBranch}
                                label="Branch"
                                onChange={(e: SelectChangeEvent) => setSelectedBranch(e.target.value)}
                            >
                                {branchList.map(branch =>
                                    <MenuItem key={branch.commit.sha} value={branch.name}>{branch.name}</MenuItem>
                                )}
                            </Select>
                        </FormControl>

                        <FormControl  sx={{mt:2, mb:2}} fullWidth>
                            <InputLabel>Target Branch</InputLabel>
                            <Select
                                labelId="demo-simple-select-label"
                                id="demo-simple-select"
                                value={"master"}
                                label="Target Branch"
                                onChange={(e: SelectChangeEvent) => setSelectedBranchTarget(e.target.value)}
                            >
                                {branchList.map(branch =>
                                    <MenuItem key={branch.commit.sha} value={branch.name}>{branch.name}</MenuItem>
                                )}
                            </Select>
                        </FormControl>

                        <Box  sx={{mt:2, mb:2}}>
                            <Button
                                color={"primary"}
                                variant={"contained"}
                                onClick={() => setPRDialog(false)}
                            >
                                Submit
                            </Button>
                        </Box>
                    </Box>
                </Modal>
            </>;
        }
        if (state.evaluation_status.status) {
            return (
                <>
                    <p>Status
                        ({state.evaluation_status.running ? "Running" : "Completed"}): {state.evaluation_status.status}</p>
                    <p>Result: {result}</p>
                    {output}
                </>
            );
        }
    }


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
                        disabled={disableEvalButton}
                        color={"primary"}>
                        Evaluate & Push
                    </Button>
                    <Button
                        sx={{
                            ml: 3
                        }}
                        onClick={() => setOpenConfirmation(true)}
                        variant={"contained"}
                        color={"error"}>
                        Reset to original
                    </Button>
                </Grid>
                <Grid item xs={6}>
                    {evalResult()}
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