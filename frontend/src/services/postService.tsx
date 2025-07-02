import type { Post, getPost } from "../types/post";
import api from '../api'
import { useAuth } from "../hooks/useAuth";

export const createPost = async (
    post: Omit<Post, "post_id" | "createdAt">
    ): Promise<Post> => {

    try {
        // const { accessToken } = useAuth() 
        const accessToken = localStorage.getItem("accessToken")
    // const token="eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VybmFtZSI6InVzZXIzIiwiZW1haWwiOiJ0aGlyZEBnbWFpbC5jb20iLCJyb2xlIjoidHJhdmVsbGVyIiwiaWF0IjoxNzUxMzU2NzIxLCJleHAiOjE3NTEzNjAzMjF9.MZlGeWyixM87bDYKnitlwyC08B_yFCganVNS44zIcGw"
    
        const config = {
            headers: {
            Authorization: `Bearer ${accessToken}`,
            },
        };
        
        console.log('token', config.headers.Authorization)
        const response = await api.post("/posts", post, config);
        return response.data;
    }
    catch(error: any) 
    {
        console.error("Error creating posts:", error);
        throw new Error(error?.response?.data?.message || "Failed to create posts");
    }
};



export const getAllPosts = async (): Promise<getPost[]> => {
    
    try {
        const accessToken = localStorage.getItem("accessToken")
        // const token="eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VybmFtZSI6InVzZXIzIiwiZW1haWwiOiJ0aGlyZEBnbWFpbC5jb20iLCJyb2xlIjoidHJhdmVsbGVyIiwiaWF0IjoxNzUxMzU2NzIxLCJleHAiOjE3NTEzNjAzMjF9.MZlGeWyixM87bDYKnitlwyC08B_yFCganVNS44zIcGw"
        const page=1, limit=5
        const config = {
            headers: {
            Authorization: `Bearer ${accessToken}`,
            },
            params: {
            page,
            limit,
        },
        };
        const response = await api.get("/posts", config);
        
        return response.data; 
    } 
    catch (error: any) {
        console.error("Error fetching posts:", error);
        throw new Error(error?.response?.data?.message || "Failed to fetch posts");
    }
};
