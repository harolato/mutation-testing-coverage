import {File} from "./File";
import {SourceCode} from "./SourceCode";
import {ReactionType} from "./ReactionType";
import {MutantCoverageType} from "./MutantCoverageType";

export enum MutationResult {
    K = "Killed",
    S = "Survived",
    I = "Inconsistent"
}

export enum MutantStatusType {
    "None" = 0,
    "Fix" = 1,
    "Ignore" = 2
}

export type Mutation = {
    id: number | string;
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
    status: 0 | 1 | 2 | MutantStatusType,
    github_issue_comment_id: number,
    covered_by: MutantCoverageType[]
}


