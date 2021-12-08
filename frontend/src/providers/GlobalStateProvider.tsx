import * as React from "react";
import {useEffect} from "react";
import {User} from "../types/UserType";
import {GlobalStateType} from "../types/GlobalStateType";


const initialGlobalState:GlobalStateType = {
    user: null,
    layout: {
        show_killed_mutants: false
    },
    loading: true,
    notification_toast: {
        open: false,
        type: 'success',
        message: ''
    }
}

const GlobalStateContext = React.createContext(initialGlobalState);
const DispatchStateContext = React.createContext(undefined);

export const GlobalStateProvider = ({ children } : {children: any}) => {
        const [state, dispatch] = React.useReducer(
            (state: GlobalStateType, newValue: GlobalStateType) => ({...state, ...newValue}),
            initialGlobalState
        );
        useEffect(() => {
            fetch('/api/v1/user/')
                .then(res => res.json())
                .then((user: User) => {
                    dispatch({
                        ...state,
                        user: user,
                        loading: false
                    })
                });

        }, [])
        return (
            <GlobalStateContext.Provider value={state}>
                <DispatchStateContext.Provider value={dispatch}>
                    {children}
                </DispatchStateContext.Provider>
            </GlobalStateContext.Provider>
        );
    }

export const useGlobalState = () => [
  React.useContext(GlobalStateContext),
  React.useContext(DispatchStateContext)
];