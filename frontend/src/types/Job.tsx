import {File} from './File';
import {Project} from "./Project";

export type Job = {
    id: number;
    project: number | Project;
    git_commit_sha: string;
    service_job_id: number;
    service_name: string;
    test_cases: string[];
    created_at: Date
    files: File[]
}