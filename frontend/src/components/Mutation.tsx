import * as React from "react";

type MutationProps = {
    data: any
}
export default class Mutation extends React.Component<MutationProps, any>{
    constructor(props:any) {
        super(props);
    }
    render = () =>
        <div className={"mutation-view"}>
            <p>Description: {this.props.data.description}</p>
            <p>Result: {this.props.data.result}</p>
            <p>Source: {this.props.data.mutated_source_code}</p>
        </div>
    ;

}