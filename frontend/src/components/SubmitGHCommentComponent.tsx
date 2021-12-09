import React, {useEffect, useState} from "react";
import {
    Box,
    Button,
    CircularProgress,
    LinearProgress, Link,
    TextField, Typography,
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

const SubmitGHCommentComponent = (props: PropsType) => {
    const [globalState, dispatch] = useGlobalState();
    const [previewMD, setPreviewMD] = useState(true);
    const [sendingComment, setSendingComment] = useState(false);
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

    const handleSendComment = () => {
        setSendingComment(true);
        fetch(`/api/v1/submit_github_issue/${props.mutant.id}/`, {
            method: 'POST',
            headers: {
                'X-CSRFToken': Cookies.get('csrftoken'),
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                markdown: state.markdown,
            })
        })
            .then(handleFetchErrors)
            .then((res: any) => {
                setSendingComment(false);
                props.success(`Comment submitted: ${res.issue_url}`)
            })
            .catch(catchError)
    }

    if ( !state ) {
        return null
    }

    return (
        <>
            <Typography id="modal-modal-title" variant="h6" component="h2">
                Add new comment on issue <Link
                href={state.issue.html_url}>#{state.issue.id}</Link>.
            </Typography>
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
            <Button variant={"contained"} startIcon={(sendingComment) ? <CircularProgress/> : <Send/>}
                    disabled={sendingComment} onClick={handleSendComment}>Submit</Button>
        </>
    );

}
export default SubmitGHCommentComponent
