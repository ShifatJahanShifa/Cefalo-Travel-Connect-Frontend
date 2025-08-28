import api from "../api";
import { getAuthConfig } from "../utils/authConfig"; 
import type { getTransport, transportCreation, transportUpdation } from "../types/transport";
import { logger } from "../utils/logger";


export const getTransports = async (): Promise<getTransport[]> => {
    try {
        const response = await api.get('/transports', getAuthConfig());
        return response.data;
    }   
    catch (error: any) 
    {
        logger.error("Error fetching transports:", error);
        throw new Error(error?.response?.data?.message || "Failed to fetch transports");
    }
}


export const createTransport = async (data: transportCreation): Promise<getTransport> => {
    try {
        const response = await api.post('/transports', data, getAuthConfig());
        return response.data;
    }   
    catch (error: any) 
    {
        logger.error("Error creating transport:", error);
        throw new Error(error?.response?.data?.message || "Failed to create transport");
    }
}

export const updateTransport = async (data: transportUpdation): Promise<getTransport> => {
    try {
        const response = await api.patch(`/transports/${data.transport_id}`, data, getAuthConfig());
        return response.data;
    }   
    catch (error: any) 
    {
        logger.error("Error updating transport:", error);
        throw new Error(error?.response?.data?.message || "Failed to update transport");
    }
}