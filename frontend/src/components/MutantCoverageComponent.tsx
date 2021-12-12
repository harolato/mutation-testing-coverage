import {Box, Button, ButtonGroup, Grid, Paper, styled, Typography} from "@mui/material";
import React from "react";
import {Mutation} from "../types/Mutation";

type MutantCoverageComponentPropsType = {
    mutant: Mutation
}

const Item = styled(Paper)(({theme}) => ({
    ...theme.typography.body2,
    padding: theme.spacing(1),
    textAlign: 'center',
    color: theme.palette.text.secondary,
}));

const MutantCoverageComponent = (props: MutantCoverageComponentPropsType) => {


    return (<>
        <Typography sx={{m: 3}}>Mutant Covered By:</Typography>
        <Box sx={{mb: 5}}>
            {props.mutant.covered_by.map(covered => (
                <>
                    <Grid container direction="row"
                          justifyContent="flex-start"
                          alignItems="flex-start"
                          sx={{mb:1}}
                    >
                        <Grid item xs={3}>
                            <Item>
                                {covered.test_method_name}
                            </Item>
                        </Grid>
                        <Grid item xs={3}>
                            <Item>
                                <ButtonGroup variant="contained" aria-label="outlined primary button group">
                                    <Button
                                        color={(covered.level >= 1 ? "success" : "primary")}
                                        disableElevation disableFocusRipple disableTouchRipple
                                    ></Button>
                                    <Button
                                        color={(covered.level >= 2 ? "success" : "primary")}
                                        disableElevation disableFocusRipple disableTouchRipple
                                    ></Button>
                                    <Button
                                        color={(covered.level >= 3 ? "success" : "primary")}
                                        disableElevation disableFocusRipple disableTouchRipple
                                    ></Button>
                                </ButtonGroup>
                            </Item>
                        </Grid>
                    </Grid>
                </>
            ))}
        </Box>
    </>);
}
export default MutantCoverageComponent

