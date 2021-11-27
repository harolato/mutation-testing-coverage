import * as React from "react";
import {Route} from "react-router-dom";
import ProjectsPage from "../pages/ProjectsPage";
import ProfilePage from "../pages/ProfilePage";
import ProjectPage from "../pages/ProjectPage";
import JobPage from "../pages/JobPage";
import FilePage from "../pages/FilePage";

export default class PageRoutes extends React.Component<any, any> {
    render = () =>
        <>
            <Route exact path="/" component={ProjectsPage}/>
            <Route exact path={"/projects"} component={ProjectsPage}/>
            <Route exact path={"/project/:projectId"} component={ProjectPage}/>
            <Route exact path={"/project/:projectId/job/:jobId"} component={JobPage}/>
            <Route exact path={"/project/:projectId/job/:jobId/file/:fileId"} component={FilePage}/>
            <Route exact path={"/settings"} component={ProfilePage}/>
        </>
    ;
}
