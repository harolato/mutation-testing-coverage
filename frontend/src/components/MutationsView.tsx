import React from "react";
import {MutantStatusType, Mutation, MutationResult} from "../types/Mutation";
import {
    Button,
    IconButton,
    Paper,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow, Typography
} from "@mui/material";
import {FileOpen} from "@mui/icons-material";
import {useEffect, useState} from "react";
import {Link, useParams} from "react-router-dom";
import {first} from "lodash";
import {useGlobalState} from "../providers/GlobalStateProvider";

type MutViewProps = {
    mutants: Mutation[],
    selected: Mutation[],
}

const MutationsView = (props:MutViewProps) => {
    const [currentlyViewing, setCurrentlyViewing] = useState<string>('0')
    let {mutantId} = useParams();

    const [state, dispatch] = useGlobalState();
    useEffect(() => {
        setCurrentlyViewing(mutantId);
    }, [mutantId]);

    const clearLineFilter = () => {
        dispatch({
            ...state,
            selected_line_mutations: []
        });
    }

    // if (props.selected.length == 0 && props.mutants.length == 0) {
    //     return (<Typography>No mutants found on this file.</Typography>);
    // }

    return (
        <div className={"mutation-view"}>
            {props.selected.length > 0 ? (<>
                        Filtered by Line: {first(props.selected).start_line}
                        <Button variant={"contained"} onClick={clearLineFilter}>Clear</Button>
                    </>):(<></>)}
            <TableContainer component={Paper}>
                <Table>
                    <TableHead>
                        <TableRow>
                            <TableCell>Status</TableCell>
                            <TableCell>Description</TableCell>
                            <TableCell>Result</TableCell>
                            <TableCell>Source</TableCell>
                            <TableCell>Line</TableCell>
                            <TableCell></TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {
                            ((props.selected.length > 0)? props.selected: props.mutants).map((mutation) =>
                                <TableRow
                                    key={mutation.id}
                                    className={"mutation-view"}
                                >
                                    <TableCell>{MutantStatusType[mutation.status]}</TableCell>
                                    <TableCell>{mutation.description}</TableCell>
                                    <TableCell>{MutationResult[mutation.result]}</TableCell>
                                    <TableCell>{mutation.mutated_source_code}</TableCell>
                                    <TableCell>
                                        {
                                            mutation.start_line != mutation.end_line ?
                                                `${mutation.start_line}-${mutation.end_line}` :
                                                mutation.start_line
                                        }
                                    </TableCell>
                                    <TableCell>
                                        <Link to={`mutant/${mutation.id}/`}>
                                            <IconButton
                                                disabled={currentlyViewing == mutation.id}
                                            >
                                                <FileOpen></FileOpen>
                                            </IconButton>
                                        </Link>
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


