import {Box, Button, ButtonGroup, Grid, Link, Paper, styled, Typography} from "@mui/material";
import React from "react";
import {Mutation} from "../types/Mutation";
import {useGlobalState} from "../providers/GlobalStateProvider";

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

    return (<>
        <Typography sx={{m: 3}}>Amplified Test Methods:</Typography>
        <Box sx={{mb: 5}}>
            {props.mutant.covered_by.map(covered => (
                <Grid key={covered.id} container direction="row"
                      justifyContent="flex-start"
                      alignItems="flex-start"
                      sx={{mb: 1}}
                >
                    <Grid item xs={3}>
                        <Item>
                            <Link
                                target={"_blank"}
                                href={`https://github.com/${state.project.git_repo_owner}/${state.project.git_repo_name}/tree/${state.job.git_commit_sha}/${covered.file}#L${covered.line}`}>
                                {covered.test_method_name}
                            </Link>
                        </Item>
                    </Grid>
                    <Grid item xs={3}>
                        <Item>
                            <ButtonGroup variant="contained" aria-label="outlined primary button group">
                                <Button
                                    color={(covered.level >= 1 ? "success" : "primary")}
                                    disableElevation disableFocusRipple disableTouchRipple
                                />
                                <Button
                                    color={(covered.level >= 2 ? "success" : "primary")}
                                    disableElevation disableFocusRipple disableTouchRipple
                                />
                                <Button
                                    color={(covered.level >= 3 ? "success" : "primary")}
                                    disableElevation disableFocusRipple disableTouchRipple
                                />
                            </ButtonGroup>
                        </Item>
                    </Grid>
                </Grid>
            ))}
        </Box>
    </>);
}
export default AmplifiedMethodsComponent

