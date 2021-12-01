import {Job} from "./Job";

export type Project = {
    id: number;
    name: string;
    description: string;
    created_at: Date;
    updated_at: Date;
    git_repo_owner: string;
    git_repo_name: string;
    jobs: Job[]
}
