import {SourceCode} from "./SourceCode";
import {User} from "./UserType";

export type AmplifiedTestCaseType = {
    id: number;
    project_id: number;
    source_code: SourceCode;
    created_at: Date;
    test_name: string;
    test_reference_name: string;
    file_path: string;
    start_line: number;
    end_line: number;
    new_coverage: [];
    evaluation_workflow_data: any;
    evaluation_workflow_uuid: any;
    pull_request_created_by_id: number;
    pull_request_data: any;
    pull_request_id: number;
    original_test: {
        testname: string;
        test_fullname: string;
        source_code?: SourceCode | null;
    };
}