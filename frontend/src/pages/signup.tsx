import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { userSignup } from "../services/authService";
import { useAuth } from "../hooks/useAuth";

export default function SignupPage() {
    const [form, setForm] = useState({ username: "", email: "", password: "" });
    const navigate = useNavigate();
    const { signin } = useAuth();

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setForm({ ...form, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            const res = await userSignup(form);

            signin(res.username, res.user_id, res.role, res.accessToken, res.refreshToken);
            navigate("/home");
        } 
        catch (err) {
            alert("Signup failed");
            console.error(err);
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-100">
            <form onSubmit={handleSubmit} className="bg-white p-8 rounded shadow max-w-md w-full">
                <h2 className="text-2xl font-bold mb-6 text-center">Sign Up</h2>
                <input
                    name="username"
                    placeholder="username"
                    value={form.username}
                    onChange={handleChange}
                    className="w-full border p-2 mb-4 rounded"
                    required
                />
                <input
                    name="email"
                    type="email"
                    placeholder="Email"
                    value={form.email}
                    onChange={handleChange}
                    className="w-full border p-2 mb-4 rounded"
                    required
                />
                <input
                    name="password"
                    type="password"
                    placeholder="Password"
                    value={form.password}
                    onChange={handleChange}
                    className="w-full border p-2 mb-6 rounded"
                    required
                />
                <button type="submit" className="bg-blue-600 text-white w-full py-2 rounded hover:bg-blue-700">
                    Create Account
                </button>

                <p className="mt-4 text-sm text-center">
                    Already have an account? <a href="/signin" className="text-blue-600 underline">Sign In</a>
                </p>
            </form>
        </div>
    );
}
