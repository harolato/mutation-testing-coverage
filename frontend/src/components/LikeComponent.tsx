import * as React from "react";
import {useEffect, useState} from "react";
import {Mutation} from "../types/Mutation";

type LikeComponentProps = {
    mutant: Mutation
}
type LikeComponentState = {

}


const LikeComponent = (props: LikeComponentProps) => {

    let initialState = {};

    const [state, setState] = useState<LikeComponentState>(initialState);

    useEffect(() => {

    }, []);

    return (
        <div>

        </div>
    );
}
export default LikeComponent