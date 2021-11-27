export enum MutationResult {
    Killed = "K",
    Survived = "S",
    Inconsistent = "I"
}

export type Mutation = {
    id: number;
    sequence_number: number;
    description: string;
    created_at: Date;
    updated_at: Date;
    start_line: number;
    end_line: number;
    mutated_source_code: string;
    result: MutationResult
}
