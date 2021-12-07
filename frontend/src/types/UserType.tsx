export type User = {
    id: number,
    username: string,
    first_name: string,
    last_name: string,
    email: string,
    date_joined: Date,
    last_login: Date,
    user_profile: UserProfile
}

export type UserProfile = {
    access_token: boolean
}