export interface getUser {
    user_id: string
    username: string
    email: string
    role: string
    profile_picture_url: string
    bio: string
    phone_no?: string 
    created_at?: string
}

export type updateUserInfo = {
    profile_picture_url?: string;
    bio?: string;
    role?: string;
    hashed_password?: string;
}
