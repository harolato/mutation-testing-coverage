import * as React from "react";
import {Avatar, Box, Button, FormControl, Link, TextField, Typography} from "@mui/material";
import {useGlobalState} from "../providers/GlobalStateProvider";
import {useEffect, useState} from "react";
import {User} from "../types/UserType";
import {GithubUser} from "../types/GitHubTypes";
import {AddLink} from "@mui/icons-material";
import {Simulate} from "react-dom/test-utils";
import error = Simulate.error;

const ProfilePage = () => {

    const [state, dispatch] = useGlobalState();

    const [githubUser, setGithubUser] = useState<GithubUser>(null)

    useEffect(() => {
        if (state.user != null && state.user.user_profile) {
            fetch('/github_api/v1/user/')
                .then(res => res.json())
                .then((user: GithubUser) => {
                    setGithubUser(user)
                });
        }
    }, [state.user])

    let github_profile = <></>

    if (state.loading) {
        return (<>Loading</>);
    } else {
        if (state.user != null && state.user.user_profile != null && !state.user.user_profile.access_token) {
            github_profile = <><Box>
                <Typography variant={"h4"}>
                    GitHub Access Token
                </Typography>
                <FormControl>
                    <TextField
                        label={"Github Personal Access Token"}
                    />
                </FormControl>
            </Box></>
        } else {
            if (githubUser) {
                github_profile = <>
                    <Typography variant={"h4"}>Connected GitHub Account</Typography>
                    <Typography>Name: {githubUser.name}</Typography>
                    <Typography>Avatar:</Typography> <Avatar variant={"rounded"} src={githubUser.avatar_url}/>
                    <Typography><Link target={"_blank"} href={githubUser.html_url}>{githubUser.login}</Link></Typography>
                    <Button variant={"contained"} color={"error"}>Disconnect Account</Button>
                </>
            }
        }
    }

    return (
        <>
            <Box sx={{mb: 5}}>
                <Typography variant={"h4"}>Hello {state.user.username}</Typography>
                <Typography>Last Login: {state.user.last_login}</Typography>
                <Typography>First Name: {state.user.first_name}</Typography>
                <Typography>Last Name: {state.user.last_name}</Typography>
                <Typography>Email: {state.user.email}</Typography>
            </Box>
            {github_profile}
        </>
    );
}

export default ProfilePage
