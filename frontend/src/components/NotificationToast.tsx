import {useGlobalState} from "../providers/GlobalStateProvider";
import {Alert, Snackbar, SnackbarCloseReason, Stack} from "@mui/material";
import React from "react";


const NotificationToast = () => {
    const [state, dispatch] = useGlobalState();

    const handleClose = (event: React.SyntheticEvent<any>, reason: SnackbarCloseReason) => {
        if (reason == 'clickaway') {
            return;
        }
        dispatch({
            ...state,
            notification_toast: {
                open: false,
                message: '',
                type: 'success'
            }
        });
    }

    if ( !state.notification_toast ) {
        return null;
    }

    return (
        <>
            <Snackbar
                anchorOrigin={{vertical: 'top', horizontal: 'center'}}
                autoHideDuration={6000}
                open={state.notification_toast.open}
                onClose={handleClose}
            >
                <Alert severity={state.notification_toast.type}>{state.notification_toast.message}</Alert>
            </Snackbar>
        </>
    );
}
export default NotificationToast