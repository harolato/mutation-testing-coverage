import * as React from "react";
import {Component} from "react";
import {DiffEditor, Monaco} from "@monaco-editor/react";
import {editor, IRange} from "monaco-editor";
import {SourceCode} from "../types/SourceCode";
import {Mutation} from "../types/Mutation";
import IStandaloneDiffEditorConstructionOptions = editor.IStandaloneDiffEditorConstructionOptions;
import IDiffEditor = editor.IDiffEditor;
import ScrollType = editor.ScrollType;


interface CodeDiffEditorProps {
    original: SourceCode,
    mutated: SourceCode,
    mutation: Mutation
}

interface CodeDiffEditorState {
}

export default class CodeDiffEditor extends Component<CodeDiffEditorProps, CodeDiffEditorState> {

    private readonly options: IStandaloneDiffEditorConstructionOptions;

    constructor(props: CodeDiffEditorProps) {
        super(props);
        this.state = {
        }

        this.options = {
            lineNumbers: (number: number) => {
                return "" + number;
            },
            minimap: {
                enabled: false
            },
            readOnly: true,
            renderSideBySide: false,
            enableSplitViewResizing: false
        }
    }

    private handleDiffEditorDidMount = (editor: IDiffEditor, monaco: Monaco) => {
        let range: IRange = {
            startLineNumber: this.props.mutation.start_line,
            endLineNumber: this.props.mutation.end_line,
            startColumn: 0,
            endColumn:0
        };
        editor.revealRangeInCenter(range);
    };

    render = () =>
        <>
            <DiffEditor
                original={this.props.original.source}
                modified={this.props.mutated.source}
                height="50vh"
                options={this.options}
                onMount={this.handleDiffEditorDidMount}
            />
        </>
    ;

}