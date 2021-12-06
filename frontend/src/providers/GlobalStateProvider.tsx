import * as React from "react";

const initialGlobalState = {
    user: "test",
    counter: 0,
    layout: {
        show_killed_mutants: false
    }
}

const GlobalStateContext = React.createContext(initialGlobalState);
const DispatchStateContext = React.createContext(undefined);

export const GlobalStateProvider = ({ children } : {children: any}) => {
        const [state, dispatch] = React.useReducer(
            (state: any, newValue: any) => ({...state, ...newValue}),
            initialGlobalState
        );
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