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

type MutationsViewProps = {
    mutations: Mutation[]
    onMutationSelected: any
}

export default class MutationsView extends React.Component<MutationsViewProps, any> {
    constructor(props: any) {
        super(props);
        this.handleChooseMutation = this.handleChooseMutation.bind(this);
    }

    handleChooseMutation(mutation: Mutation) {
        this.props.onMutationSelected(mutation);
    }

    render = () =>
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
                            this.props.mutations.map((mutation) =>
                                <TableRow key={mutation.id} className={"mutation-view"}>
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
                                        <div onClick={(e) => this.handleChooseMutation(mutation)}>
                                            <IconButton>
                                                <FileOpen></FileOpen>
                                            </IconButton>
                                        </div>
                                    </TableCell>
                                </TableRow>
                            )
                        }
                    </TableBody>
                </Table>
            </TableContainer>

        </div>
    ;
}
