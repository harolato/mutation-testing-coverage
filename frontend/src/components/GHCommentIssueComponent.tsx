import React, {useEffect, useState} from "react";
import {Job} from "../types/Job";
import {Mutation} from "../types/Mutation";
import {Project} from "../types/Project";
import SubmitGHIssueComponent from "./SubmitGHIssueComponent";
import SubmitGHCommentComponent from "./SubmitGHCommentComponent";
import {Box, LinearProgress, Modal, Typography} from "@mui/material";

const style = {
    position: 'absolute' as 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    width: 750,
    bgcolor: 'background.paper',
    border: '2px solid #000',
    boxShadow: 24,
    p: 4,
};

type ComponentProps = {
    mutant: Mutation,
    project: Project,
    open: boolean
    onClose: any
}

type StateType = {
    markdown: string
    issue_title: string
    labels: any[],
    issue?: any
}

const GHCommentIssueComponent = (props: ComponentProps) => {


    const [state, setState] = useState<StateType>(null);
    const [loading, setLoading] = useState(true);
    const [showSuccess, setShowSuccess] = useState(false);
    const [successMessage, setSuccessMessage] = useState('');

    useEffect(() => {
        if (props.mutant) {
            fetch(`/api/v1/submit_github_issue/${props.mutant.id}/`)
                .then(res => res.json())
                .then((res: StateType) => {
                    setState(res)
                    setLoading(false)
                })
        }
    }, [props.open])

    const handleClose = () => {
        props.onClose();
        setState(null)
        setLoading(true)
        setSuccessMessage('');
        setShowSuccess(false);

    }

    const handleSuccess = (message: string) => {
        setSuccessMessage(message);
        setShowSuccess(true);
        setTimeout(() => {
            handleClose()
        }, 5000)
    }

    if (!props.open) {
        return null;
    }


    return (
        <>
            <Modal
                open={props.open}
                onClose={handleClose}
                aria-labelledby="modal-modal-title"
                aria-describedby="modal-modal-description"
            >
                <Box sx={style}>
                    {
                        (loading && !state) ?
                            <LinearProgress/> :
                            (showSuccess) ? <Typography>{successMessage}</Typography>
                                :
                                (state.issue) ?
                                    <SubmitGHCommentComponent success={handleSuccess}
                                                              suggested_data={state} {...props}/> :
                                    <SubmitGHIssueComponent success={handleSuccess} suggested_data={state} {...props}/>
                    }
                </Box>
            </Modal>
        </>
    );
}

export default GHCommentIssueComponent