import type { Post, getPost } from "../types/post";
import api from '../api';
import { getAuthConfig } from "../utils/authConfig";
import { logger } from "../utils/logger";

export const createPost = async (post: Omit<Post, "post_id" | "createdAt">): Promise<boolean> => {
    try {
        const response = await api.post("/posts", post, getAuthConfig());
        return response.data;
    }
    catch(error: any) 
    {
        logger.error("Error creating post:", error);
        throw new Error(error?.response?.data?.message || "Failed to create post");
    }
};


export const getAllPosts = async (): Promise<getPost[]> => {
    try {
        const accessToken = localStorage.getItem("accessToken");
        const page=1, limit=50;
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
        logger.error("Error fetching posts:", error);
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
        logger.error("Error fetching post:", error);
        throw new Error(error?.response?.data?.message || "Failed to fetch post");
    }
};


export const updatePost = async (post_id: string, data: getPost): Promise<string> => {
    try {
        const response = await api.patch(`/posts/${post_id}`, data, getAuthConfig());
        return response.data;
    }
    catch (error: any) 
    {
        logger.error("Error updating post:", error);
        throw new Error(error?.response?.data?.message || "Failed to update post");
    }
    
};


export const deletePost = async (post_id: string): Promise<void> => {
    try {
        await api.delete(`/posts/${post_id}`, getAuthConfig());
    }
    catch (error: any) 
    {
        logger.error("Error deleting post:", error);
        throw new Error(error?.response?.data?.message || "Failed to delete post");
    }
}


export const togglePostlike = async (postId: string): Promise<string> => {
    try {
        const response = await api.post(`/posts/${postId}/like`, {}, getAuthConfig());
        return response.data;
    }
    catch (error: any) 
    {
        logger.error("Error liking post:", error);
        throw new Error(error?.response?.data?.message || "Failed to like post");
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

    const response = await api.get("/posts/search", config);
    return response.data;
    } 
    catch (error: any) {
        logger.error("Error fetching posts:", error);
        throw new Error(error?.response?.data?.message || "Failed to fetch posts");
    }
};
