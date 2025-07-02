import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { userSignin } from "../services/authService";
import { useAuth } from "../hooks/useAuth";

export default function SigninPage() {
    const [form, setForm] = useState({ email: "", password: "" });
    const navigate = useNavigate();
    const { signin } = useAuth();

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setForm({ ...form, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            const res = await userSignin(form);
            signin(res.username, res.user_id, res.accessToken, res.refreshToken);
            navigate("/home");
        } 
        catch (err) {
            alert("Sign in failed");
            console.error(err);
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-100">
            <form onSubmit={handleSubmit} className="bg-white p-8 rounded shadow max-w-md w-full">
                <h2 className="text-2xl font-bold mb-6 text-center">Sign In</h2>
                <input
                    name="email"
                    type="email"
                    placeholder="Email"
                    value={form.email}
                    onChange={handleChange}
                    className="w-full border p-2 mb-4 rounded"
                />
                <input
                    name="password"
                    type="password"
                    placeholder="Password"
                    value={form.password}
                    onChange={handleChange}
                    className="w-full border p-2 mb-6 rounded"
                />
                
                <button type="submit" className="bg-blue-600 text-white w-full py-2 rounded hover:bg-blue-700">
                    Sign In
                </button>

                <p className="mt-4 text-sm text-center">
                    New here? <a href="/signup" className="text-blue-600 underline">Create an account</a>
                </p>
            </form>
        </div>
    );
}
