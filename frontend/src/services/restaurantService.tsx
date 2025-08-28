import api from "../api";
import { getAuthConfig } from "../utils/authConfig"; 
import type { restaurantCreation, restaurantDTOType, restaurantUpdation } from "../types/restaurant";
import { ONE_KILO_METER } from "../constants/unitConversion";
import { logger } from "../utils/logger";

export const getRestauranstsByProximity = async (latitude: number, longitude: number, radius: number): Promise<restaurantDTOType[]> => {
    try {
        radius*=ONE_KILO_METER;
        
        const response = await api.get(`/restaurants/search/`, {
             params: {
                latitude: latitude,
                longitude: longitude,
                radius: radius,
            }, ... getAuthConfig()
        });

        return response.data;
    }
    catch(error: any) 
    {
        logger.error("Error fetching restaurants:", error);
        throw new Error(error?.response?.data?.message || "Failed to fetch restaurants");
    }
}


export const getRestaurants = async (): Promise<restaurantDTOType[]> => {
    try {
        const response = await api.get('/restaurants', getAuthConfig());
        return response.data;
    }   
    catch (error: any) 
    {
        logger.error("Error fetching restaurants:", error);
        throw new Error(error?.response?.data?.message || "Failed to fetch restaurants");
    }
}


export const createRestaurant = async (data: restaurantCreation): Promise<restaurantDTOType> => {
    try {
        const response = await api.post('/restaurants', data, getAuthConfig());
        return response.data;
    }   
    catch (error: any) 
    {
        logger.error("Error creating restaurant:", error);
        throw new Error(error?.response?.data?.message || "Failed to create restaurant");
    }
}

export const updateRestaurant = async (data: restaurantUpdation): Promise<restaurantDTOType> => {
    try {
        const response = await api.patch(`/restaurants/${data.restaurant_id}`, data, getAuthConfig());
        return response.data;
    }   
    catch (error: any) 
    {
        logger.error("Error updating restaurant:", error);
        throw new Error(error?.response?.data?.message || "Failed to update restaurant");
    }
}