import {Mutation} from "./Mutation";
import {Job} from "./Job";
import {SourceCode} from "./SourceCode";

export type File = {
    id: number;
    job: number | Job;
    path: string;
    hash: Date;
    created_at: Date;
    updated_at: Date;
    source_code?: SourceCode;
    mutations: Mutation[]
    total_mutations: number
}
