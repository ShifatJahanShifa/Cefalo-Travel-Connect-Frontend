import { Link, useNavigate } from "react-router-dom";
import { userSignout } from "../services/authService";
import { useAuth } from "../hooks/useAuth";
import { useEffect } from "react";

export default function Navbar() {
    const navigate = useNavigate();
    const { signout } = useAuth();
    const { username, isLoading } = useAuth();

    console.log(username)

    const handleLogout = async () => {
        try {
            await userSignout()
            signout()
            navigate("/");
        }
        catch (error) 
        {
            alert("Signout failed");
            console.error(error);
        }
    };

    // for debugging purpose
    useEffect(() => {
        if (!isLoading) {
            console.log("Username after load:", username);
        }
    }, [isLoading, username]);

    return (
        <nav className="flex flex-row justify-between space items-center gap-6 px-6 py-3 bg-blue-10 text-black">
            <div className="space-x-2">
                {username ? (
                    <div className="flex flex-row justify-between gap-70 items-center">
                        <div>
                            <h1 className="text-xl font-bold text-blue-900">Cefalo Travel Connect</h1>
                        </div>
                        <div className="flex flex-row justify-between gap-10 items-center"> 
                            <Link to="/home" className="hover:text-blue-700">Home</Link>
                            <Link to="/posts/create" className="hover:text-blue-700">Create Post</Link>
                            <Link to="/wishlists" className="hover:text-blue-700">Wishlists</Link>
                            <Link to='/travelplans' className="hover:text-blue-700">TravelPlans</Link>
                            <Link to='/nearby' className="hover:text-blue-700">Nearby Services</Link>
                            <Link to='/dashboard' className="hover:text-blue-700">Dashboard</Link>
                            <Link to='/profile' className="hover:text-blue-700">Profile</Link>
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
