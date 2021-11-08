import * as React from "react";
import Editor, { Monaco} from "@monaco-editor/react";
import {editor} from "monaco-editor";
import IModelDeltaDecoration = editor.IModelDeltaDecoration;

import ICodeEditor = editor.ICodeEditor;
import IStandaloneEditorConstructionOptions = editor.IStandaloneEditorConstructionOptions;
import * as _ from "lodash";
import IEditorMouseEvent = editor.IEditorMouseEvent;
import {Dialog, DialogTitle} from "@mui/material";
import MutationsView from "./MutationsView";

type MyState = {
    open: boolean
}
export default class HomePage extends React.Component<any, MyState> {
    private source_code: any;
    private mutations: any;
    private options: IStandaloneEditorConstructionOptions;
    private lines: any;
    private current_line: any;
    private dialog_title: any;

    constructor(props: any) {
        super(props);
        this.state = {
            open: false
        }
        this.source_code = JSON.parse(document.getElementById('source_code_js').textContent);
        this.mutations = JSON.parse(document.getElementById('mutations').textContent);
        this.options = {
            lineNumbers: (number: number) => {
                return "" + number;
            },
            readOnly: true
        }

        this.lines = _.groupBy(this.mutations.mutations, (mutation: any) => {
            return mutation.start_line;
        })
        this.current_line = null;

        this.dialog_title = "";

        this.handleViewMutations = this.handleViewMutations.bind(this);
        this.closeDialog = this.closeDialog.bind(this);
    }

    closeDialog() {
        this.setState({open:false});
    }

    handleViewMutations(e:IEditorMouseEvent) {
        this.current_line = this.lines[e.target.detail.split('-')[1]];
        this.dialog_title = this.mutations.path + ':' + this.current_line[0].start_line;
        this.setState({'open': true})
    }

    private handleEditorDidMount = (editor: ICodeEditor, monaco: Monaco) => {
        let decorations: IModelDeltaDecoration[] = [];

        _.forEach(this.lines, (value: any, key: any) => {
            _.forEach(value, (val) => {
                let decoration: IModelDeltaDecoration = {
                range: new monaco.Range(val.start_line, 1, val.end_line, 1),
                options: {
                    className: 'myContentClass',
                    isWholeLine: true
                }
            }
            decorations.push(decoration)
            })

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
                        preference: [monaco.editor.ContentWidgetPositionPreference.EXACT, monaco.editor.ContentWidgetPositionPreference.EXACT]
                    };
                }
            };
            editor.addContentWidget(contentWidget);
        });
        editor.deltaDecorations([], decorations);
        editor.onMouseDown(this.handleViewMutations)
    };

    render = () =>
        <div>
            <h2>{this.mutations.path}</h2>
            <h4>Git Hash:{this.mutations.hash}</h4>
            <Editor
                height="90vh"
                options={this.options}
                defaultLanguage="javascript"
                defaultValue={this.source_code}
                onMount={this.handleEditorDidMount}
            />
            <Dialog
                open={this.state.open}
                onClose={this.closeDialog}
            >
                <DialogTitle>{this.dialog_title}</DialogTitle>
                <MutationsView mutations={this.current_line}/>
            </Dialog>
        </div>
    ;


}