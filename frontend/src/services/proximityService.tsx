import api from "../api";
import type { proximity } from "../types/proximity";
import { getAuthConfig } from "../utils/authConfig";

export const createProximity = async (data: proximity): Promise<proximity> => {
    try {
        const response = await api.post(`/proximity`, data, getAuthConfig())
        return response.data
    }
    catch (error: any)
    {
        console.error("Error creating proximities:", error);
        throw new Error(error?.response?.data?.message || "Failed to create proximities");
    }
}


export const getProximityByUsername = async (username: string): Promise<proximity[]> => {
    try {
        const response = await api.get(`/proximity/${username}`, getAuthConfig())
        return response.data
    }
    catch (error: any)
    {
        console.error("Error fetching proximities:", error);
        throw new Error(error?.response?.data?.message || "Failed to fetch proximities");
    }
}


export const checkProximities = async (data: any): Promise<any> => {
    try {
        const response = await api.post(`/proximity/alert`, data, getAuthConfig())
        return response.data
    }
    catch (error: any)
    {
        console.error("Error checking proximities:", error);
        throw new Error(error?.response?.data?.message || "Failed to check proximities");
    }
}


export const updateProximity = async (data: proximity): Promise<proximity> => {
    try {
        const response = await api.put(`/proximity`, data, getAuthConfig())
        return response.data
    }
    catch (error: any)
    {
        console.error("Error updating proximities:", error);
        throw new Error(error?.response?.data?.message || "Failed to update proximities");
    }
}


// i need to fix http method in the next iteration. for now i cannot do this
export const deleteProximity = async (data: proximity): Promise<proximity> => {
    try {
        const response = await api.delete(`/proximity`, { ...getAuthConfig(), data})
        return response.data
    }
    catch (error: any)
    {
        console.error("Error creating proximities:", error);
        throw new Error(error?.response?.data?.message || "Failed to create proximities");
    }
}


