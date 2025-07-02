import { useState } from "react";
// import AuthForm from "../components/auth/authForm"; 
import { useNavigate } from "react-router-dom";

export default function LandingPage() {
    const navigate = useNavigate();

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
