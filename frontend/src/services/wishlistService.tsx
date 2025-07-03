import api from "../api";
import type { wishlist, getWishlistType } from "../types/wishlist";
import { getAuthConfig } from "../utils/authConfig";


export const createWishlist = async (data: wishlist): Promise<getWishlistType> => {
    try {
        const response = await api.post(`/wishlists`, data, getAuthConfig()) 
        return response.data
    }
    catch (error: any) 
    {
        console.error("Error creating wishlist:", error);
        throw new Error(error?.response?.data?.message || "Failed to create wishlists");
    }
} 

export const getWishlists = async (): Promise<getWishlistType[]> => {
    try {
        const response = await api.get(`/wishlists`, getAuthConfig()) 
        return response.data
    }
    catch (error: any) 
    {
        console.error("Error fetching wishlist:", error);
        throw new Error(error?.response?.data?.message || "Failed to fetch wishlists");
    }
} 


export const updateWishlist = async (wishlist_id: string, data: wishlist): Promise<void> => {
    try {
        const response = await api.patch(`/wishlists/${wishlist_id}`, data, getAuthConfig()) 
        return response.data
    }
    catch (error: any) 
    {
        console.error("Error updating wishlist:", error);
        throw new Error(error?.response?.data?.message || "Failed to update wishlists");
    }
}


export const deleteWishlist = async (wishlist_id: string): Promise<void> => {
    try {
        const response = await api.delete(`/wishlists/${wishlist_id}`, getAuthConfig()) 
        return response.data
    }
    catch (error: any) 
    {
        console.error("Error updating wishlist:", error);
        throw new Error(error?.response?.data?.message || "Failed to update wishlists");
    }
}


export const getWishlistById = async (wishlist_id: string): Promise<getWishlistType> => {
    try {
        const response = await api.get(`/wishlists/${wishlist_id}`, getAuthConfig())
        return response.data
    }
    catch(error: any) 
    {
         console.error("Error fetching wishlist:", error);
        throw new Error(error?.response?.data?.message || "Failed to fetch wishlists");
    }
}

export const shareWishlist = async (wishlist_id: string): Promise<void> => {
    try {
        const response = await api.delete(`/wishlists/${wishlist_id}/share`, getAuthConfig()) 
        return response.data
    }
    catch (error: any) 
    {
        console.error("Error sharing wishlist:", error);
        throw new Error(error?.response?.data?.message || "Failed to share wishlists");
    }
}

