import api from '../api'
import type { getUser, updateUserInfo } from '../types/user';
import type { getPost } from '../types/post';
import { getAuthConfig } from '../utils/authConfig';
import type { getWishlistType } from '../types/wishlist';

export const getUserByUsername = async (username: string): Promise<getUser> => {
    try {
        const response = await api.get(`/users/${username}`, getAuthConfig());
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
        
        const response = await api.patch(`/users/${username}`, data, getAuthConfig());
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
       
        const response = await api.get(`/users/${username}/posts`, getAuthConfig());
        return response.data;

    }
    catch (error: any) 
    {
        console.error("Error getting user's posts:", error);
        throw new Error(error?.response?.data?.message || "Failed to get user's posts");
    }
};


export const getWishlistsByUsername = async (username: string): Promise<getWishlistType[]> => {
    try {

        const response = await api.get(`/users/${username}/wishlists`, getAuthConfig());
        console.log('wishlist',response.data)
        return response.data;

    }
    catch (error: any) 
    {
        console.error("Error getting user's posts:", error);
        throw new Error(error?.response?.data?.message || "Failed to get user's posts");
    }
};
