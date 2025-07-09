import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { userSignup } from "../../services/authService";
import { useAuth } from "../../hooks/useAuth";
import { FaEye, FaEyeSlash } from "react-icons/fa";
import { toast } from "react-toastify";


export default function SignupPage() {
  const [form, setForm] = useState({
    username: "",
    email: "",
    password: ""
  });
  const [errors, setErrors] = useState<{ [key: string]: string }>({});
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();
  const { signin } = useAuth();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });

    if (errors[e.target.name]) {
      setErrors((prev) => ({ ...prev, [e.target.name]: "" }));
    }
  };

  const validateEmail = (email: string) =>
    /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const newErrors: { [key: string]: string } = {};

    if (!form.username.trim()) newErrors.username = "Username is required";
    if (!form.email.trim()) newErrors.email = "Email is required";
    else if (!validateEmail(form.email)) newErrors.email = "Invalid email format";

    if (!form.password.trim()) newErrors.password = "Password is required";
    else if (form.password.length < 6)
      newErrors.password = "Password must be at least 6 characters";

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    try {
      const res = await userSignup(form);
      signin(res.username, res.user_id, res.role, res.accessToken, res.refreshToken);
      navigate("/home");
    } 
    catch (err: any) {
      if (err.response?.status === 401) 
      {
        toast.error(err.response?.data?.message);
      } 
      else if(err.response?.status === 400) 
      {
        toast.error(err.response?.data?.message);
      }
      else {
        toast.error("Sign up failed. Please try again.");
      }
      console.error(err);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-100 to-indigo-200 px-4">
      <form
        onSubmit={handleSubmit}
        className="bg-white p-8 shadow-lg max-w-md w-full space-y-4 rounded-2xl"
      >
        <h2 className="text-3xl font-bold text-center text-blue-700 mb-2">
          Create an Account
        </h2>
        <p className="text-center text-gray-600 mb-4">
          Join Cefalo Travel Connect and start exploring today.
        </p>

        {/* Username */}
        <div>
          <label className="block mb-1 font-medium">Username</label>
          <input
            name="username"
            placeholder="Enter username"
            value={form.username}
            onChange={handleChange}
            className={`w-full border ${errors.username ? "border-red-500" : "border-gray-300"
              } p-2 rounded focus:ring-2 ${errors.username ? "focus:ring-red-300" : "focus:ring-blue-300"
              } outline-none`}
          />
          {errors.username && (
            <p className="text-red-600 text-sm mt-1">{errors.username}</p>
          )}
        </div>

        {/* Email */}
        <div>
          <label className="block mb-1 font-medium">Email</label>
          <input
            name="email"
            type="email"
            placeholder="Enter email (e.g. test@gmail.com)"
            value={form.email}
            onChange={handleChange}
            className={`w-full border ${errors.email ? "border-red-500" : "border-gray-300"
              } p-2 rounded focus:ring-2 ${errors.email ? "focus:ring-red-300" : "focus:ring-blue-300"
              } outline-none`}
          />
          {errors.email && (
            <p className="text-red-600 text-sm mt-1">{errors.email}</p>
          )}
        </div>

        {/* Password with Eye Toggle */}
        <div>
          <label className="block mb-1 font-medium">Password</label>
          <div className="relative">
            <input
              name="password"
              type={showPassword ? "text" : "password"}
              placeholder="Enter password"
              value={form.password}
              onChange={handleChange}
              className={`w-full border ${errors.password ? "border-red-500" : "border-gray-300"
                } p-2 pr-10 rounded focus:ring-2 ${errors.password ? "focus:ring-red-300" : "focus:ring-blue-300"
                } outline-none`}
            />
            <div
              onClick={() => setShowPassword((prev) => !prev)}
              className="absolute right-3 top-1/2 transform -translate-y-1/2 cursor-pointer text-gray-600 hover:text-gray-800"
              title={showPassword ? "Hide Password" : "Show Password"}
            >
              {showPassword ? <FaEyeSlash /> : <FaEye />}
            </div>
          </div>
          {errors.password && (
            <p className="text-red-600 text-sm mt-1">{errors.password}</p>
          )}
        </div>

        <button
          type="submit"
          className="bg-blue-600 hover:bg-blue-700 text-white py-2 rounded w-full transition duration-200"
        >
          Sign Up
        </button>

        <p className="mt-4 text-center text-sm text-gray-700">
          Already have an account?{" "}
          <a href="/signin" className="text-blue-600 underline hover:text-blue-800">
            Sign In
          </a>
        </p>
      </form>
    </div>
  );
}
