import * as React from "react";
import {Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Typography} from "@mui/material";
import {File} from "../types/File";
import {Mutation} from "../types/Mutation";

type FileState = {
    file: File
}


class FilePage extends React.Component<any, FileState> {

    constructor(props:any) {
        super(props);
        this.state = {
            file: null
        }
    }

    componentDidMount() {
        fetch(`/api/v1/files/${this.props.match.params.fileId}/`)
            .then(res => res.json())
            .then(res => this.setState({
                file: res
            }))
    }


    render = () =>
        <>
            <Typography>Recent builds</Typography>
            <TableContainer component={Paper}>
                <Table>
                    <TableHead>
                        <TableRow>
                            <TableCell>ID</TableCell>
                            <TableCell>Description</TableCell>
                            <TableCell>Sourcecode</TableCell>
                            <TableCell>Lines</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {this.state.file != null ?this.state.file.mutations.map((mutation: Mutation) =>
                            <TableRow key={mutation.id}>
                                <TableCell>{mutation.id}</TableCell>
                                <TableCell>{mutation.description}</TableCell>
                                <TableCell>{mutation.mutated_source_code}</TableCell>
                                <TableCell>{mutation.start_line} - {mutation.end_line}</TableCell>
                            </TableRow>
                        ) : <></>}
                    </TableBody>
                </Table>
            </TableContainer>
        </>
    ;
}

export default FilePage;
