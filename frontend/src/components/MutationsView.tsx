import * as React from "react";
import {Mutation, MutationResult} from "../types/Mutation";
import {
    Button,
    IconButton,
    Paper,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow
} from "@mui/material";
import {FileOpen} from "@mui/icons-material";
import {useGlobalState} from "../providers/GlobalStateProvider";
import {useEffect, useState} from "react";

type MutationsViewProps = {
    mutations: Mutation[]
    currently_viewing: Mutation
    onMutationSelected: any
}

const MutationsView = (props: MutationsViewProps) => {

    const [state, dispatch] = useGlobalState()

    const [mutations, setMutations] = useState<Mutation[]>(props.mutations)

    const [currentlyViewing, setCurrentlyViewing] = useState(0)

    const handleChooseMutation = (mutation: Mutation) => {
        props.onMutationSelected(mutation);
    }

    const [viewUpdated, setViewUpdated] = useState(false)

    useEffect(() => {
        let data = props.mutations;
        if (!state.layout.show_killed_mutants) {
            data = data.filter((row) => {
                return row.result !== 'K';
            });
        }
        if ( props.currently_viewing != null ) {
            setCurrentlyViewing(props.currently_viewing.id);
        }
        setMutations(data);
    }, [state.layout.show_killed_mutants, props.mutations, props.currently_viewing]);

    return (
        <div className={"mutation-view"}>
            <TableContainer component={Paper}>
                <Table>
                    <TableHead>
                        <TableRow>
                            <TableCell>Description</TableCell>
                            <TableCell>Result</TableCell>
                            <TableCell>Source</TableCell>
                            <TableCell>Line</TableCell>
                            <TableCell></TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {
                            mutations.map((mutation) =>
                                <TableRow
                                    key={mutation.id}
                                    className={"mutation-view"}
                                    sx={{
                                        backgroundColor: currentlyViewing == mutation.id? "rgba(0,255,0, 0.3)":""
                                    }}
                                >
                                    <TableCell>Description: {mutation.description}</TableCell>
                                    <TableCell>{MutationResult[mutation.result]}</TableCell>
                                    <TableCell>Source: {mutation.mutated_source_code}</TableCell>
                                    <TableCell>
                                        {
                                            mutation.start_line != mutation.end_line ?
                                                `${mutation.start_line}-${mutation.end_line}` :
                                                mutation.start_line
                                        }
                                    </TableCell>
                                    <TableCell>
                                        <IconButton
                                            disabled={currentlyViewing == mutation.id}
                                            onClick={(e) => handleChooseMutation(mutation)}>
                                            <FileOpen></FileOpen>
                                        </IconButton>
                                    </TableCell>
                                </TableRow>
                            )
                        }
                    </TableBody>
                </Table>
            </TableContainer>

        </div>);
}
export default MutationsView


