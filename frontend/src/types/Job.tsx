import {File} from './File';

export type Job = {
    id: number;
    git_commit_sha: string;
    service_job_id: number;
    service_name: string;
    test_cases: string[];
    created_at: Date
    files: File[]
}