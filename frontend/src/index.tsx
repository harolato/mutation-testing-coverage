import React from "react";
import ReactDOM from "react-dom";
import {BrowserRouter} from "react-router-dom";
import {GlobalStateProvider} from "./providers/GlobalStateProvider";
import App from "./App";
import {LoadingStateProvider} from "./providers/LoadingStateProvider";

const rootElement = document.getElementById('root');

ReactDOM.render(
    <>
        <LoadingStateProvider>
            <GlobalStateProvider>
                <BrowserRouter>
                    <App/>
                </BrowserRouter>
            </GlobalStateProvider>
        </LoadingStateProvider>
    </>,
    rootElement
);