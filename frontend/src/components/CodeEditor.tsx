import React from "react";
import {useEffect, useRef, useState} from "react";
import Editor, {Monaco} from "@monaco-editor/react";
import {Chip, Stack} from "@mui/material";
import {editor, IRange} from "monaco-editor";
import {Mutation} from "../types/Mutation";
import {File} from "../types/File";
import ReactDOM from "react-dom";
import ScienceIcon from '@mui/icons-material/Science';
import {groupBy, forEach, first} from "lodash/fp";
import ICodeEditor = editor.ICodeEditor;
import EditorLayoutInfo = editor.EditorLayoutInfo;
import IModelDeltaDecoration = editor.IModelDeltaDecoration;
import ContentWidgetPositionPreference = editor.ContentWidgetPositionPreference;
import IContentWidget = editor.IContentWidget;
import {loader} from "@monaco-editor/react";

loader.config({paths: {vs: '/static/frontend/monaco-editor/min/vs'}})

interface CodeEditorProps {
    file: File,
    onLineSelected: any
    currently_viewing_mutant: Mutation
    mutants: Mutation[]
}

const CodeEditor = (props: CodeEditorProps) => {

    const editorRef = useRef<ICodeEditor>();
    const [editorLoaded, setEditorLoaded] = useState(false);
    const [contentWidgets, setContentWidgets] = useState<IContentWidget[]>([]);

    useEffect(() => {
        if (editorLoaded) {
            if (props.currently_viewing_mutant) {
                // Jump to first survived mutant
                let range: IRange = {
                    startLineNumber: props.currently_viewing_mutant.start_line,
                    endLineNumber: props.currently_viewing_mutant.end_line,
                    startColumn: 0,
                    endColumn: 0
                };
                editorRef.current.revealRangeInCenter(range);
            }
        }
    }, [props.currently_viewing_mutant]);

    useEffect(() => {
        if (editorLoaded) {
            const first_survived = first(props.mutants.filter(mut => mut.result === 'S'))
            if (first_survived) {
                let range: IRange = {
                    startLineNumber: first_survived.start_line,
                    endLineNumber: first_survived.end_line,
                    startColumn: 0,
                    endColumn: 0
                };
                editorRef.current.revealRangeInCenter(range);
            }
            highlightSurvivedMutants();
        }
    }, [props.mutants, editorLoaded])

    useEffect(() => {
        return () => {
            setEditorLoaded(false);
            editorRef.current = null;
            clearWidgets();
        }
    }, []);

    let clearWidgets = () => {
        contentWidgets.map(widget => {
            editorRef.current.removeContentWidget(widget);
            return widget;
        });
        setContentWidgets([]);
    }

    let highlightSurvivedMutants = () => {
        clearWidgets();

        let decorations: IModelDeltaDecoration[] = [];
        let lines = groupBy((mutation: Mutation) => {
            return mutation.start_line;

        }, props.mutants);
        let added_widgets: IContentWidget[] = [];
        forEach(value => {
            forEach((val: Mutation) => {
                if (
                    val.start_line > editorRef.current.getModel().getLineCount() ||
                    val.end_line > editorRef.current.getModel().getLineCount()
                ) {
                    return false;
                }
                let decoration: IModelDeltaDecoration = {
                    range: {
                        startLineNumber: val.start_line,
                        startColumn: 1,
                        endLineNumber: val.end_line,
                        endColumn: 1
                    },
                    options: {
                        className: 'myContentClass',
                        isWholeLine: true
                    }
                }
                decorations.push(decoration)
            }, value)

            if (
                value[0].start_line > editorRef.current.getModel().getLineCount() ||
                value[0].end_line > editorRef.current.getModel().getLineCount()
            ) {
                return false;
            }
            // Add a content widget (scrolls inline with text)
            let contentWidget: IContentWidget = {
                allowEditorOverflow: true,
                afterRender() {
                    updateAllMutationButtonsPosition(editorRef.current.getLayoutInfo());
                },
                getId: function () {
                    return 'line-' + value[0].start_line;
                },
                getDomNode: function () {
                    if (!this.domNode) {
                        this.domNode = renderChip(value);
                    }
                    return this.domNode;
                },
                getPosition: function () {
                    return {
                        position: {
                            lineNumber: value[0].start_line,
                            column: 0,
                        },
                        preference: [
                            ContentWidgetPositionPreference.EXACT,
                            ContentWidgetPositionPreference.EXACT
                        ]
                    };
                }
            };
            editorRef.current.addContentWidget(contentWidget);
            added_widgets.push(contentWidget);
        }, lines);
        setContentWidgets(added_widgets);
        editorRef.current.deltaDecorations([], decorations);
    }

    const options = {
        glyphMargin: true,
        automaticLayout: true,
        lineNumbers: (number: number) => {
            return "" + number;
        },
        minimap: {
            enabled: false
        },
        readOnly: true,
    };

    const renderChip = (mutations: Mutation[]): HTMLDivElement => {
        let el = document.createElement('div');
        el.className = 'mutation-line-identifier'

        let killed_mutants = mutations.filter((row) => {
            return row.result === 'K';
        })

        let kill_rate = (killed_mutants.length * 100) / mutations.length;


        let color: "default" | "success" | "warning" | "error" | "primary" | "secondary" | "info" = "success";

        if (kill_rate < 100 && kill_rate > 50) {
            color = 'warning';
        } else if (kill_rate <= 50) {
            color = 'error'
        }

        const chipElement = (
            <>
                <Stack direction="row" spacing={1}>
                    <Chip
                        onClick={() => handleViewMutations(mutations)}
                        label={`${killed_mutants.length}/${mutations.length} (${kill_rate}%)`}
                        clickable
                        size={"small"}
                        icon={<ScienceIcon/>}
                        color={color}
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

    const handleViewMutations = (mutations: Mutation[]) => {
        props.onLineSelected(mutations);
    }

    const updateAllMutationButtonsPosition = (layoutInfo: EditorLayoutInfo) => {
        let buttons = Array.from(document.getElementsByClassName('mutation-line-identifier') as HTMLCollectionOf<HTMLElement>)
        for (let i = 0; i < buttons.length; i++) {
            buttons[i].style.left = `${layoutInfo.contentWidth - buttons[i].clientWidth + 50}px`;
        }
    }

    const handleEditorDidMount = (editor: ICodeEditor, monaco: Monaco) => {
        editorRef.current = editor;
        setEditorLoaded(true);
    };

    return (
        <>
            <Editor
                height="50vh"
                options={options}
                language={props.file.source_code.file_type.id}
                value={props.file.source_code.source}
                onMount={handleEditorDidMount}
            />
        </>);

}
export default CodeEditor