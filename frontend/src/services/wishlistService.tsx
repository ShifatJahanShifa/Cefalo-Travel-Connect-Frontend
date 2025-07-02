import api from "../api";
import type { wishlist, getWishlistType } from "../types/wishlist";


export const createWishlist = async (data: wishlist): Promise<getWishlistType> => {
    try {
        const accessToken = localStorage.getItem("accessToken") 
        const config = {
            headers: {
                Authorization: `Bearer ${accessToken}`,
            },
        };
        
        const response = await api.post(`/wishlists`, data, config) 
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
        const accessToken = localStorage.getItem("accessToken") 
        const config = {
            headers: {
                Authorization: `Bearer ${accessToken}`,
            },
        };

        const response = await api.get(`/wishlists`, config) 
        return response.data
    }
    catch (error: any) 
    {
        console.error("Error creating wishlist:", error);
        throw new Error(error?.response?.data?.message || "Failed to create wishlists");
    }
} 