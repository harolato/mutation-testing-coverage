import * as React from "react";
import Editor, {Monaco} from "@monaco-editor/react";
import {editor} from "monaco-editor";
import IModelDeltaDecoration = editor.IModelDeltaDecoration;

import ICodeEditor = editor.ICodeEditor;
import IStandaloneEditorConstructionOptions = editor.IStandaloneEditorConstructionOptions;
import * as _ from "lodash";
import IEditorMouseEvent = editor.IEditorMouseEvent;
import {Dialog, DialogTitle} from "@mui/material";
import MutationsView from "./MutationsView";
import CodeEditor from "./CodeEditor";

type MyState = {
    open: boolean
}
export default class HomePage extends React.Component<any, MyState> {
    private readonly file: any;

    constructor(props: any) {
        super(props);
        this.file = JSON.parse(document.getElementById('mutations').textContent);
    }

    render = () =>
        <div>
            <h2>{this.file.path}</h2>
            <h4>Git Hash:{this.file.hash}</h4>
            <CodeEditor file={this.file}></CodeEditor>
        </div>
    ;


}