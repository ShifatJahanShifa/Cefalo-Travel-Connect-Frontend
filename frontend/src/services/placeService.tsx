import api from "../api";
import { getAuthConfig } from "../utils/authConfig";
import  type { placeDTOType, placeUpdation, placeCreation } from "../types/place";

export const getPlaces = async (): Promise<placeDTOType[]> => {
    try {
        const resposne = await api.get(`/places`, getAuthConfig())
        return resposne.data
    }
    catch (error: any) 
    {
        console.error("Error fetching places:", error);
        throw new Error(error?.response?.data?.message || "Failed to fetch places");
    }
}

export const createPlace = async (data: placeCreation): Promise<placeDTOType> => {
    try {
        const resposne = await api.post(`/places`, data, getAuthConfig())
        return resposne.data
    }
    catch (error: any) 
    {
        console.error("Error creating places:", error);
        throw new Error(error?.response?.data?.message || "Failed to create places");
    }
}



export const updatePlace = async (data: placeUpdation): Promise<placeDTOType> => {
    try {
        const resposne = await api.patch(`/places/${data.place_id}`, data, getAuthConfig())
        return resposne.data
    }
    catch (error: any) 
    {
        console.error("Error updating places:", error);
        throw new Error(error?.response?.data?.message || "Failed to update places");
    }
}

export const getPlacesByProximity = async (latitude: number, longitude: number, radius: number): Promise<placeDTOType[]> => {
    try {
        radius= radius*1000
        const resposne = await api.get(`/places/search/`, {
                params: {
                latitude: latitude,
                longitude: longitude,
                radius: radius,
            },
            ...  getAuthConfig()
        })

        return resposne.data
    }
    catch(error: any) 
    {
        console.error("Error fetching places:", error);
        throw new Error(error?.response?.data?.message || "Failed to fetch places");
    }
}