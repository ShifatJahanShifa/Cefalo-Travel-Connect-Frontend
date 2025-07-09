import api from "../api";
import type { accommodationCreation, accommodationDTOType, accommodationUpdation } from "../types/accommodation";
import { getAuthConfig } from "../utils/authConfig";

export const getAccommodationsByProximity = async (latitude: number, longitude: number, radius: number): Promise<accommodationDTOType[]> => {
    try {
        radius*=1000;
        console.log(latitude, longitude, radius)
        const response = await api.get(`/accommodations/search/`, {
                params: {
                latitude: latitude,
                longitude: longitude,
                radius: radius,
            },
            ... getAuthConfig(),
        })

        console.log('seeee', response.data)
        return response.data
    }
    catch(error: any) 
    {
        console.error("Error fetching accpommodations:", error);
        throw new Error(error?.response?.data?.message || "Failed to fetch accommodations");
    }
}


export const getAccommodations = async (): Promise<accommodationDTOType[]> => {
    try {
        const response = await api.get('/accommodations', getAuthConfig())
        return response.data
    }
    catch(error: any) 
    {
        console.error("Error fetching accpommodations:", error);
        throw new Error(error?.response?.data?.message || "Failed to fetch accommodations");
    }
}


export const createAccommodation = async (data: accommodationCreation): Promise<accommodationDTOType> => {
    try {
        const response = await api.post('/accommodations', data, getAuthConfig())
        return response.data
    }
    catch(error: any) 
    {
        console.error("Error creating accpommodations:", error);
        throw new Error(error?.response?.data?.message || "Failed to create accommodations");
    }
}


export const updateAccommodation = async (data: accommodationUpdation): Promise<accommodationDTOType> => {
    try {
        const response = await api.patch(`/accommodations/${data.accommodation_id}`, data, getAuthConfig())
        return response.data
    }
    catch(error: any) 
    {
        console.error("Error updating accpommodations:", error);
        throw new Error(error?.response?.data?.message || "Failed to upadte accommodations");
    }
}
