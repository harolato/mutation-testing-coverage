import React from "react";
import {useEffect, useRef, useState} from "react";
import MonacoEditor from 'react-monaco-editor';
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
import {SourceCode} from "../types/SourceCode";

interface BasicCodeEditorProps {
    source_code: SourceCode,
    readonly ?: boolean,
    onChangeHandler ?: any
}

const BasicCodeEditor = (props: BasicCodeEditorProps) => {

    const editorRef = useRef<ICodeEditor>();
    const [editorLoaded, setEditorLoaded] = useState(false);
    const [contentWidgets, setContentWidgets] = useState<IContentWidget[]>([]);

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

    const options = {
        glyphMargin: true,
        automaticLayout: true,
        lineNumbers: (number: number) => {
            return "" + number;
        },
        minimap: {
            enabled: false
        },
        readOnly: props.readonly ?? false,
    };


    const handleEditorDidMount = (editor: ICodeEditor) => {
        editorRef.current = editor;
        setEditorLoaded(true);
    };

    return (
        <>
            <MonacoEditor
                height="50vh"
                onChange={props.onChangeHandler}
                options={options}
                language={props.source_code.file_type.id}
                value={props.source_code.source}
                editorDidMount={handleEditorDidMount}
            />
        </>);

}
export default BasicCodeEditor