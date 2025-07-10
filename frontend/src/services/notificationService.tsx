import api from "../api";
import type { notification } from "../types/notification";
import { getAuthConfig } from "../utils/authConfig";

export const createNotification = async (data: notification): Promise<notification> => {
    try {
        const response = await api.post(`/notifications`, data, getAuthConfig())
        return response.data
    }
    catch (error: any) 
    {
        console.error("Error creating notification:", error);
        throw new Error(error?.response?.data?.message || "Failed to create notification");
    }
}


export const getNotificationsByNotificationId = async (notification_id: string): Promise<notification[]> => {
    try {
        const response = await api.get(`/notifications/${notification_id}`, getAuthConfig())
        return response.data
    }
    catch (error: any) 
    {
        console.error("Error fetching notification:", error);
        throw new Error(error?.response?.data?.message || "Failed to fetch notification");
    }
}


export const deleteNotification = async (notification_id: string): Promise<void> => {
    try {
        const response = await api.delete(`/notifications/${notification_id}`, getAuthConfig())
        return response.data
    }
    catch (error: any) 
    {
        console.error("Error deleting notification:", error);
        throw new Error(error?.response?.data?.message || "Failed to delete notification");
    }
}


export const markNotificationAsRead = async (notification_id: string): Promise<notification> => {
    try {
        const response = await api.patch(`/notifications/${notification_id}`, {}, getAuthConfig())
        console.log(response.data)
        return response.data
    }
    catch (error: any) 
    {
        console.error("Error marking notification:", error);
        throw new Error(error?.response?.data?.message || "Failed to mark notification");
    }
}