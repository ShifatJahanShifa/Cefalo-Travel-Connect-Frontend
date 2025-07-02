import { useEffect, useState } from "react";
import { getUserByUsername, updateUser } from "../services/userService";
import { useAuth } from "../hooks/useAuth";
import { uploadImageToCloudinary } from "../utils/cloudinary";

export default function ProfilePage() {
  const { username } = useAuth();
  const [user, setUser] = useState<any>(null);
  const [editingBio, setEditingBio] = useState(false);
  const [newBio, setNewBio] = useState("");
  const [profilePic, setProfilePic] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const data = await getUserByUsername(username!);
        setUser(data);
        setNewBio(data.bio || "");
        setProfilePic(data.profile_picture_url || null);
      } catch (err) {
        console.error("Failed to fetch user", err);
      } finally {
        setLoading(false);
      }
    };

    fetchUser();
  }, [username]);

   
const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
  const file = e.target.files?.[0];
  if (file) {
    try {
      const imageUrl = await uploadImageToCloudinary(file);
      setProfilePic(imageUrl); // Update UI
      const updated = await updateUser(username!, { profile_picture_url: imageUrl });
      setUser(updated); // Update user state
    } catch (err) {
      console.error("Failed to upload profile pic", err);
    }
  }
};

  const handleRemoveImage = async () => {
    setProfilePic(null);
    try {
        const updated = await updateUser(username!, { profile_picture_url: "" });
        setUser(updated);
    } catch (err) {
        console.error("Failed to remove image", err);
    }
  };

  const handleSaveBio = async () => {
    try {
      const updated = await updateUser(username!, { bio: newBio });
      setUser(updated);
      setEditingBio(false);
    } catch (err) {
      console.error("Failed to update bio", err);
    }
  };

  if (loading || !user) return <p className="text-center mt-10">Loading profile...</p>;

  return (
    <div className="max-w-2xl mx-auto p-6 bg-white rounded shadow mt-10 space-y-6">
      {/* Profile Picture */}
      <div className="flex items-center space-x-4">
        <img
          src={profilePic || "https://via.placeholder.com/120"}
          alt="Profile"
          className="w-28 h-28 rounded-full object-cover border"
        />
        <div className="flex flex-col space-y-2">
          {!profilePic && (<label className="cursor-pointer text-blue-600 underline">
            Add Picture
            <input type="file" accept="image/*" onChange={handleImageUpload} className="hidden" />
          </label>)}
          {profilePic && (
            <button onClick={handleRemoveImage} className="text-red-500 underline">
              Remove Picture
            </button>
          )}
        </div>
      </div>

      {/* Bio Section */}
      <div>
        <h3 className="font-semibold text-lg mb-1">Bio</h3>
        {editingBio ? (
          <div className="space-y-2">
            <textarea
              value={newBio}
              onChange={(e) => setNewBio(e.target.value)}
              className="border p-2 w-full rounded"
            />
            <button onClick={handleSaveBio} className="bg-blue-600 text-white px-4 py-1 rounded">
              Save Bio
            </button>
          </div>
        ) : (
          <div className="space-y-1">
            <p>{user.bio || "No bio yet."}</p>
            <button onClick={() => setEditingBio(true)} className="text-blue-600 underline">
              Change Bio
            </button>
          </div>
        )}
      </div>

      {/* Account Info */}
      <div>
        <h3 className="font-semibold text-lg mb-2">Account Info</h3>
        <p>
          <strong>Username:</strong> {user.username}
        </p>
        <p>
          <strong>Email:</strong> {user.email}
        </p>
        <p>
          <strong>Role:</strong> {user.role}
        </p>
      </div>
    </div>
  );
}
