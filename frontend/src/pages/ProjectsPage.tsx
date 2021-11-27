import * as React from "react";
import {Avatar, Box, Grid, IconButton, List, ListItem, ListItemAvatar, ListItemText, Typography} from "@mui/material";
import {Folder} from "@mui/icons-material";
import {Project} from "../types/Project";
import {Link} from "react-router-dom";

type ProjectsSate = {
    projects: Project[]
}

export default class ProjectsPage extends React.Component<any, ProjectsSate> {
    constructor(props: any) {
        super(props);
        this.state = {
            projects: []
        }
    }
    
    componentDidMount() {
        fetch('/api/v1/projects/')
            .then(res => res.json())
            .then(res => this.setState({
                projects: res
            }))
    }

    render = () =>
        <>
            <Box sx={{flexGrow: 1, maxWidth: 752}}>
                <Grid container spacing={2}>
                    <Grid item xs={12} md={6}>
                        <Typography sx={{mt: 4, mb: 2}} variant="h6" component="div">
                            List of Projects
                        </Typography>
                        <List>
                            { this.state.projects.map((project: Project, i: React.Key) =>
                                <ListItem component={Link} to={`/project/${project.id}`} key={i}>
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
    ;
}