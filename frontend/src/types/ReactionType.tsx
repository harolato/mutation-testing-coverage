import {User} from "./UserType";

export enum ReactionResultType {
    L = "Like",
    D = "Dislike",
    I = "Ignore"
}

export type ReactionType = {
    entity_type: string,
    entity_id: number,
    result: "L" | "D" | "I"
    created_at: Date,
    user: User
}