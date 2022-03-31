import {Box, Button, ButtonGroup, Grid, Paper, styled, Tooltip, Typography} from "@mui/material";
import React from "react";
import {Mutation} from "../types/Mutation";
import {useGlobalState} from "../providers/GlobalStateProvider";
import {Link} from "react-router-dom";
import {AmplifiedTestCaseType} from "../types/AmplifiedTestCaseType";
import {MutantCoverageType} from "../types/MutantCoverageType";

type AmplifiedMethodsComponentPropsType = {
    mutant: Mutation
}

const Item = styled(Paper)(({theme}) => ({
    ...theme.typography.body2,
    padding: theme.spacing(1),
    textAlign: 'center',
    color: theme.palette.text.secondary,
}));

const AmplifiedMethodsComponent = (props: AmplifiedMethodsComponentPropsType) => {
    const [state, dispatch] = useGlobalState();
    if (props.mutant.covered_by.length == 0) {
        return (<Typography sx={{m: 3}}>Mutant Not covered by any test method</Typography>);
    }

    let renderTestList = (covered: MutantCoverageType[]) => {
        let amplified_tests_array: AmplifiedTestCaseType[] = [];
        let ids: number[] = [];
        covered.forEach((cov:MutantCoverageType) => {
            cov.amplified_tests.forEach((test:AmplifiedTestCaseType) => {
               if ( ids.indexOf(test.id) === -1 ) {
                   ids.push(test.id)
                   amplified_tests_array.push(test)
               }
            });
        })
        return amplified_tests_array
            .sort((testA:AmplifiedTestCaseType, testB:AmplifiedTestCaseType) => {
                if (testA.test_reference_name > testB.test_reference_name) {
                    return 1
                } else if (testA.test_reference_name < testB.test_reference_name) {
                    return -1
                }
                return 0
            })
            .map((amplified_test: AmplifiedTestCaseType) => (
            <>
                <Grid key={amplified_test.id} container direction="row"
                      justifyContent="flex-start"
                      alignItems="flex-start"
                      sx={{mb: 1}}
                >
                    <Grid item>
                        <Item>
                            <Link
                                to={`/amplified-test/${amplified_test.id}`}>
                                {amplified_test.test_reference_name}
                            </Link>
                        </Item>
                    </Grid>
                    <Grid item>
                        <Item>
                            <Typography>{amplified_test.original_test.testname}</Typography>
                        </Item>
                    </Grid>
                    <Grid item>
                        <Item>
                            <Typography>Killed mutants: {amplified_test.new_coverage.length}</Typography>
                        </Item>
                    </Grid>
                </Grid>
            </>
        ))
    }


    return (<>
        <Typography sx={{m: 3}}>Amplified Test Methods:</Typography>
        <Box sx={{mb: 5}}>
            {renderTestList(props.mutant.covered_by)}
        </Box>
    </>);
}
export default AmplifiedMethodsComponent

