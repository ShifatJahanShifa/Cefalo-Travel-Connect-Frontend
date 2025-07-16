import api from '../api'
import type { getUser, updateUserInfo } from '../types/user';
import type { getPost } from '../types/post';
import { getAuthConfig } from '../utils/authConfig';
import type { getWishlistType } from '../types/wishlist';
import type { travelPlanOutput } from '../types/travelplan';
import type { notification } from '../types/notification';

export const getUserByUsername = async (username: string): Promise<getUser> => {
    try {
        const response = await api.get(`/users/${username}`, getAuthConfig());
        return response.data;

    }
    catch (error: any) 
    {
        // console.error("Error getting user:", error);
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
        // console.error("Error updating user:", error);
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
        // console.error("Error getting user's posts:", error);
        throw new Error(error?.response?.data?.message || "Failed to get user's posts");
    }
};


export const getWishlistsByUsername = async (username: string): Promise<getWishlistType[]> => {
    try {

        const response = await api.get(`/users/${username}/wishlists`, getAuthConfig());
        return response.data;

    }
    catch (error: any) 
    {
        // console.error("Error getting user's posts:", error);
        throw new Error(error?.response?.data?.message || "Failed to get user's posts");
    }
};



export const getTravelPlansByUsername = async (username: string): Promise<travelPlanOutput[]> => {
    try {

        const response = await api.get(`/users/${username}/travelplans`, getAuthConfig());
        return response.data;

    }
    catch (error: any) 
    {
        // console.error("Error getting user's travelplans:", error);
        throw new Error(error?.response?.data?.message || "Failed to get user's travelplans");
    }
};


export const getNotificationsByUsername = async (username: string): Promise<notification[]> => {
    try {

        const response = await api.get(`/users/${username}/notifications`, getAuthConfig());
        return response.data;

    }
    catch (error: any) 
    {
        // console.error("Error getting user's notifications:", error);
        throw new Error(error?.response?.data?.message || "Failed to get user's notifications");
    }
};


export const deleteUser = async (username: string): Promise<void> => {
    try {
        const response = await api.delete(`/users/${username}`, getAuthConfig());
        return response.data;

    }
    catch (error: any) 
    {
        // console.error("Error deleting user:", error);
        throw new Error(error?.response?.data?.message || "Failed to delete user");
    }
};


export const getAllUsers = async (): Promise<getUser[]> => {
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
        const response = await api.get(`/users`, config);
        return response.data;

    }
    catch (error: any) 
    {
        // console.error("Error fetching users:", error);
        throw new Error(error?.response?.data?.message || "Failed to fetch user");
    }
};