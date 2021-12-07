import * as React from "react";
import {useEffect, useRef, useState} from "react";
import Editor, {Monaco} from "@monaco-editor/react";
import {Chip, Stack} from "@mui/material";
import * as _ from "lodash";
import {editor, IRange} from "monaco-editor";
import {Mutation} from "../types/Mutation";
import {File} from "../types/File";
import * as ReactDOM from "react-dom";
import ScienceIcon from '@mui/icons-material/Science';
import ICodeEditor = editor.ICodeEditor;
import IModelDeltaDecoration = editor.IModelDeltaDecoration;
import EditorLayoutInfo = editor.EditorLayoutInfo;
import IContentWidget = editor.IContentWidget;


interface CodeEditorProps {
    file: File,
    onLineSelected: any
    currently_viewing_mutant: Mutation
}

const CodeEditor = (props: CodeEditorProps) => {

    const editorRef = useRef<ICodeEditor>();

    const [editorLoaded, setEditorLoaded] = useState(false);

    let decorations: IModelDeltaDecoration[] = [];

    useEffect(() => {
        if (editorLoaded && props.currently_viewing_mutant) {
            // Jump to first survived mutant
            let range: IRange = {
                startLineNumber: props.currently_viewing_mutant.start_line,
                endLineNumber: props.currently_viewing_mutant.end_line,
                startColumn: 0,
                endColumn: 0
            };
            editorRef.current.revealRangeInCenter(range);

            // let decoration: IModelDeltaDecoration = {
            //     range: range,
            //     options: {
            //         className: 'myGlyphMarginClass',
            //         isWholeLine: false,
            //         glyphMarginClassName: 'myGlyphMarginClass'
            //     }
            // }
            // decorations.push(decoration)
            // editorRef.current.deltaDecorations([], [decoration]);

        }
    }, [props.currently_viewing_mutant])

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

    let lines = _.groupBy(props.file.mutations, (mutation: any) => {
        return mutation.start_line;
    });

    const first_survived = _.first(props.file.mutations.filter((mut) => {
        return mut.result === 'S'
    }))

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

        _.forEach(lines, (value: any, key: any) => {
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
            let contentWidget: IContentWidget = {
                allowEditorOverflow: true,
                afterRender() {
                    updateAllMutationButtonsPosition(editor.getLayoutInfo());
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
                            monaco.editor.ContentWidgetPositionPreference.EXACT,
                            monaco.editor.ContentWidgetPositionPreference.EXACT
                        ]
                    };
                }
            };
            editor.addContentWidget(contentWidget);
        });
        editor.deltaDecorations([], decorations);

        // Jump to first survived mutant
        let range: IRange = {
            startLineNumber: first_survived.start_line,
            endLineNumber: first_survived.end_line,
            startColumn: 0,
            endColumn: 0
        };
        editor.revealRangeInCenter(range);

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