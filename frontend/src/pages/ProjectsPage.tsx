import React from "react";
import {
    Avatar,
    Box, Button,
    Fab, FormControl,
    Grid, InputLabel,
    List,
    ListItem,
    ListItemAvatar,
    ListItemText, MenuItem, Modal, Select,
    Typography
} from "@mui/material";
import {Add, Folder} from "@mui/icons-material";
import {Project} from "../types/Project";
import {Link, useParams} from "react-router-dom";
import {useEffect, useState} from "react";
import {Repository} from "../types/GitHubTypes";

type ProjectsSate = {
    projects: Project[]
    repositories: Repository[]
}

const ProjectsPage = () => {

    let initialState: ProjectsSate = {
        projects: [],
        repositories: []
    };
    const [state, setState] = useState<ProjectsSate>(initialState);
    const [repository, setRepository] = useState('')
    const [open, setOpen] = useState(false);
    let {projectId} = useParams()

    useEffect(() => {
        fetch('/api/v1/projects/')
            .then(res => res.json())
            .then(res => setState({
                ...state,
                projects: res
            }))
    }, [])

    const addNewProjectOpen = () => {
        if (state.repositories.length <= 0) {
            fetch('/github_api/v1/repositories/')
                .then(res => res.json())
                .then(res => setState({
                    ...state,
                    repositories: res
                }))
        }
        setOpen(true);
    }

    const style = {
        position: 'absolute' as 'absolute',
        top: '50%',
        left: '50%',
        transform: 'translate(-50%, -50%)',
        width: 400,
        bgcolor: 'background.paper',
        border: '2px solid #000',
        boxShadow: 24,
        p: 4,
    };

    const handleClose = () => setOpen(false);

    return (
        <>
            <Box sx={{flexGrow: 1, maxWidth: 752}}>
                <Grid container spacing={2}>
                    <Grid item xs={12} md={6}>
                        <Typography sx={{mt: 4, mb: 2}} variant="h6" component="div">
                            List of Projects
                        </Typography>
                        <List>
                            {state.projects.map((project: Project, i: React.Key) =>
                                <ListItem component={Link} to={`/projects/${project.id}/`} key={i}>
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
                <Fab onClick={addNewProjectOpen} color="primary" aria-label="add">
                    <Add/>
                </Fab>
            </Box>
            <Modal
                open={open}
                onClose={handleClose}
                aria-labelledby="modal-modal-title"
                aria-describedby="modal-modal-description"
            >
                <Box sx={style}>
                    <Typography>Create New Project from Github Repository</Typography>
                    <FormControl fullWidth>
                        <InputLabel id="repo-select-label">Choose Repository</InputLabel>
                        <Select
                            labelId="repo-select-label"
                            id="repo-select"
                            label="Repository"
                            value={repository}
                            onChange={(event) => {
                                setRepository(event.target.value as string)
                            }}
                        >
                            {state.repositories.map((repo) =>
                                <MenuItem disabled={repo.exists} key={repo.id}
                                          value={repo.full_name}>{repo.full_name}</MenuItem>
                            )}
                        </Select>
                    </FormControl>
                    <Button sx={{
                        mt: 5
                    }} variant={"contained"}>Create New Project</Button>
                </Box>
            </Modal>
        </>
    );
}
export default ProjectsPage