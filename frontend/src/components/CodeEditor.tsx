import {Component} from "react";
import Editor, {Monaco} from "@monaco-editor/react";
import * as React from "react";
import {Chip, Dialog, DialogTitle, Stack} from "@mui/material";
import MutationsView from "./MutationsView";
import * as _ from "lodash";
import {editor} from "monaco-editor";
import IStandaloneEditorConstructionOptions = editor.IStandaloneEditorConstructionOptions;
import IEditorMouseEvent = editor.IEditorMouseEvent;
import ICodeEditor = editor.ICodeEditor;
import IModelDeltaDecoration = editor.IModelDeltaDecoration;
import {Mutation} from "../types/Mutation";
import {File} from "../types/File";
import * as ReactDOM from "react-dom";
import ScienceIcon from '@mui/icons-material/Science';


interface CodeEditorProps {
    file: File,
    onLineSelected: any
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

    private chip: any

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
            readOnly: true,
        }

        this.lines = _.groupBy(this.props.file.mutations, (mutation: any) => {
            return mutation.start_line;
        })
        this.current_line = null;

        this.dialog_title = "";

        this.handleViewMutations = this.handleViewMutations.bind(this);
        this.closeDialog = this.closeDialog.bind(this);
        this.chip = this.renderChip.bind(this);
    }

    renderChip(mutations: Mutation[]) {
        let el = document.createElement('div');
        el.className = 'content-widget'
        const chipElement = (
            <>
            <Stack direction="row" spacing={1}>
              <Chip
                  onClick={() => this.handleViewMutations(mutations)}
                  label={`${mutations.length}`}
                  component="a"
                  href="#basic-chip"
                  clickable
                  size={"small"}
                  icon={<ScienceIcon/>}
                  color={"warning"}
                  sx={{
                      height: '18px'
                  }}
              />
            </Stack>
            </>
        );
        ReactDOM.render(chipElement, el)

        return el;
    }

    closeDialog() {
        this.setState({open: false});
    }

    handleViewMutations(mutations: Mutation[]) {
        this.props.onLineSelected(mutations);
    }

    private handleEditorDidMount = (editor: ICodeEditor, monaco: Monaco) => {
        let decorations: IModelDeltaDecoration[] = [];
        _.forEach(this.lines, (value: any, key: any) => {
            let vm = this
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
                        isWholeLine: true
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
                        this.domNode = vm.chip(value)
                    }
                    return this.domNode;
                },
                getPosition: function () {
                    return {
                        position: {
                            lineNumber: value[0].start_line,
                            column: 0
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
    };

    render = () =>
        <>
            <Editor
                height="50vh"
                options={this.options}
                language={this.props.file.source_code.file_type.id}
                value={this.props.file.source_code.source}
                onMount={this.handleEditorDidMount}
            />
        </>
    ;

}