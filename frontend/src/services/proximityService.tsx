import api from "../api";
import type { alertItem } from "../types/alert";
import type { proximity } from "../types/proximity";
import { getAuthConfig } from "../utils/authConfig";
import { logger } from "../utils/logger";

export const createProximity = async (data: proximity): Promise<proximity> => {
    try {
        const response = await api.post(`/proximity`, data, getAuthConfig());
        return response.data;
    }
    catch (error: any)
    {
        logger.error("Error creating proximity:", error);
        throw new Error(error?.response?.data?.message || "Failed to create proximity");
    }
}


export const getProximityByUsername = async (username: string): Promise<proximity[]> => {
    try {
        const response = await api.get(`/proximity/${username}`, getAuthConfig());
        return response.data;
    }
    catch (error: any)
    {
        logger.error("Error fetching proximities:", error);
        throw new Error(error?.response?.data?.message || "Failed to fetch proximities");
    }
}


export const checkProximities = async (data: any): Promise<alertItem[]> => {
    try {
        const response = await api.post(`/proximity/alert`, data, getAuthConfig());
      
        return response.data;
    }
    catch (error: any)
    {
        logger.error("Error checking proximities:", error);
        throw new Error(error?.response?.data?.message || "Failed to check proximities");
    }
}


export const updateProximity = async (data: proximity): Promise<proximity> => {
    try {
        const response = await api.put(`/proximity`, data, getAuthConfig());
        return response.data;
    }
    catch (error: any)
    {
        logger.error("Error updating proximity:", error);
        throw new Error(error?.response?.data?.message || "Failed to update proximity");
    }
}


// i need to fix http method in the next iteration. 
export const deleteProximity = async (data: proximity): Promise<proximity> => {
    try {
        const response = await api.delete(`/proximity`, { ...getAuthConfig(), data});
        return response.data;
    }
    catch (error: any)
    {
        logger.error("Error deleting proximity:", error);
        throw new Error(error?.response?.data?.message || "Failed to delete proximity");
    }
}


