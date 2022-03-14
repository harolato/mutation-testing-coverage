import React, {useEffect} from 'react';
import {useParams} from "react-router-dom";
import {useGlobalState} from "../providers/GlobalStateProvider";
import {useLoading} from "../providers/LoadingStateProvider";
import {GlobalStateType} from "../types/GlobalStateType";

const LoadDataComponent = () => {
    const [state, dispatch] = useGlobalState();
    const {loading, setLoading} = useLoading();
    let {fileId, projectId, jobId} = useParams();
    useEffect(() => {

        setLoading(true);
        Promise.all([
            projectId ? fetch(`/api/v1/projects/${projectId}/`) : Promise.resolve(null),
            fileId ? fetch(`/api/v1/files/${fileId}/`) : Promise.resolve(null),
            jobId ? fetch(`/api/v1/jobs/${jobId}/`) : Promise.resolve(null),
            !state.user ? fetch('/api/v1/user/') : Promise.resolve(null),
        ])
            .then(responses => Promise.all(responses.map((resp: Response) => {
                return resp ? resp.json() : null;
            })))
            .then(([project, file, job, user]) => {
                    let update: any = {};
                    if (project) {
                        update['project'] = project;
                    }
                    if (job) {
                        update['job'] = job;
                    }
                    if (file) {
                        update['file'] = file;
                    }
                    if (user) {
                        update['user'] = user;
                    }

                    dispatch((prevState: GlobalStateType) => {
                        return {
                            ...prevState,
                            ...update
                        };
                    });
                    setLoading(false);
                }
            );

    }, [fileId, projectId, jobId]);

    useEffect(() => {
        let ws_protocol = 'ws';
        if ( window.location.protocol === 'https:' ) {
            ws_protocol = 'wss'
        }
        const socket = new WebSocket(`${ws_protocol}://${window.location.host}/ws/notifications/`);
        socket.onmessage = (event) => {
            console.log(event);
        }
    }, []);

    return (<></>);
}
export default LoadDataComponent