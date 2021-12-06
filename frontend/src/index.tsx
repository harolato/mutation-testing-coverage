import * as React from "react";
import * as ReactDOM from "react-dom";
import {BrowserRouter} from "react-router-dom";
import {GlobalStateProvider} from "./providers/GlobalStateProvider";
import App from "./App";
import PageRoutes from "./components/Routes";

const rootElement = document.getElementById('root');

ReactDOM.render(
    <>
        <GlobalStateProvider>
            <BrowserRouter>
                <App/>
            </BrowserRouter>
        </GlobalStateProvider>
    </>,
    rootElement
);