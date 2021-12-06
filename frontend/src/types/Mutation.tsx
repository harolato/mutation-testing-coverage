import {File} from "./File";
import {SourceCode} from "./SourceCode";
import {LikeStatus} from "./LikeStatusType";

export enum MutationResult {
    K = "Killed",
    S = "Survived",
    I = "Inconsistent"
}

export type Mutation = {
    id: number;
    file: number | File;
    sequence_number: number;
    description: string;
    created_at: Date;
    updated_at: Date;
    start_line: number;
    end_line: number;
    mutated_source_code: string;
    source_code: SourceCode;
    result: "K" | "S" | "I",
    like_status?: LikeStatus
}


