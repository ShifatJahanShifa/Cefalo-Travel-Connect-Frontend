import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { userSignin } from "../../services/authService";
import { useAuth } from "../../hooks/useAuth";
import { FaEye, FaEyeSlash } from "react-icons/fa";
import { toast } from "react-toastify";
import { useProximity } from "../../hooks/useProximity";
import { getProximityByUsername } from "../../services/proximityService";

export default function SigninPage() {
  const [form, setForm] = useState({ email: "", password: "" });
  const [errors, setErrors] = useState<{ [key: string]: string }>({});
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();
  const { signin } = useAuth();
  const { setProximityEnabled } = useProximity()

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
    if (!form.email.trim()) newErrors.email = "Email is required";
    else if (!validateEmail(form.email)) newErrors.email = "Invalid email format";

    if (!form.password.trim()) newErrors.password = "Password is required";

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    try {
      const res = await userSignin(form);
      signin(res.username, res.user_id, res.role, res.accessToken, res.refreshToken);
      try {
        const proximityData = await getProximityByUsername(res.username)
       
        if (proximityData.length > 0) {
          setProximityEnabled(true);
        }
      } catch (err) {
        console.error("Failed to fetch proximity alerts after login", err);
      }
      toast.success(`Welcome back, ${res.role}`, {
        autoClose: 4000
      })
      navigate("/home");
    } 
    catch (err: any) {
       if (err.response?.status === 401) {
        toast.error(err.response?.data?.message);
      } 
      else {
        toast.error("Sign in failed. Please try again.");
      }
      console.error(err);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-indigo-100 to-blue-200 px-4">
      <form
        onSubmit={handleSubmit}
        className="bg-white p-8 rounded-2xl shadow-lg max-w-md w-full space-y-4"
      >
        <h2 className="text-3xl font-bold text-center text-blue-600 mb-2">Welcome Back <br></br><span className="text-blue-800">Travel Enthusiast</span></h2>
        <h3 className="text-center text-gray-600 mb-4">Login to your account</h3>
        <p><span className="text-red-500">*</span> indicates required field</p>
     
        <div>
          <label className="block mb-1 font-medium">Email<span className="text-red-500">*</span></label>
          <input
            name="email"
            type="email"
            placeholder="Enter your email"
            value={form.email}
            onChange={handleChange}
            className={`w-full border ${
              errors.email ? "border-red-500" : "border-gray-300"
            } p-2 rounded focus:ring-2 ${
              errors.email ? "focus:ring-red-300" : "focus:ring-blue-300"
            } outline-none`}
          />
          {errors.email && (
            <p className="text-red-600 text-sm mt-1">{errors.email}</p>
          )}
        </div>

    
        <div>
          <label className="block mb-1 font-medium">Password<span className="text-red-500">*</span></label>
          <div className="relative">
            <input
              name="password"
              type={showPassword ? "text" : "password"}
              placeholder="Enter your password"
              value={form.password}
              onChange={handleChange}
              className={`w-full border ${
                errors.password ? "border-red-500" : "border-gray-300"
              } p-2 rounded pr-10 focus:ring-2 ${
                errors.password ? "focus:ring-red-300" : "focus:ring-blue-300"
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
          Sign In
        </button>

        <p className="mt-4 text-center text-sm text-gray-700">
          New here?{" "}
          <a href="/signup" className="text-blue-600 underline hover:text-blue-800">
            Create an account
          </a>
        </p>
      </form>
    </div>
  );
}

