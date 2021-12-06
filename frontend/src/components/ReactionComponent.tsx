import * as React from "react";
import {useEffect, useState} from "react";
import {Mutation} from "../types/Mutation";
import {Button, ButtonGroup} from "@mui/material";

type ReactionComponentProps = {
    mutant: Mutation
}
type ReactionComponentState = {}


const ReactionComponent = (props: ReactionComponentProps) => {

    let initialState = {};

    const [state, setState] = useState<ReactionComponentState>(initialState);

    useEffect(() => {

    }, []);

    return (
        <>
            <ButtonGroup variant="outlined" aria-label="outlined primary button group">
                <Button>Like</Button>
                <Button>Ignore</Button>
                <Button>Dislike</Button>
            </ButtonGroup>
        </>
    );
}
export default ReactionComponent