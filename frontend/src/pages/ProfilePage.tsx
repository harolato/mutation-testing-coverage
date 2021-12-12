import React from "react";
import {Avatar, Box, Button, FormControl, LinearProgress, Link, TextField, Typography} from "@mui/material";
import {useGlobalState} from "../providers/GlobalStateProvider";
import {useEffect, useState} from "react";
import {UserProfile} from "../types/UserType";
import {GithubUser} from "../types/GitHubTypes";
import Cookies from 'js-cookie';
import {useLoading} from "../providers/LoadingStateProvider";

const ProfilePage = () => {

    const [state, dispatch] = useGlobalState();
    const {loading, setLoading} = useLoading();
    const [githubUser, setGithubUser] = useState<GithubUser>(null)

    const [accessTokenValue, setAccessTokenValue] = useState("");

    const handleFetchErrors = (response: Response) => {
        if (!response.ok) {
            return Promise.reject(response);
        }
        return response.json();
    }

    const catchError = (response: any) => {
        response.json().then((json: any) => {
            dispatch({
                ...state,
                notification_toast: {
                    open: true,
                    type: 'error',
                    message: json.error
                }
            });
        })
    }



    useEffect(() => {
        if (state.user != null && state.user.user_profile && state.user.user_profile.access_token) {
            fetch('/github_api/v1/user/')
                .then(handleFetchErrors)
                .then((user: GithubUser) => {
                    setGithubUser(user)
                })
                .catch(catchError);
        }
    }, [state.user])

    const updateProfile = (data: UserProfile) => {
        fetch('/api/v1/profile/', {
            method: 'PUT',
            body: JSON.stringify(data),
            headers: {
                'X-CSRFToken': Cookies.get('csrftoken'),
                'Content-Type': 'application/json'
            }
        })
            .then(handleFetchErrors)
            .then((res: UserProfile) => {
                dispatch({
                    ...state,
                    user: {
                        ...state.user,
                        user_profile: res
                    }
                })
            })
            .catch(catchError)
    }

    const disconnectGHAccount = () => {
        updateProfile({
            access_token: ''
        });
        setGithubUser(null);
    }

    const connectGHAccount = () => {
        setAccessTokenValue("")
        updateProfile({access_token: accessTokenValue})
    }

    const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setAccessTokenValue(event.target.value);
    };

    let github_profile = <><Box>
        <Typography variant={"h4"}>
            Add GitHub Personal Access Token
        </Typography>
        <FormControl>
            <TextField
                onChange={handleChange}
                value={accessTokenValue}
                label={"Github Personal Access Token"}
            />
            <Button variant={"contained"} onClick={() => connectGHAccount()}>Save</Button>
        </FormControl>
    </Box></>

    if (loading) {
        return (<LinearProgress/>);
    } else {
        if (githubUser) {
            github_profile = <>
                <Typography variant={"h4"}>Connected GitHub Account</Typography>
                <Typography>Name: {githubUser.name}</Typography>
                <Typography>Avatar:</Typography> <Avatar variant={"rounded"} src={githubUser.avatar_url}/>
                <Typography><Link target={"_blank"} href={githubUser.html_url}>{githubUser.login}</Link></Typography>
                <Button variant={"contained"} color={"error"} onClick={() => disconnectGHAccount()}>Disconnect
                    Account</Button>
            </>
        }
    }

    if ( !state.user ) {
        return null;
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
