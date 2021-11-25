import * as React from "react";
import Layout from "./Layout";
import ProjectsPage from "./Pages/ProjectsPage";

type Project = {
    name: string;
    description: string;
    created_at: Date;
    updated_at: Date;
    git_repo_owner: string;
    git_repo_name: string;
    id: number;
}

interface ProjectsState {
    projects: Project[];
}

export default class HomePage extends React.Component<any, ProjectsState> {

    constructor(props: any) {
        super(props);
    }


    render = () =>
        <>
            <Layout>
                <ProjectsPage></ProjectsPage>
            </Layout>
        </>
    ;
}