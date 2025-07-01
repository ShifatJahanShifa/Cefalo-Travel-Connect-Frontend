import { useState } from "react";
import AuthForm from "../components/auth/authForm"; 

export default function LandingPage() {
    const [showForm, setShowForm] = useState(false);

    return (
        <div className="h-screen flex flex-col justify-center items-center bg-gradient-to-br from-blue-200 to-indigo-300" 
        style={{backgroundImage: `url('/images/landpage-2.jpg')`}}>
        {!showForm ? (
            <>
            
            <h1 className="text-4xl font-bold mb-6 text-blue-500">Welcome to Cefalo Travel Connect!</h1>
            <button
                className="bg-white text-blue-600 px-6 py-3 rounded shadow hover:bg-gray-100"
                onClick={() => setShowForm(true)}
                >
                Get Started
            </button>
            </>
        ) : (
            <AuthForm />
        )}
        </div>
    );
}
