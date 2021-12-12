import {User} from "./UserType";
import {AlertColor} from "@mui/material";
import {File} from "./File";
import {Project} from "./Project";
import {Job} from "./Job";
import {Mutation} from "./Mutation";

export type GlobalLayoutStateType = {
    show_killed_mutants: boolean
}

export type GlobalStateType = {
    user: User
    layout: GlobalLayoutStateType,
    notification_toast: NotificationToastType,
    project: Project | null,
    job: Job | null,
    file: File | null,
    mutant: Mutation | null,
    mutants: Mutation[],
    selected_line_mutations: Mutation[],
}

export type NotificationToastType = {
    type: AlertColor
    message: string,
    open: boolean
}