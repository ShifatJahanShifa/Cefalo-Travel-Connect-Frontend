import api from "../api";
import type { wishlist, getWishlistType, groupedUsers } from "../types/wishlist";
import { getAuthConfig } from "../utils/authConfig";


export const createWishlist = async (data: wishlist): Promise<getWishlistType> => {
    try {
        const response = await api.post(`/wishlists`, data, getAuthConfig());
        return response.data;
    }
    catch (error: any) 
    {
        console.error("Error creating wishlist:", error);
        throw new Error(error?.response?.data?.message || "Failed to create wishlist");
    }
} 

export const getWishlists = async (): Promise<getWishlistType[]> => {
    try {
        const response = await api.get(`/wishlists`, getAuthConfig());
        return response.data;
    }
    catch (error: any) 
    {
        console.error("Error fetching wishlists:", error);
        throw new Error(error?.response?.data?.message || "Failed to fetch wishlists");
    }
} 


export const updateWishlist = async (wishlist_id: string, data: wishlist): Promise<void> => {
    try {
        const response = await api.patch(`/wishlists/${wishlist_id}`, data, getAuthConfig()) ;
        return response.data;
    }
    catch (error: any) 
    {
        console.error("Error updating wishlist:", error);
        throw new Error(error?.response?.data?.message || "Failed to update wishlist");
    }
}


export const deleteWishlist = async (wishlist_id: string): Promise<void> => {
    try {
        await api.delete(`/wishlists/${wishlist_id}`, getAuthConfig()) ;
    }
    catch (error: any) 
    {
        console.error("Error deleting wishlist:", error);
        throw new Error(error?.response?.data?.message || "Failed to delete wishlist");
    }
}


export const getWishlistById = async (wishlist_id: string): Promise<getWishlistType> => {
    try {
        const response = await api.get(`/wishlists/${wishlist_id}`, getAuthConfig());
        return response.data;
    }
    catch(error: any) 
    {
         console.error("Error fetching wishlist:", error);
        throw new Error(error?.response?.data?.message || "Failed to fetch wishlist");
    }
}


export const getInterestedUsers = async (theme: string): Promise<groupedUsers[]> => {
    try {
        const data = {
            theme: theme
        }
  
        const response = await api.post(`/wishlists/grouped/users`, data, getAuthConfig());
        return response.data;
    }
    catch (error: any) 
    {
        console.error("Error getting interested users:", error);
        throw new Error(error?.response?.data?.message || "Failed to get interested users");
    } 
}


export const toggleVisibility = async (wishlist_id: string): Promise<string> => {
    try {
        const response = await api.patch(`/wishlists/${wishlist_id}/visibility`, {}, getAuthConfig());
        return response.data;
    }
    catch (error: any) 
    {
        console.error("Error changing visibility:", error);
        throw new Error(error?.response?.data?.message || "Failed to change visibility");
    }
}