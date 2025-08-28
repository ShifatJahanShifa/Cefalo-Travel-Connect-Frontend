import api from "../api";
import type { accommodationCreation, accommodationDTOType, accommodationUpdation } from "../types/accommodation";
import { getAuthConfig } from "../utils/authConfig";
import { ONE_KILO_METER } from "../constants/unitConversion";
import { logger } from "../utils/logger";

export const getAccommodationsByProximity = async (latitude: number, longitude: number, radius: number): Promise<accommodationDTOType[]> => {
    try {
        radius*=ONE_KILO_METER;
        
        const response = await api.get(`/accommodations/search/`, {
                params: {
                latitude: latitude,
                longitude: longitude,
                radius: radius,
            },
            ... getAuthConfig(),
        });

        return response.data;
    }
    catch(error: any) 
    {
        logger.error("Error fetching accpommodations:", error);
        throw new Error(error?.response?.data?.message || "Failed to fetch accommodations");
    }
}


export const getAccommodations = async (): Promise<accommodationDTOType[]> => {
    try {
        const response = await api.get('/accommodations', getAuthConfig());
        return response.data;
    }
    catch(error: any) 
    {
        logger.error("Error fetching accpommodations:", error);
        throw new Error(error?.response?.data?.message || "Failed to fetch accommodations");
    }
}


export const createAccommodation = async (data: accommodationCreation): Promise<accommodationDTOType> => {
    try {
        const response = await api.post('/accommodations', data, getAuthConfig());
        return response.data;
    }
    catch(error: any) 
    {
        logger.error("Error creating accpommodations:", error);
        throw new Error(error?.response?.data?.message || "Failed to create accommodations");
    }
}


export const updateAccommodation = async (data: accommodationUpdation): Promise<accommodationDTOType> => {
    try {
        const response = await api.patch(`/accommodations/${data.accommodation_id}`, data, getAuthConfig());
        return response.data;
    }
    catch(error: any) 
    {
        logger.error("Error updating accommodations:", error);
        throw new Error(error?.response?.data?.message || "Failed to update accommodations");
    }
}
