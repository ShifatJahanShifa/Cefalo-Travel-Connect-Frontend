import { createContext, useEffect, useState } from "react";
import type { ReactNode } from "react";


interface AuthContextType {
    username: string | null;
    user_id: string | null;
    accessToken: string | null; 
    refreshToken: string | null;
    signin: (username: string, user_id: string, accessToken: string, refreshToken: string) => void;
    signout: () => void;
    isAuthenticated: boolean;
    updateAccessToken: (newAccessToken: string) => void;
    isLoading: boolean;
}

export const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
    const [username, setUsername] = useState<string | null>(null);
    const [user_id, setUserId] = useState<string | null>(null);
    const [accessToken, setAccessToken] = useState<string | null>(null);
    const [refreshToken, setRefreshToken] = useState<string | null>(null);
    const [isLoading, setIsLoading] = useState(true); 

    useEffect(() => {
        const storedUsername = localStorage.getItem("username");
        const storedUserId = localStorage.getItem("user_id");
        const storedAccessToken = localStorage.getItem("accessToken");
        const storedRefreshToken = localStorage.getItem("refreshToken");

        if (storedUsername && storedUserId && storedAccessToken && storedRefreshToken) {
        setUsername(storedUsername);
        setUserId(storedUserId)
        setAccessToken(storedAccessToken);
        setRefreshToken(storedRefreshToken);
        }
        setIsLoading(false); 
    }, []);

    const signin = (username: string, user_id: string, accessToken: string, refreshToken: string) => {
        localStorage.setItem("username", username);
        localStorage.setItem("user_id", user_id);
        localStorage.setItem("accessToken", accessToken);
        localStorage.setItem("refreshToken", refreshToken);
        setUsername(username);
        setUserId(user_id);
        setAccessToken(accessToken);
        setRefreshToken(refreshToken);
    };

    const signout = () => {
        
        localStorage.removeItem("username");      
        localStorage.removeItem("user_id");  
        localStorage.removeItem("accessToken");
        localStorage.removeItem("refreshToken");
        setUsername(null);
        setUserId(null);
        setAccessToken(null);
        setRefreshToken(null);
    };

    const updateAccessToken = (newAccessToken: string) => {
        localStorage.setItem("accessToken", newAccessToken);
        setAccessToken(newAccessToken);
    };


    return (
        <AuthContext.Provider value={{ username, user_id, accessToken, refreshToken, signin, signout,updateAccessToken, isAuthenticated: !!username, isLoading }}>
        {children}
        </AuthContext.Provider>
    );
};
