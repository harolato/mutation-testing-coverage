import React from "react";
import {DiffEditor, Monaco} from "@monaco-editor/react";
import {editor, IRange} from "monaco-editor";
import {SourceCode} from "../types/SourceCode";
import {Mutation} from "../types/Mutation";
import IStandaloneDiffEditorConstructionOptions = editor.IStandaloneDiffEditorConstructionOptions;
import IDiffEditor = editor.IDiffEditor;
import {useEffect, useRef, useState} from "react";


interface CodeDiffEditorProps {
    original: SourceCode,
    mutated: SourceCode,
    mutation: Mutation
}

const CodeDiffEditor = (props:CodeDiffEditorProps) => {

    const editorRef = useRef<IDiffEditor>();

    const [editorLoaded, setEditorLoaded] = useState(false);

    const options:IStandaloneDiffEditorConstructionOptions = {
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

    useEffect(() => {
        if (editorLoaded) {
            let range: IRange = {
                startLineNumber: props.mutation.start_line,
                endLineNumber: props.mutation.end_line,
                startColumn: 0,
                endColumn: 0
            };
            editorRef.current.revealRangeInCenter(range);
        }
    }, [props.mutation.id])

    const handleDiffEditorDidMount = (editor: IDiffEditor, monaco: Monaco) => {
        editorRef.current = editor;
        setEditorLoaded(true);
        let range: IRange = {
            startLineNumber: props.mutation.start_line,
            endLineNumber: props.mutation.end_line,
            startColumn: 0,
            endColumn: 0
        };
        editor.revealRangeInCenter(range);
    };

    return(
        <>
            <DiffEditor
                original={props.original.source}
                modified={props.mutated.source}
                language={props.original.file_type.id}
                height="50vh"
                options={options}
                onMount={handleDiffEditorDidMount}
            />
        </>);

}
export default CodeDiffEditor