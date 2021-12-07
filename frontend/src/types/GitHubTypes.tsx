
export type Repository = {
    id: number,
    owner: string,
    name: string,
    full_name: string,
    exists: boolean
}

export type GithubUser = {
    login: string,
    id: number,
    avatar_url: string,
    url: string,
    html_url: string,
    name: string,
}