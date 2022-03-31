import {AmplifiedTestCaseType} from "./AmplifiedTestCaseType";

export enum MutantCoverageLevelType {
    "Method Covered" = 1,
    "Node Covered" = 2,
    "Infected" = 3,
    "Propagated" = 4,
    "Revealed" = 5
}

export type MutantCoverageType = {
    id: number;
    test_method_name: string;
    file: string;
    line?: number;
    level: 1 | 2 | 3 | 4 | 5 | MutantCoverageLevelType,
    amplified_tests: AmplifiedTestCaseType[]
}
