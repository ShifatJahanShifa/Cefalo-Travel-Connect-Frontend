// components/Navbar.tsx
import { Link, useNavigate } from "react-router-dom";
import { logout } from "../services/authService";

export default function Navbar() {
  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem("user") || "null");

  const handleLogout = () => {
    logout();
    navigate("/");
  };

  return (
    <nav className="flex justify-between items-center px-6 py-3 bg-blue-100 text-white">
      <div className="space-x-4">
        {user ? (
            <>
            <h1 className="text-xl font-bold text-blue-900">Cefalo Travel Connect</h1>
            <Link to="/home">Home</Link>
            <Link to="/create-post">Create Post</Link>
            <button onClick={handleLogout} className="underline">
              Logout
            </button>
          </>
        ) : (
          <h1 className="text-xl font-bold text-black">Cefalo Travel Connect</h1>
        )}
      </div>
    </nav>
  );
}
