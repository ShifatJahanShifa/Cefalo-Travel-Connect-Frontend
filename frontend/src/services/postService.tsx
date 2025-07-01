import type { Post, getPost } from "../types/posts/post";
import api from '../api'


export const createPost = async (
    post: Omit<Post, "post_id" | "createdAt">
    ): Promise<Post> => {
    const token="eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VybmFtZSI6InVzZXIzIiwiZW1haWwiOiJ0aGlyZEBnbWFpbC5jb20iLCJyb2xlIjoidHJhdmVsbGVyIiwiaWF0IjoxNzUxMzU2NzIxLCJleHAiOjE3NTEzNjAzMjF9.MZlGeWyixM87bDYKnitlwyC08B_yFCganVNS44zIcGw"
    
    const config = {
        headers: {
        Authorization: `Bearer ${token}`,
        },
    };
    
    console.log('token', config.headers.Authorization)
    const response = await api.post("/posts", post, config);
    return response.data;
};



export const getAllPosts = async (): Promise<getPost[]> => {
    try {
        const token="eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VybmFtZSI6InVzZXIzIiwiZW1haWwiOiJ0aGlyZEBnbWFpbC5jb20iLCJyb2xlIjoidHJhdmVsbGVyIiwiaWF0IjoxNzUxMzU2NzIxLCJleHAiOjE3NTEzNjAzMjF9.MZlGeWyixM87bDYKnitlwyC08B_yFCganVNS44zIcGw"
        const page=1, limit=5
        const config = {
            headers: {
            Authorization: `Bearer ${token}`,
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
