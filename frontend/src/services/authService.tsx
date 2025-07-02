import api from '../api'
import type { authResponse, signin, signup } from '../types/auth';


export const userSignup = async (data: signup): Promise<authResponse> => {
    try {
        const response = await api.post("/auth/signup", data);
        return response.data;
    } 
    catch (error: any) {
        console.error("Signup error:", error);
        throw new Error(error?.response?.data?.message || "Signup failed. Please try again.");
    }
};

export const userSignin = async (data: signin): Promise<authResponse> => {
    try {
        const response = await api.post("/auth/signin", data);
        return response.data;
    } 
    catch (error: any) {
        console.error("Signin error:", error);
        throw new Error(error?.response?.data?.message || "Signin failed. Please try again.");
    }
};

export const userSignout = async (): Promise<{ message: string }> => {
    try {
        const accessToken = localStorage.getItem("accessToken")
        const config = {
            headers: {
            Authorization: `Bearer ${accessToken}`,
            },
        };
        const response = await api.post('/auth/signout', null, config)
       
        return response.data;
    } 
    catch (error: any) {
        console.error("Error during signout:", error);
        throw new Error(error?.response?.data?.message || "Signout failed. Please try again")
    }
};


// this is not working due to cors in the backend. will fix it in later iteration.
export const refreshAccessToken = async (): Promise<{ accessToken: string }> => {
    try {
        const response = await api.post('/auth/refresh-token', null, { withCredentials: true})
        localStorage.setItem("accessToken",response.data.accessToken)
       
        return response.data;
    } 
    catch (error: any) {
        console.error("Error during signout:", error);
        throw new Error(error?.response?.data?.message || "Signout failed. Please try again")
    }
};