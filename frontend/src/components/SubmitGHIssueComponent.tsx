import React, {useEffect, useState} from "react";
import {Box, Modal, TextField, Typography} from "@mui/material";
import {Mutation} from "../types/Mutation";
import {Project} from "../types/Project";
import MDEditor from '@uiw/react-md-editor';

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

type PropsType = {
    mutant: Mutation,
    project: Project,
}

type StateType = {
    markdown: string
}

const SubmitGHIssueComponent = (props: PropsType) => {

    let initialState: StateType = {
        markdown: ''
    }
    const [open, setModal] = useState(false);
    const [state, setState] = useState(initialState);

    useEffect(() => {
        if (props.mutant) {
            fetch(`/api/v1/submit_github_issue/${props.mutant.id}/`)
                .then(res => res.json())
                .then((res: StateType) => {
                    setModal(true)
                    setState(res)
                })
        }
    }, [props.mutant])

    const handleClose = () => {
        setModal(false);
    }

    if (!open) {
        return null;
    }

    return (
        <>
            <Modal
                open={open}
                onClose={handleClose}
                aria-labelledby="modal-modal-title"
                aria-describedby="modal-modal-description"
            >
                <Box sx={style}>
                    <Typography id="modal-modal-title" variant="h6" component="h2">
                        Submit new issue on {props.project.git_repo_name} repository.
                    </Typography>
                    <MDEditor.Markdown source={state.markdown}/>
                </Box>
            </Modal>
        </>
    );

}
export default SubmitGHIssueComponent
