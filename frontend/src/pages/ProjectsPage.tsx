import * as React from "react";
import {Avatar, Box, Grid, IconButton, List, ListItem, ListItemAvatar, ListItemText, Typography} from "@mui/material";
import {Folder} from "@mui/icons-material";
import {Project} from "../types/Project";
import {Link, useParams} from "react-router-dom";
import {useEffect, useState} from "react";
import {RouteParams} from "../components/Routes";

type ProjectsSate = {
    projects: Project[]
}

const ProjectsPage = () => {

    let initialState:ProjectsSate = {
            projects: []
        };
    const [state, setState] = useState<ProjectsSate>(initialState);
    let {projectId} = useParams()
    
    useEffect(() => {
        fetch('/api/v1/projects/')
            .then(res => res.json())
            .then(res => setState({
                projects: res
            }))
    }, [])

    return(
        <>
            <Box sx={{flexGrow: 1, maxWidth: 752}}>
                <Grid container spacing={2}>
                    <Grid item xs={12} md={6}>
                        <Typography sx={{mt: 4, mb: 2}} variant="h6" component="div">
                            List of Projects
                        </Typography>
                        <List>
                            { state.projects.map((project: Project, i: React.Key) =>
                                <ListItem component={Link} to={`/projects/${project.id}`} key={i}>
                                <ListItemAvatar>
                                    <Avatar>
                                        <Folder/>
                                    </Avatar>
                                </ListItemAvatar>
                                <ListItemText
                                    primary={project.name}
                                    secondary={project.description}
                                />
                            </ListItem>)}

                        </List>
                    </Grid>
                </Grid>
            </Box>
        </>
    );
}
export default ProjectsPage