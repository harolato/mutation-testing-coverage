import * as React from "react";
import * as _ from "lodash";
import Mutation from "./Mutation";

type MutationsViewProps = {
    mutations: any
}

export default class MutationsView extends React.Component<MutationsViewProps, any>{
    private mutations_elements: any;
    constructor(props:any) {
        super(props);
        this.mutations_elements = _.map(this.props.mutations, (mutation) => {
            return <Mutation key={mutation.id} data={mutation}/>;
        });
    }
    render = () =>
        <div className={"mutation-view"}>
            {this.mutations_elements}
        </div>
    ;

}