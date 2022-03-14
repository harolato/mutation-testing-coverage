import React from "react";
import {useGlobalState} from "../providers/GlobalStateProvider";

const [state, dispatch] = useGlobalState();

const TestAmpPage = () => {


    if ( !state.project ) {
        return null;
    }

    return (
        <>

        </>
    );
}

export default TestAmpPage;