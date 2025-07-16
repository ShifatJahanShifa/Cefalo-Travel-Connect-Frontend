import { useEffect, useState } from "react";
import { getUserByUsername, updateUser } from "../services/userService";
import { useAuth } from "../hooks/useAuth";
import { uploadImageToCloudinary } from "../utils/cloudinary";
import { Camera, Save, X, User, Mail, Shield, Settings, Trash2, PhoneCall, CalendarDays } from "lucide-react";
import type { updateUserInfo } from "../types/user";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";

export default function ProfilePage() {
  const { username } = useAuth();
  const [user, setUser] = useState<any>(null);
  const [editingBio, setEditingBio] = useState(false);
  const [newBio, setNewBio] = useState("");
  const [profilePic, setProfilePic] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [showPasswordField, setShowPasswordField] = useState(false);
  const [newPassword, setNewPassword] = useState("");
  const [editingPhone, setEditingPhone] = useState(false);
  const [newPhone, setNewPhone] = useState("");
  const navigate = useNavigate()

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const data = await getUserByUsername(username!);
        setUser(data);
        setNewBio(data.bio || "");
        setProfilePic(data.profile_picture_url || null);
        setNewPhone(data.phone_no || "");

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
        setProfilePic(imageUrl);
        toast.success("Successfully uploaded image")
        const updated = await updateUser(username!, { profile_picture_url: imageUrl });
        setUser(updated);
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

  const handleUpdatePassword = async () => {
    if (!newPassword.trim()) return alert("Password cannot be empty!");
    try {
      const data: updateUserInfo = {
        hashed_password: newPassword.trim()
      }
      await updateUser(username!, data);
      toast.success("Password updated successfully.");
      setShowPasswordField(false);
      setNewPassword("");
      navigate('/signin')
    } catch (err) {
      console.error("Failed to update password", err);
      alert("Failed to update password.");
    }
  };

  if (loading || !user)
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600">Loading profile...</p>
        </div>
      </div>
    );

  return (
    <div className="min-h-screen mt-10 bg-gradient-to-br from-blue-50 to-indigo-100 py-12 px-4">
      <div className="max-w-3xl mx-auto bg-sky-100 rounded-2xl shadow-lg p-8 space-y-8">
        
        <div className="flex justify-center items-center flex-col space-x-6">
          <div className="relative">
            <div className="w-28 h-28 rounded-full overflow-hidden border-4 border-blue-100">
              <img
                src={profilePic || `/images/none.jpg`}
                alt="Profile"
                className="w-full h-full object-cover border shadow-2xl"
              />
            </div>
            <div className="absolute -bottom-2 -right-2">
              <label className="w-8 h-8 bg-blue-500 hover:bg-blue-600 rounded-full flex items-center justify-center cursor-pointer shadow-lg transition-colors duration-200">
                <Camera className="w-4 h-4 text-white" />
                <input type="file" accept="image/*" onChange={handleImageUpload} className="hidden" />
              </label>
            </div>
          </div>
          {profilePic && (
            <button
              onClick={handleRemoveImage}
              className="text-red-600 hover:underline text-sm mt-3 text-center font-medium"
            >
              <Trash2 className="inline w-4 h-4 mr-1" /> Remove Picture
            </button>
          )}
        </div>

        <div className="bg-sky-50 p-8 border border-sky-400 rounded-xl">
          <div className="flex items-center justify-between mb-2">
            <h3 className="text-xl font-semibold text-gray-900 flex items-center">
              <User className="w-5 h-5 mr-2 text-blue-600" /> About Me
            </h3>
            {!editingBio && (
              <button
                onClick={() => setEditingBio(true)}
                className="text-blue-600 hover:underline text-sm font-medium"
              >
                Edit
              </button>
            )}
          </div>

          {editingBio ? (
            <div className="space-y-2">
              <textarea
                value={newBio}
                onChange={(e) => setNewBio(e.target.value)}
                className="w-full h-28 border border-gray-300 rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
              />
              <div className="flex gap-3">
                <button
                  onClick={handleSaveBio}
                  className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700 flex items-center"
                >
                  <Save className="w-4 h-4 mr-2" /> Save Bio
                </button>
                <button
                  onClick={() => setEditingBio(false)}
                  className="bg-gray-100 text-gray-700 px-4 py-2 rounded hover:bg-gray-200 flex items-center"
                >
                  <X className="w-4 h-4 mr-2" /> Cancel
                </button>
              </div>
            </div>
          ) : (
            <p className="text-gray-700 leading-relaxed">
              {user.bio || "No bio yet. Click edit to add something about yourself."}
            </p>
          )}
        </div>

        <div>
          <h3 className="text-xl font-semibold text-gray-900 mb-4 flex items-center">
            <Settings className="w-5 h-5 mr-2 text-blue-600" /> Account Info
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="bg-sky-50 p-4 rounded-lg flex items-center">
              <User className="w-5 h-5 text-gray-400 mr-3" />
              <div>
                <p className="text-sm text-gray-500">Username</p>
                <p className="text-gray-900 font-medium">{user.username}</p>
              </div>
            </div>
            <div className="bg-sky-50 p-4 rounded-lg flex items-center">
              <Mail className="w-5 h-5 text-gray-400 mr-3" />
              <div>
                <p className="text-sm text-gray-500">Email</p>
                <p className="text-gray-900 font-medium">{user.email}</p>
              </div>
            </div>
            <div className="bg-sky-50 p-4 rounded-lg flex items-center">
              <Shield className="w-5 h-5 text-gray-400 mr-3" />
              <div>
                <p className="text-sm text-gray-500">Role</p>
                <span className="inline-flex items-center px-2 py-1 bg-blue-100 text-blue-800 text-xs font-medium rounded-full">
                  {user.role}
                </span>
              </div>
            </div>
           

            <div className="bg-sky-50 p-4 rounded-lg flex items-start justify-between">
              <div className="flex items-center">
                <PhoneCall className="w-5 h-5 text-gray-400 mr-3 mt-1" />
                <div>
                  <p className="text-sm text-gray-500">Phone No</p>
                  {editingPhone ? (
                    <input
                      type="text"
                      value={newPhone}
                      onChange={(e) => setNewPhone(e.target.value)}
                      className="w-full border border-gray-300 rounded px-2 py-1 mt-1"
                    />
                  ) : (
                    <p className="text-gray-900 font-medium">{user.phone_no ?? "Not set yet"}</p>
                  )}
                </div>
              </div>
              {editingPhone ? (
                <div className="flex gap-2 ml-4">
                  <button
                    onClick={async () => {

                      try {
                        const data: updateUserInfo ={
                          phone_no: newPhone.trim()
                        }
                        const updated = await updateUser(username!, data);
                        setUser(updated);
                        setEditingPhone(false);
                      } catch (err) {
                        alert("Failed to update phone number");
                      }
                    }}
                    className="text-green-600 hover:underline text-sm font-medium"
                  >
                    Save
                  </button>
                  <button
                    onClick={() => {
                      setEditingPhone(false);
                      setNewPhone(user.phone_no || "");
                    }}
                    className="text-gray-600 hover:underline text-sm font-medium"
                  >
                    Cancel
                  </button>
                </div>
              ) : (
                <button
                  onClick={() => setEditingPhone(true)}
                  className="text-blue-600 hover:underline text-sm font-medium ml-4"
                >
                  Edit
                </button>
              )}
            </div>

            <div className="bg-gray-50 p-4 rounded-lg flex items-center">
              <CalendarDays className="w-5 h-5 text-gray-400 mr-3" />
              <div>
                <p className="text-sm text-gray-500">Joined At</p>
                <p className="text-gray-900 font-medium">
                  {new Date(user.created_at).toISOString().split("T")[0]}
                </p>
              </div>
            </div>

          </div>
        </div>

        <div className="pt-4 border-t">
          <h3 className="text-xl font-semibold text-gray-900 mb-4 flex items-center">
            <Shield className="w-5 h-5 mr-2 text-blue-600" /> Security
          </h3>
          {!showPasswordField ? (
            <button
              onClick={() => setShowPasswordField(true)}
              className="text-blue-600 hover:underline text-sm font-medium"
            >
              Change Password
            </button>
          ) : (
            <div className="space-y-3">
              <input
                type="password"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                placeholder="Enter new password"
                className="w-full p-3 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-400"
              />
              <div className="flex gap-3">
                <button
                  onClick={handleUpdatePassword}
                  className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700"
                >
                  Save Password
                </button>
                <button
                  onClick={() => {
                    setShowPasswordField(false);
                    setNewPassword("");
                  }}
                  className="bg-red-500 text-white p-2 rounded"
                >
                  Cancel
                </button>
              </div>
            </div>
          )}
        </div> 
      </div>
    </div>
  );
}