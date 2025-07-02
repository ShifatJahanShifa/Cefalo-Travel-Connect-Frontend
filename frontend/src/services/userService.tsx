import api from '../api'
import type { getUser, updateUserInfo } from '../types/user';
import type { getPost } from '../types/post';

export const getUserByUsername = async (username: string): Promise<getUser> => {
    try {
        const accessToken = localStorage.getItem("accessToken") 
        const config = {
            headers: {
                Authorization: `Bearer ${accessToken}`,
            },
        };
        const response = await api.get(`/users/${username}`, config);
        return response.data;

    }
    catch (error: any) 
    {
        console.error("Error getting user:", error);
        throw new Error(error?.response?.data?.message || "Failed to get user");
    }
};


export const updateUser = async (username: string, data: updateUserInfo): Promise<getUser> => {
    try {
        const accessToken = localStorage.getItem("accessToken") 
        const config = {
            headers: {
                Authorization: `Bearer ${accessToken}`,
            },
        };
        const response = await api.patch(`/users/${username}`, data, config);
        return response.data;

    }
    catch (error: any) 
    {
        console.error("Error updating user:", error);
        throw new Error(error?.response?.data?.message || "Failed to update user");
    }
};


export const getPostsByUsername = async (username: string): Promise<getPost[]> => {
    try {
        const accessToken = localStorage.getItem("accessToken") 
        const config = {
            headers: {
                Authorization: `Bearer ${accessToken}`,
            },
        };
        const response = await api.get(`/users/${username}/posts`, config);
        return response.data;

    }
    catch (error: any) 
    {
        console.error("Error getting user's posts:", error);
        throw new Error(error?.response?.data?.message || "Failed to get user's posts");
    }
};