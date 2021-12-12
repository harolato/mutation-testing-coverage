import {createContext, useContext, useState} from "react";
import React from "react";
import {GlobalStateType} from "../types/GlobalStateType";

const GlobalStateContext = React.createContext([
    null,
    null,
]);

const initialState: GlobalStateType = {
    layout: {
        show_killed_mutants: false
    },
    notification_toast: {
        open: false,
        type: 'success',
        message: ''
    },
    // Database models
    user: null,
    project: null,
    job: null,
    file: null,

    // Computed
    mutant: null,
    selected_line_mutations: [],
    mutants: []
}

export const GlobalStateProvider = ({children}: { children: any }) => {
    const [state, dispatch] = useState(initialState);
    const value = [state, dispatch];
    return (
        <GlobalStateContext.Provider value={value}>{children}</GlobalStateContext.Provider>
    );
}

export function useGlobalState() {
    const context = useContext(GlobalStateContext);
    if (!context) {
        throw new Error("useLoading must be used within LoadingProvider");
    }
    return context;
}
