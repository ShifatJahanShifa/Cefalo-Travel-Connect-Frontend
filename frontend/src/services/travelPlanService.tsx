import api from "../api";
import type { travelPlanComment, travelPlanInput, travelPlanMember, travelPlanMemberAdd, travelPlanOutput } from "../types/travelplan";
import { getAuthConfig } from "../utils/authConfig";
import { logger } from "../utils/logger";

export const createTravelPlan = async(data: travelPlanInput): Promise<string> => {
    try {
        const response = await api.post(`/travelplans`, data, getAuthConfig());
        return response.data;
    }
    catch(error: any) 
    {
        logger.error("Error creating travel plans:", error);
        throw new Error(error?.response?.data?.message || "Failed to create travel plans");
    }
}


export const getTravelPlans = async(): Promise<travelPlanOutput[]> => {
    try {
        const response = await api.get(`/travelplans`, getAuthConfig());
        return response.data;
    }
    catch(error: any) 
    {
        logger.error("Error fetching travel plans:", error);
        throw new Error(error?.response?.data?.message || "Failed to fetchs travel plans");
    }
}


export const getTravelPlanById = async(travel_plan_id: string): Promise<travelPlanOutput> => {
    try {
        const response = await api.get(`/travelplans/${travel_plan_id}`, getAuthConfig());
       
        return response.data;
    }
    catch(error: any) 
    {
        logger.error("Error fetching travel plans:", error);
        throw new Error(error?.response?.data?.message || "Failed to fetchs travel plans");
    }
}


export const updateTravelPlan = async(travel_plan_id: string, data: travelPlanInput): Promise<string> => {
    try {
        const response = await api.patch(`/travelplans/${travel_plan_id}`, data, getAuthConfig());
        return response.data;
    }
    catch(error: any) 
    {
        logger.error("Error editing travel plans:", error);
        throw new Error(error?.response?.data?.message || "Failed to edit travel plans");
    }
}


export const deleteTravelPlan= async(travel_plan_id: string): Promise<string> => {
    try {
        const response = await api.delete(`/travelplans/${travel_plan_id}`, getAuthConfig());
        return response.data;
    }
    catch(error: any) 
    {
        logger.error("Error deleting travel plans:", error);
        throw new Error(error?.response?.data?.message || "Failed to delete travel plans");
    }
}


export const addTravelPlanMember = async(travel_plan_id: string, data: travelPlanMemberAdd): Promise<string> => {
    try {
        const response = await api.post(`/travelplans/${travel_plan_id}/members`, data, getAuthConfig());
        return response.data;
    }
    catch(error: any) 
    {
        logger.error("Error deleting travel plans:", error);
        throw new Error(error?.response?.data?.message || "Failed to delete travel plans");
    }
}


export const getTravelPlanMembers = async(travel_plan_id: string): Promise<travelPlanMember[]> => {
    try {
        const response = await api.get(`/travelplans/${travel_plan_id}/members`, getAuthConfig());
        return response.data;
    }
    catch(error: any) 
    {
        logger.error("Error deleting travel plans:", error);
        throw new Error(error?.response?.data?.message || "Failed to delete travel plans");
    }
}


export const updateTravelPlanMemberRole = async(travel_plan_id: string, user_id: string, data: Partial<travelPlanMember>): Promise<travelPlanMember> => {
    try {
        const response = await api.patch(`/travelplans/${travel_plan_id}/members/${user_id}/role`, data, getAuthConfig());
        return response.data;
    }
    catch(error: any) 
    {
        logger.error("Error updating member role:", error);
        throw new Error(error?.response?.data?.message || "Failed to update member role");
    }
}



export const getRavelPlanComments = async(travel_plan_id: string): Promise<travelPlanComment[]> => {
    try {
        const response = await api.get(`/travelplans/${travel_plan_id}/comments`, getAuthConfig());
        return response.data;
    }
    catch(error: any) 
    {
        logger.error("Error fetching travel plan comments:", error);
        throw new Error(error?.response?.data?.message || "Failed to fetch travel plan comments");
    }
}


export const createTravelPlanComment = async(travel_plan_id: string, data: travelPlanComment): Promise<travelPlanComment> => {
    try {
        const response = await api.post(`/travelplans/${travel_plan_id}/comments`, data, getAuthConfig());
        return response.data;
    }
    catch(error: any) 
    {
        logger.error("Error creating travel plan comment:", error);
        throw new Error(error?.response?.data?.message || "Failed to create travel plan comment");
    }
}