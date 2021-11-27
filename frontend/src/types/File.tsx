import {Mutation} from "./Mutation";
import {Job} from "./Job";

export type File = {
    id: number;
    job: number | Job;
    path: string;
    hash: Date;
    created_at: Date;
    updated_at: Date;
    mutations: Mutation[]
}
