import * as React from "react";
import {useEffect, useState} from "react";
import {MutantStatusType, Mutation} from "../types/Mutation";
import {Button, ButtonGroup, Modal, Typography} from "@mui/material";
import {Check} from "@mui/icons-material";
import Cookies from "js-cookie";
import {useGlobalState} from "../providers/GlobalStateProvider";

type ReactionComponentProps = {
    mutant: Mutation,
    updateMutantStatusState: any
}
type ReactionComponentState = {
    status: MutantStatusType
}


const ReactionComponent = (props: ReactionComponentProps) => {

    let initialState: ReactionComponentState = {
        status: 1
    };

    const [state, setState] = useState<ReactionComponentState>(initialState);
    const [globalState, dispatch] = useGlobalState();

    useEffect(() => {
        setState({
            ...state,
            status: props.mutant.status
        })
    }, [props.mutant]);

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

    const updateStatus = (status: number) => {
        if (state.status == status) {
            return;
        }
        fetch(`/api/v1/mutations/${props.mutant.id}/`, {
            method: 'PATCH',
            headers: {
                'Content-Type': 'application/json',
                'X-CSRFToken': Cookies.get('csrftoken'),
            },
            body: JSON.stringify({status: status})
        })
            .then(handleFetchErrors)
            .then(res => {
                setState({
                    status: status
                })
                props.updateMutantStatusState(status, props.mutant);
                dispatch({
                    ...globalState,
                    notification_toast: {
                        open: true,
                        type: 'success',
                        message: "Mutant action status has been updated"
                    }
                });
            })
            .catch(catchError)
    }

    const handleFixClick = () => {
        updateStatus(1)
    }

    const handleIgnoreClick = () => {
        updateStatus(2)
    }

    return (
        <>
            <ButtonGroup variant="outlined" aria-label="outlined primary button group">
                <Button
                    onClick={handleFixClick}
                    startIcon={state.status == 1 ? <Check/> : ''}
                    variant={state.status == 1 ? "contained" : "outlined"}
                >
                    Fix
                </Button>
                <Button
                    onClick={handleIgnoreClick}
                    variant={state.status == 2 ? "contained" : "outlined"}
                    startIcon={state.status == 2 ? <Check/> : ''}
                >
                    Ignore
                </Button>
            </ButtonGroup>
        </>
    );
}
export default ReactionComponent