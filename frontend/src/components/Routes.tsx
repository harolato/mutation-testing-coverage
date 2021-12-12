import React from "react";
import {Route, Routes} from "react-router-dom";
import ProjectsPage from "../pages/ProjectsPage";
import ProfilePage from "../pages/ProfilePage";
import ProjectPage from "../pages/ProjectPage";
import JobPage from "../pages/JobPage";
import FilePage from "../pages/FilePage";
import MutantPage from "../pages/MutantPage";

export default class PageRoutes extends React.Component<any, any> {
    render = () =>
        <>
            <Routes>
                <Route path="/" element={<ProjectsPage/>}/>
                <Route path={"/projects/"} element={<ProjectsPage/>}/>
                <Route path={"/projects/:projectId/"} element={<ProjectPage/>}/>
                <Route path={"/projects/:projectId/jobs/:jobId/"} element={<JobPage/>}/>
                <Route path={"/projects/:projectId/jobs/:jobId/files/:fileId/"} element={<FilePage/>}>
                    <Route path={"mutant/:mutantId/"} element={<MutantPage/>}/>
                </Route>
                <Route path={"/settings"} element={<ProfilePage/>}/>
            </Routes>
        </>
    ;
}

export type RouteParams = {
    jobId: number | null,
    projectId: number | null,
    fileId: number | null,
    mutantId: number | null,
}