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
        let protocol = 'ws';
        if (location.protocol === 'https:') {
            protocol = 'wss'
        }
        let ws_url = `${protocol}://${window.location.host}`;
        const ws = new WebSocket(`${ws_url}/ws/notifications/`);
        ws.onopen = (event:Event) => {
            console.log('open', event)
        }
        ws.onclose = (event:Event) => {
            console.log('close', event)
        }
        ws.onmessage = (event:MessageEvent) => {
            const json_data = JSON.parse(event.data)?.content;
            console.log(json_data)
            if ( json_data.type === 'evaluation' ) {

                dispatch({
                    ...state,
                    evaluation_status : json_data
                });
            }
        }
        ws.onerror = (event:Event) => {
            console.log('error', event)
        }
    }, [])

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

    return (<></>);
}
export default LoadDataComponent