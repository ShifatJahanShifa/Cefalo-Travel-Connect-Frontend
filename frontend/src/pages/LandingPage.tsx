import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";

export default function LandingPage() {
    const navigate = useNavigate();

    const { isAuthenticated } = useAuth();

    useEffect(() => {
        if (isAuthenticated) 
        {
            navigate("/home", { replace: true });
        }
    }, [isAuthenticated, navigate]);

    const onClickHandler = () => {
        navigate('/signup')
    }

    return (
        <div className="h-screen flex flex-col justify-center items-center bg-gradient-to-br from-blue-200 to-indigo-300" 
        style={{backgroundImage: `url('/images/landpage-3.jpg')`}}>
            <h1 className="text-4xl font-bold mb-6 text-white">Welcome to Cefalo Travel Connect!</h1>
            <button className="bg-white text-blue-600 px-6 py-3 rounded shadow hover:bg-gray-100" onClick={onClickHandler}>
                Get Started
            </button>
        </div>
    );
}
