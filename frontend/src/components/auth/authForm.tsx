import { useState } from "react";
import { login, register } from "../../services/authService";
import { useNavigate } from "react-router-dom";

export default function AuthForm() {
    const [isLogin, setIsLogin] = useState(false);
    const [form, setForm] = useState({ name: "", email: "", password: "" });
    const navigate = useNavigate();

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setForm({ ...form, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            const res = isLogin
                ? await login({ email: form.email, password: form.password })
                : await register(form);

            localStorage.setItem("token", res.access_token);
            localStorage.setItem("user", JSON.stringify(res.user));
            navigate("/home");
        } 
        catch (err) {
            alert("Authentication failed");
            console.error(err);
        }
    };

    return (
        <div className="bg-white p-6 rounded shadow-md w-full max-w-md">
            <h2 className="text-2xl font-bold mb-4">{isLogin ? "Sign In" : "Sign Up"}</h2>
            <form onSubmit={handleSubmit} className="space-y-3">
                {!isLogin && (
                <input
                    type="text"
                    name="name"
                    placeholder="Your Name"
                    value={form.name}
                    onChange={handleChange}
                    className="w-full border p-2 rounded"
                />
                )}
                <input
                type="email"
                name="email"
                placeholder="Email"
                value={form.email}
                onChange={handleChange}
                className="w-full border p-2 rounded"
                />
                <input
                type="password"
                name="password"
                placeholder="Password"
                value={form.password}
                onChange={handleChange}
                className="w-full border p-2 rounded"
                />
                <button
                type="submit"
                className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700"
                >
                {isLogin ? "Sign In" : "Sign Up"}
                </button>
            </form>
            <p className="mt-4 text-sm text-center">
                {isLogin ? "New here?" : "Already registered?"}{" "}
                <button className="text-blue-600 underline" onClick={() => setIsLogin(!isLogin)}>
                    {isLogin ? "Sign Up" : "Sign In"}
                </button>
            </p>
        </div>
    );
}
