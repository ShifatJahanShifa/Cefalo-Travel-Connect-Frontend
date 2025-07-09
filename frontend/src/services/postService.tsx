import type { Post, getPost } from "../types/post";
import api from '../api';
import { getAuthConfig } from "../utils/authConfig";

export const createPost = async (post: Omit<Post, "post_id" | "createdAt">): Promise<boolean> => {
    try {
        const response = await api.post("/posts", post, getAuthConfig());
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
        const page=1, limit=50
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
    catch (error: any) 
    {
        console.error("Error fetching posts:", error);
        throw new Error(error?.response?.data?.message || "Failed to fetch posts");
    }
};


export const getPostByPostId = async (post_id: string): Promise<getPost> => {
    try {
        const response = await api.get(`/posts/${post_id}`, getAuthConfig());
        return response.data;
    }
    catch (error: any) 
    {
        console.error("Error fetching post:", error);
        throw new Error(error?.response?.data?.message || "Failed to fetch post");
    }
};


export const updatePost = async (post_id: string, data: getPost): Promise<string> => {
    try {
        const response = await api.patch(`/posts/${post_id}`, data, getAuthConfig())
        return response.data
    }
    catch (error: any) 
    {
        console.error("Error updating post:", error);
        throw new Error(error?.response?.data?.message || "Failed to update post");
    }
    
};


export const deletePost = async (post_id: string): Promise<void> => {
    try {
        await api.delete(`/posts/${post_id}`, getAuthConfig())
    }
    catch (error: any) 
    {
        console.error("Error deleting posts:", error);
        throw new Error(error?.response?.data?.message || "Failed to delete posts");
    }
}


export const togglePostlike = async (postId: string): Promise<string> => {
    try {
        const response = await api.post(`/posts/${postId}/like`, {}, getAuthConfig());
        return response.data;
    }
    catch (error: any) 
    {
        console.error("Error liking posts:", error);
        throw new Error(error?.response?.data?.message || "Failed to like posts");
    }
};


export const getFilteredPosts = async (filters: {transport_type?: string; place_name?: string; accommodation_type?: string;}): Promise<getPost[]> => {
    try {
    const accessToken = localStorage.getItem("accessToken");

    const config = {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
      withCredentials: true,
      params: filters, 
    };

    const response = await api.get("/posts/search", config); // backend endpoint
    return response.data;
  } catch (error: any) {
    console.error("Error fetching posts:", error);
    throw new Error(error?.response?.data?.message || "Failed to fetch posts");
  }
};
