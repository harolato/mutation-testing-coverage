import {Mutation} from "./Mutation";

export type File = {
    id: number;
    path: string;
    hash: Date;
    created_at: Date;
    updated_at: Date;
    mutations: Mutation[]
}
