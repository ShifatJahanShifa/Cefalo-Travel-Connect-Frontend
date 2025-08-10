import type { getWishlistType, groupedUsers } from "../../types/wishlist";
import { useParams, useNavigate, useLocation } from "react-router-dom";
import { useEffect, useState } from "react";
import { getWishlistById, getInterestedUsers, toggleVisibility } from "../../services/wishlistService";
import { useAuth } from "../../hooks/useAuth";
import { createProximity, getProximityByUsername } from "../../services/proximityService";
import { Link } from "react-router-dom";

export default function ViewWishlistPage() {
  const { wishlist_id } = useParams();
  const [wishlist, setWishlist] = useState<getWishlistType | null>(null);
  const location = useLocation();
  const { user_id, username } = useAuth();

  const [interestedUsers, setInterestedUsers] = useState<groupedUsers[]>([]);
  const [showUsers, setShowUsers] = useState(false);
  const [showRadiusInput, setShowRadiusInput] = useState(false);
  const [radius, setRadius] = useState("");
  const [radiusStatus, setRadiusStatus] = useState("");
  const [hasExistingRadius, setHasExistingRadius] = useState(false);
  const [isPublic, setIsPublic] = useState(false)


  const data = location.state as getWishlistType;

  useEffect(() => {
    const fetchWishlist = async () => {
      try {
        const result = await getWishlistById(wishlist_id!);
        setWishlist(result);
        setIsPublic(result.is_public)
      } catch (err) {
        console.error("Error fetching post:", err);
      }
    };

    const fetchProximity = async () => {
      try {
        let proximity = await getProximityByUsername(username!);
        proximity = proximity.filter(p => p.reference_id === wishlist_id);
        if (proximity.length > 0 && proximity[0].radius) {
          setHasExistingRadius(true);
          setRadius((proximity[0].radius).toString());
        } else {
          setHasExistingRadius(false);
        }
      } 
      catch (err) {
        console.warn("No existing radius found for this wishlist.");
        setHasExistingRadius(false);
      }
    };

    fetchWishlist();
    fetchProximity();
  }, [user_id, wishlist_id]);

  if (!wishlist) return <p className="text-center text-gray-500">Loading...</p>;

  const handleFetchInterestedUsers = async () => {

    if (showUsers) {
      setShowUsers(false);
      return;
    }
    try {
      let users = await getInterestedUsers(wishlist.theme);
      users = users.filter(user => user.user_id !== user_id)
      setInterestedUsers(users);
      setShowUsers(true);
    } catch (err) {
      setInterestedUsers([]);
      setShowUsers(prev => !prev);
      console.error("Failed to fetch interested users", err);
    }
  };

  const handleSetRadius = async () => {
    if (!radius.trim()) return;
    const data = {
      user_id: user_id!,
      type: "wishlist",
      reference_id: wishlist_id!,
      radius: parseFloat(radius)
    };
    try {
      await createProximity(data);
      setRadiusStatus("Alert radius set successfully!");
      setHasExistingRadius(true);
      setRadius(radius);
      setShowRadiusInput(false);
    } catch (err) {
      console.error("Failed to set alert radius", err);
      setRadiusStatus("Failed to set alert.");
    }
  };

  const handleCancelUpdate = async () => {
    setShowRadiusInput(false)
  }

  const handleVisibility = async () => {
    try {
      const result = await toggleVisibility(wishlist.wishlist_id)
      setIsPublic(!wishlist.is_public)
    }
    catch (error: any) 
    {
      console.error("Failed to toggle visibility", error);
    }
  }

  return (
    <div className="p-6 max-w-3xl mx-auto bg-sky-100 rounded border border-sky-400 mt-10 mb-10 shadow-xl space-y-10">
      <div className="flex flex-row gap-10 justify-between items-center">
        <h1 className="text-3xl font-bold text-blue-700 mb-4">{wishlist.title}</h1>
        <span className="bg-green-500 px-2 py-2 hover:bg-green-600 rounded-2xl text-white"> { wishlist.is_public ? "Public" : "Private"}</span>
      </div>

      <div className="grid grid-cols-1  gap-4">
        <p><span className="font-semibold">Place:</span> {data.place_name}</p>
        <p><span className="font-semibold">Latitude:</span> {wishlist.place_latitude}</p>
        <p><span className="font-semibold">Longitude:</span> {wishlist.place_longitude}</p>
        <p><span className="font-semibold">Theme:</span> {wishlist.theme}</p>
        <p><span className="font-semibold">Region:</span> {wishlist.region}</p>
        <p><span className="font-semibold">Note:</span> {wishlist.note}</p>
      </div>

      {wishlist.user_id === user_id && (
        <div className="space-y-4">
          <div className="flex gap-4">
            <button
              onClick={handleFetchInterestedUsers}
              className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600"
            >
              {showUsers ? "Hide Interested Users" : "View Interested Users"}
            </button>

            <button
              onClick={() => setShowRadiusInput((prev) => !prev)}
              className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600"
            >
              {hasExistingRadius ? "Update Alert Radius" : "Set Alert Radius"}
            </button>

            <button
              onClick={handleVisibility}
              className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600"
            >
            { isPublic ? "Make it Private" : "Make it Public"}
            </button>
          </div>

          {showUsers && (
            <div className="bg-gray-50 border p-4 rounded">
              <h4 className="font-semibold text-lg mb-3">Interested Users</h4>
              {interestedUsers.length === 0 ? (
                <p className="text-sm text-gray-600">No interested users found.</p>
              ) : (
                <div className="list-disc list-inside space-y-1">
                  {interestedUsers.map((user, idx) => (
                    <div
                      key={idx}
                      className="flex items-start gap-4 p-4 border border-gray-200 bg-white rounded-lg shadow-sm hover:shadow-md transition"
                    >
                     
                      <img
                        src={user.profile_picture_url || "/default-avatar.png"}
                        alt={`${user.username}'s profile`}
                        className="w-12 h-12 rounded-full object-cover border border-gray-300"
                      />

                    
                      <div className="flex flex-col">
                        <div className="flex items-center gap-2">
                          <h3 className="text-md font-semibold text-gray-800">{user.username}</h3>
                        </div>
                        <p className="text-sm text-gray-800">{user.email}</p>
                        <p className="text-sm text-gray-800">Wishlist Id: {user.wishlist_id}</p>                            
                      </div>
                    </div>
                  ))}

                </div>
              )}
            </div>
          )}

          {showRadiusInput && (
            <div className="bg-white border p-4 rounded space-y-2">
              <label className="block font-medium">Enter Alert radius (in km):</label>
              <input
                type="number"
                value={radius}
                onChange={(e) => setRadius(e.target.value)}
                className="border p-2 rounded w-full"
              />
              <div className="flex flex-row gap-10">
              <button
                onClick={handleSetRadius}
                className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700"
              >
                Set Radius
              </button>
              <button
                onClick={handleCancelUpdate}
                className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-700"
              >
                Cancel
              </button>
              </div>
              {radiusStatus && <p className="text-sm text-gray-700">{radiusStatus}</p>}

            </div>
          )}
        </div>
      )}
    </div>
  );
}
