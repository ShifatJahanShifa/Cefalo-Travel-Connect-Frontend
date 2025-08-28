import { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { createWishlist, updateWishlist } from "../../services/wishlistService";
import type { getWishlistType, wishlist } from "../../types/wishlist";
import { toast } from "react-toastify";
import { logger } from "../../utils/logger";

interface Props {
  initialData?: wishlist;
  onSubmitSuccess?: () => void;
}

export default function WishlistForm({ initialData, onSubmitSuccess }: Props) {
  const [formData, setFormData] = useState<wishlist>({
    place_name: "",
    latitude: 0,
    longitude: 0,
    type: "place",
    title: "",
    theme: "",
    region: "",
    note: "",
    is_public: false,
  });

  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    if (initialData) {
      setFormData(initialData);
    }
  }, [initialData]);

  useEffect(() => {
    const state = location.state;
    if (state?.lat && state?.lng && state?.place_name) {
      setFormData((prev) => ({
        ...prev,
        latitude: state.lat,
        longitude: state.lng,
        place_name: state.place_name,
      }));
      window.history.replaceState({}, document.title);
    }
  }, [location.state]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    const newValue = type === "checkbox" ? (e.target as HTMLInputElement).checked : value;
    setFormData({ ...formData, [name]: newValue });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (initialData) {
        await updateWishlist(initialData.wishlist_id!, formData);
        toast.success("Successfully updated wishlist")
      } 
      else {
        await createWishlist(formData);
        toast.success("Successfully created wishlist")
        navigate("/wishlists");
      }
      onSubmitSuccess?.();
    } 
    catch (err) {
      logger.error("Failed to save wishlist:", err);
      alert("Failed to save wishlist. Check console for details.");
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="max-w-2xl mx-auto p-8 bg-sky-100 border border-sky-400 mt-10 mb-10 rounded-2xl shadow space-y-6"
    >
      <h2 className="text-2xl font-bold text-blue-800">
        {initialData ? "Edit Wishlist" : "Create Wishlist"}
      </h2>
      <p><span className="text-red-500">*</span> indicates required field</p>

      <div className="space-y-1">
        <label className="block text-sm font-medium text-gray-700">Place Name<span className="text-red-500">*</span></label>
        <div className="flex gap-2">
          <input
            type="text"
            name="place_name"
            value={formData.place_name}
            onChange={handleChange}
            placeholder="Enter place name"
            className="flex-1 border border-black rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400"
            required
          />
          <button
            type="button"
            onClick={() =>
              navigate("/wishlist/map", {
                state: {
                  returnTo: location.pathname,
                },
              })
            }
            className="px-4 py-2 text-sm text-white bg-blue-600 hover:bg-blue-700 rounded"
          >
            Select on Map
          </button>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700">Latitude<span className="text-red-500">*</span></label>
          <input
            name="latitude"
            value={formData.latitude}
            readOnly
            className="w-full border bg-gray-100 px-3 py-2 rounded"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700">Longitude<span className="text-red-500">*</span></label>
          <input
            name="longitude"
            value={formData.longitude}
            readOnly
            className="w-full border bg-gray-100 px-3 py-2 rounded"
          />
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700">Title<span className="text-red-500">*</span></label>
        <input
          name="title"
          value={formData.title}
          onChange={handleChange}
          placeholder="Title of your wishlist"
          className="w-full border px-3 py-2 rounded focus:outline-none focus:ring-2 focus:ring-blue-400"
          required
        />
      </div>

    
      <div className="hidden">
        <label className="block text-sm font-medium text-gray-700">Type<span className="text-red-500">*</span></label>
        <input
          name="type"
          value={formData.type}
          onChange={handleChange}
          placeholder="e.g. Beach, Mountain, City"
          className="w-full border px-3 py-2 rounded focus:outline-none focus:ring-2 focus:ring-blue-400"
          required
        />
      </div>

    
      <div>
        <label className="block text-sm font-medium text-gray-700">Theme<span className="text-red-500">*</span></label>
        <input
          name="theme"
          value={formData.theme}
          onChange={handleChange}
          placeholder="e.g., beach, hill, mountain etc"
          className="w-full border px-3 py-2 rounded focus:outline-none focus:ring-2 focus:ring-blue-400"
        />
      </div>

   
      <div>
        <label className="block text-sm font-medium text-gray-700">Region<span className="text-red-500">*</span></label>
        <input
          name="region"
          value={formData.region}
          onChange={handleChange}
          placeholder="e.g., aisa, north america, south africa etc"
          className="w-full border px-3 py-2 rounded focus:outline-none focus:ring-2 focus:ring-blue-400"
        />
      </div>


      <div>
        <label className="block text-sm font-medium text-gray-700">Note<span className="text-red-400">*</span></label>
        <textarea
          name="note"
          value={formData.note}
          onChange={handleChange}
          placeholder="Additional notes..."
          className="w-full border px-3 py-2 rounded h-24 resize-none focus:outline-none focus:ring-2 focus:ring-blue-400"
          required
        />
      </div>


      <div className="flex items-center space-x-2">
        <input
          type="checkbox"
          name="is_public"
          checked={formData.is_public}
          onChange={handleChange}
          className="h-4 w-4 text-blue-600"
        />
        <label htmlFor="is_public" className="text-sm text-gray-700">
          Make public
        </label>
      </div>

      <div>
        <button
          type="submit"
          className="w-full bg-blue-600 text-white py-2 px-4 rounded hover:bg-blue-700 transition"
        >
          {initialData ? "Update Wishlist" : "Create Wishlist"}
        </button>
      </div>
    </form>
  );
}
