import { Link, NavLink, useNavigate } from "react-router-dom";
import { userSignout } from "../services/authService";
import { useAuth } from "../hooks/useAuth";
import { useEffect, useState } from "react";
import { Bell } from "lucide-react";
import { getNotificationsByUsername } from "../services/userService";
import { BellRing } from "lucide-react";
import type { notification } from "../types/notification";
import { toast } from "react-toastify";
import { logger } from "../utils/logger";


export default function Navbar() {
    const navigate = useNavigate();
    const { signout } = useAuth();
    const { username } = useAuth();
    const [loading, setLoading] =  useState(true)

    const [unreadCount, setUnreadCount] = useState(0);

    useEffect(() => {
        const fetchData = async () => {
              try {
                let data = await getNotificationsByUsername(username!)
                data = data.filter(item => !item.read && item.type === "plan_comment")
                
                setUnreadCount(data.length)
              } 
              catch (error) {
                logger.error("Failed to fetch notifications:", error);
              } 
              finally {
                setLoading(false);
              }
            };
        
            fetchData();
    
    }, []);


    const handleLogout = async () => {
        try {
            await userSignout();
            signout();
            navigate("/");
        }
        catch (error) 
        {
            toast.error("Signout failed");
           
        }
    };

    return (
       
        <nav className="fixed top-0 left-0 right-0 z-50 flex flex-row justify-between items-center gap-6 px-6 py-3 bg-blue-200 shadow-md">
            <div className="space-x-2">
                {username ? (
                    <div className="flex flex-row justify-between gap-20 items-center">
                        <div>
                            <h1 className="text-xl font-bold text-blue-900">Cefalo Travel Connect</h1>
                        </div>
                        
                        <div className="flex flex-row justify-between gap-5 items-center"> 
                            <NavLink to="/home" className={({ isActive }) => isActive ? "bg-blue-600 text-white px-3 py-1 rounded-full font-semibold": "hover:bg-blue-100 px-3 py-1 rounded-full"}>
                                Home
                            </NavLink>
                            {/* <NavLink to="/posts/create" className={({ isActive }) => isActive ? "bg-blue-600 text-white px-3 py-1 rounded-full font-semibold": "hover:bg-blue-100 px-3 py-1 rounded-full"}>
                                Create Post
                            </NavLink> */}
                            <NavLink to="/places" className={({ isActive }) => isActive ? "bg-blue-600 text-white px-3 py-1 rounded-full font-semibold": "hover:bg-blue-100 px-3 py-1 rounded-full"}>
                                Places
                            </NavLink>
                            <NavLink to="/wishlists" className={({ isActive }) => isActive ? "bg-blue-600 text-white px-3 py-1 rounded-full font-semibold": "hover:bg-blue-100 px-3 py-1 rounded-full"}>
                                Wishlists
                            </NavLink>
                            <NavLink to="/travelplans" className={({ isActive }) => isActive ? "bg-blue-600 text-white px-3 py-1 rounded-full font-semibold": "hover:bg-blue-100 px-3 py-1 rounded-full"}>
                                TravelPlans
                            </NavLink>
                            <NavLink to="/nearby" className={({ isActive }) => isActive ? "bg-blue-600 text-white px-3 py-1 rounded-full font-semibold": "hover:bg-blue-100 px-3 py-1 rounded-full"}>
                                Nearby Services
                            </NavLink>
                            <NavLink to="/dashboard" className={({ isActive }) => isActive ? "bg-blue-600 text-white px-3 py-1 rounded-full font-semibold": "hover:bg-blue-100 px-3 py-1 rounded-full"}>
                                Dashboard
                            </NavLink>
                            <NavLink to="/profile" className={({ isActive }) => isActive ? "bg-blue-600 text-white px-3 py-1 rounded-full font-semibold": "hover:bg-blue-100 px-3 py-1 rounded-full"}>
                                Profile
                            </NavLink>
                            <NavLink to="/notifications" className={({ isActive }) => isActive ? "bg-blue-600 text-white px-3 py-1 rounded-full font-semibold": "hover:bg-blue-100 px-3 py-1 rounded-full"}>
                            <div className="relative">
                                <Bell className="w-6 h-6" />
                                {unreadCount > 0 && (
                                <span className="absolute -top-1 -right-1 bg-red-600 text-white text-[10px] leading-none font-bold rounded-full w-4 h-4 flex items-center justify-center">
                                    {unreadCount}
                                </span>
                                )}
                            </div>
                            </NavLink>

                            <button onClick={handleLogout} className="bg-blue-400 py-3 px-3 rounded-2xl">
                                Logout
                            </button>
                            </div>

                    </div>
                ) : (
                    <h1 className="text-xl font-bold text-black text-center">Cefalo Travel Connect</h1>
                )}
            </div>
        </nav>
    );
}
