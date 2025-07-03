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

// export const getPlaces = async (): Promise<placeDTOType[]> => {
//     try {
        
//     }
//     catch (error: any) 
//     {
//         console.error("Error fetching places:", error);
//         throw new Error(error?.response?.data?.message || "Failed to fetch places");
//     }
// }