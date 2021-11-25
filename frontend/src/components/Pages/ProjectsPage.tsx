import * as React from "react";
import {Avatar, Box, Grid, IconButton, List, ListItem, ListItemAvatar, ListItemText, Typography} from "@mui/material";
import {Delete, Folder} from "@mui/icons-material";

export default class ProjectsPage extends React.Component<any, any> {
    private projects: any;

    constructor(props: any) {
        super(props);
        this.state = {
            projects: []
        }
    }
    
    componentDidMount() {
        fetch('/api/v1/projects')
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
                            { this.state.projects.map((project: {
                                description: string;
                                name: string ;
                                }, i: React.Key) =>
                                <ListItem button key={i}>
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