import axios from 'axios';
import { refreshAccessToken } from './services/authService';
const baseURL = import.meta.env.VITE_BASE_URL

const api = axios.create({
  baseURL: baseURL,
  withCredentials: true, 
});

let isRefreshing = false;
let failedQueue: any[] = [];

const processQueue = (error: any, token: string | null = null) => {
  failedQueue.forEach(item => {
    if (error) {
      item.reject(error);
    } 
    else {
      item.resolve(token);
    }
  });
  failedQueue = [];
};

api.interceptors.response.use((response) => response, async (error) => {
    const originalRequest = error.config;

    const authEndpoints = ["/auth/signin", "/auth/signup"];
    const isAuthEndpoint = authEndpoints.some((endpoint) =>
      originalRequest.url?.includes(endpoint)
    );

    if (error.response?.status === 401 && !isAuthEndpoint) {
      originalRequest._retry = true;

      if (!isRefreshing) {
        isRefreshing = true;

        try {
          const res = await refreshAccessToken();
          const newAccessToken = res.accessToken;

          localStorage.setItem("accessToken", newAccessToken);
          originalRequest.headers["Authorization"] = "Bearer " + newAccessToken
          processQueue(null, newAccessToken);

          return api(originalRequest);
        } 
        catch (refreshError) 
        {
          processQueue(refreshError, null);
          return Promise.reject(refreshError);
        } 
        finally 
        {
          isRefreshing = false;
        }
      }

      return new Promise((resolve, reject) => {
        failedQueue.push({
          resolve: (token: string) => {
            originalRequest.headers["Authorization"] = "Bearer " + token;
            resolve(api(originalRequest));
          },
          reject: (err: any) => {
            reject(err);
          },
        });
      });
    }

    return Promise.reject(error);
  }
);


export default api;
