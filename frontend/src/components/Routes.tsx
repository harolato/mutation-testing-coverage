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
            <Route path={"/projects"} component={ProjectsPage}/>
            <Route path={"/project/:projectId"} component={ProjectPage}/>
            <Route path={"/job/:jobId"} component={JobPage}/>
            <Route path={"/file/:fileId"} component={FilePage}/>
            <Route path={"/settings"} component={ProfilePage}/>
        </>
    ;
}
