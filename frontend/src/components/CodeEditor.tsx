import {Component} from "react";
import Editor, {Monaco} from "@monaco-editor/react";
import * as React from "react";
import {Dialog, DialogTitle} from "@mui/material";
import MutationsView from "./MutationsView";
import * as _ from "lodash";
import {editor} from "monaco-editor";
import IStandaloneEditorConstructionOptions = editor.IStandaloneEditorConstructionOptions;
import IEditorMouseEvent = editor.IEditorMouseEvent;
import ICodeEditor = editor.ICodeEditor;
import IModelDeltaDecoration = editor.IModelDeltaDecoration;
import {Mutation} from "../types/Mutation";
import {File} from "../types/File";


interface CodeEditorProps {
    file: File
}

interface OpenDialogFileLine {
    line_number: number,
    mutations: Mutation[]
}

interface CodeEditorState {
    open: boolean,
    open_line?: OpenDialogFileLine
}

export default class CodeEditor extends Component<CodeEditorProps, CodeEditorState> {

    private readonly options: IStandaloneEditorConstructionOptions;
    private readonly lines: any;
    private current_line: any;
    private dialog_title: any;

    constructor(props: CodeEditorProps) {
        super(props);
        this.state = {
            open: false,
            open_line: {
                line_number: 0,
                mutations: []
            }
        }
        this.options = {
            lineNumbers: (number: number) => {
                return "" + number;
            },
            minimap: {
                enabled: false
            },
            readOnly: true
        }

        this.lines = _.groupBy(this.props.file.mutations, (mutation: any) => {
            return mutation.start_line;
        })
        this.current_line = null;

        this.dialog_title = "";

        this.handleViewMutations = this.handleViewMutations.bind(this);
        this.closeDialog = this.closeDialog.bind(this);
    }

    closeDialog() {
        this.setState({open: false});
    }

    handleViewMutations(e: IEditorMouseEvent) {
        const file_line = this.lines[e.target.detail.split('-')[1]];
        console.log(file_line[0]);
        this.setState({
            open_line: {
                line_number: file_line[0].start_line,
                mutations: file_line
            }
        })
        this.setState({'open': true})
    }

    private handleEditorDidMount = (editor: ICodeEditor, monaco: Monaco) => {
        let decorations: IModelDeltaDecoration[] = [];
        _.forEach(this.lines, (value: any, key: any) => {
            _.forEach(value, (val) => {
                if (
                    val.start_line > editor.getModel().getLineCount() ||
                    val.end_line > editor.getModel().getLineCount()
                ) {
                    return false;
                }
                let decoration: IModelDeltaDecoration = {
                    range: new monaco.Range(val.start_line, 1, val.end_line, 1),
                    options: {
                        className: 'myContentClass',
                        isWholeLine: true,
                    }
                }
                decorations.push(decoration)
            })

            if (
                value[0].start_line > editor.getModel().getLineCount() ||
                value[0].end_line > editor.getModel().getLineCount()
            ) {
                return false;
            }
            // Add a content widget (scrolls inline with text)
            let contentWidget = {
                getId: function () {
                    return 'line-' + value[0].start_line;
                },
                getDomNode: function () {
                    if (!this.domNode) {
                        this.domNode = document.createElement('div');
                        this.domNode.className = 'content-widget'
                        this.domNode.innerHTML = 'x' + value.length + ' mutations';
                    }
                    return this.domNode;
                },
                getPosition: function () {
                    return {
                        position: {
                            lineNumber: value[0].start_line,
                            column: editor.getModel().getLineLength(value[0].start_line) + 1
                        },
                        preference: [
                            monaco.editor.ContentWidgetPositionPreference.EXACT,
                            monaco.editor.ContentWidgetPositionPreference.EXACT
                        ]
                    };
                }
            };
            editor.addContentWidget(contentWidget);
        });
        editor.deltaDecorations([], decorations);
        editor.onMouseDown(this.handleViewMutations)
    };

    render = () =>
        <>
            <Editor
                height="90vh"
                width="50%"
                options={this.options}
                defaultLanguage="javascript"
                defaultValue={this.props.file.source_code.source}
                onMount={this.handleEditorDidMount}
            />
            <Dialog
                open={this.state.open}
                onClose={this.closeDialog}
            >
                <DialogTitle>Mutations on Line: {this.state.open_line.line_number}</DialogTitle>
                <MutationsView mutations={this.state.open_line.mutations}/>
            </Dialog>
        </>
    ;

}