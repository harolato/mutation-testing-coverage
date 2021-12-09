import React, {useEffect, useState} from "react";
import {
    Box,
    Button, Chip,
    CircularProgress,
    FormControl, FormControlLabel,
    InputLabel, LinearProgress, MenuItem,
    OutlinedInput,
    Select, SelectChangeEvent, Switch,
    TextField,
    Typography
} from "@mui/material";
import {Mutation} from "../types/Mutation";
import {Project} from "../types/Project";
import MDEditor from '@uiw/react-md-editor';
import {Send} from "@mui/icons-material";
import {useGlobalState} from "../providers/GlobalStateProvider";
import Cookies from "js-cookie";
import {Job} from "../types/Job";


type PropsType = {
    mutant: Mutation,
    project: Project,
    suggested_data: any,
    success: any
}


const ITEM_HEIGHT = 48;
const ITEM_PADDING_TOP = 8;
const MenuProps = {
    PaperProps: {
        style: {
            maxHeight: ITEM_HEIGHT * 4.5 + ITEM_PADDING_TOP,
            width: 250,
        },
    },
};

const SubmitGHIssueComponent = (props: PropsType) => {


    const [globalState, dispatch] = useGlobalState();
    const [previewMD, setPreviewMD] = useState(true);
    const [sendingIssue, setSendingIssue] = useState(false);
    const [selectedLabels, setSelectedLabels] = useState<string[]>([])
    const [assigneeMyself, setAssigneeMyself] = useState(true)
    const [state, setState] = useState(null);

    useEffect(() => {
        setState( (prevVal: any) => props.suggested_data)
    }, [props.suggested_data])

    const handleFetchErrors = (response: Response) => {
        if (!response.ok) {
            return Promise.reject(response);
        }
        return response.json();
    }

    const catchError = (response: any) => {
        response.json().then((json: any) => {
            dispatch({
                ...globalState,
                notification_toast: {
                    open: true,
                    type: 'error',
                    message: json.error
                }
            });
        })
    }

    const handleSendIssue = () => {
        setSendingIssue(true);
        fetch(`/api/v1/submit_github_issue/${props.mutant.id}/`, {
            method: 'POST',
            headers: {
                'X-CSRFToken': Cookies.get('csrftoken'),
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                markdown: state.markdown,
                issue_title: state.issue_title,
                labels: selectedLabels,
                assign_myself: assigneeMyself
            })
        })
            .then(handleFetchErrors)
            .then((res: any) => {
                setSendingIssue(false);
                props.success(`Issue submitted: ${res.issue_url}`)
            })
            .catch(catchError)
    }

    const handleSelectedLabel = (event: SelectChangeEvent<typeof selectedLabels>) => {
        const {
            target: {value},
        } = event;
        setSelectedLabels(
            // On autofill we get a the stringified value.
            typeof value === 'string' ? value.split(',') : value,
        );
    }



    const getLabelByName = (name: string) => {
        return state.labels.find((label: any) => label.name === name);
    }

    if ( !state ) {
        return null
    }

    return (
        <>
            <Typography id="modal-modal-title" variant="h6" component="h2">
                Submit new issue on {props.project.git_repo_name} repository.
            </Typography>
            <TextField
                fullWidth
                id="outlined-basic"
                label="Issue Title"
                variant="outlined"
                value={state.issue_title}
                onChange={(e) => {
                    setState({...state, issue_title: e.target.value})
                }}
                sx={{mb: 3, mt: 3}}
            />
            <FormControl sx={{mb: 3, mt: 3}} fullWidth>
                <InputLabel id="demo-multiple-chip-label">Labels</InputLabel>
                <Select
                    labelId="demo-multiple-chip-label"
                    id="demo-multiple-chip"
                    multiple
                    value={selectedLabels}
                    onChange={handleSelectedLabel}
                    input={<OutlinedInput id="select-multiple-chip" label="Labels"/>}
                    renderValue={(selected) => (
                        <Box sx={{display: 'flex', flexWrap: 'wrap', gap: 0.5}}>
                            {selected.map((value) => (
                                <Chip key={value} label={value} sx={{
                                    backgroundColor: `#${getLabelByName(value).color}`
                                }}/>
                            ))}
                        </Box>
                    )}
                    MenuProps={MenuProps}
                >
                    {state.labels.map((label: any) => (
                        <MenuItem
                            key={label.name}
                            value={label.name}
                        >
                            {label.name}
                        </MenuItem>
                    ))}
                </Select>
            </FormControl>

            <FormControlLabel sx={{mb: 3, mt: 3}} control={<Switch checked={assigneeMyself} onChange={() => {
                setAssigneeMyself(!assigneeMyself)
            }}/>} label="Assign to myself"/>

            <Box sx={{
                width: '100%',
                height: 300,
            }}>
                <Button variant={"contained"} onClick={() => {
                    setPreviewMD(!previewMD)
                }}>{(previewMD ? "Edit" : "Preview")}</Button>
                {
                    (previewMD) ?
                        <MDEditor.Markdown style={{
                            height: 270,
                            overflow: 'auto'
                        }} source={state.markdown}/> :
                        <TextField
                            onChange={(e) => {
                                setState({...state, markdown: e.target.value})
                            }}
                            fullWidth
                            rows={11}
                            multiline
                            value={state.markdown}
                        ></TextField>
                }
            </Box>
            <br/>
            <Button variant={"contained"} startIcon={(sendingIssue) ? <CircularProgress/> : <Send/>}
                    disabled={sendingIssue} onClick={handleSendIssue}>Submit</Button>
        </>
    );

}
export default SubmitGHIssueComponent