// services/authService.ts
import api from '../api'


export const register = async (data: { name: string; email: string; password: string }) => {
    const response = await api.post('/auth/signup', data);
    return response.data;
};

export const login = async (data: { email: string; password: string }) => {
    const response = await api.post('/auth/signin', data);
    return response.data; 
};

export const logout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
};
