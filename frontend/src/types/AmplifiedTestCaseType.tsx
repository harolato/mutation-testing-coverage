import {SourceCode} from "./SourceCode";

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
    original_test: {
        testname: string;
        test_fullname: string;
        source_code?: SourceCode | null;
    };
}