import {User} from "./UserType";

export type GlobalLayoutStateType = {
    show_killed_mutants: boolean
}

export type GlobalStateType = {
    user: User
    layout: GlobalLayoutStateType,
    loading: boolean
}
