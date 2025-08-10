export interface signup {
    username: string 
    email: string 
    password: string 
}

export interface signin {
    email: string 
    password: string 
}

export interface authResponse {
    user_id: string
    username: string
    email: string
    role: string
    accessToken: string
    refreshToken: string
}