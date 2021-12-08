import {User} from "./UserType";
import {AlertColor} from "@mui/material";

export type GlobalLayoutStateType = {
    show_killed_mutants: boolean
}

export type GlobalStateType = {
    user: User
    layout: GlobalLayoutStateType,
    loading: boolean,
    notification_toast: NotificationToastType
}

export type NotificationToastType = {
    type: AlertColor
    message: string,
    open: boolean
}
