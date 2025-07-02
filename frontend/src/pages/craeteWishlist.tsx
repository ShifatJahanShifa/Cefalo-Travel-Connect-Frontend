import { useState } from "react";
import { createWishlist } from "../services/wishlistService";
import { useNavigate } from "react-router-dom";
import { fetchLocationFromMapbox } from "../utils/mapboxfetcher"; // custom helper

export default function CreateWishlistPage() {
  const [form, setForm] = useState({
    place_name: "",
    type: "",
    title: "",
    theme: "",
    region: "",
    note: "",
    is_public: false,
    latitude: 0,
    longitude: 0,
  });

  const [loadingLocation, setLoadingLocation] = useState(false);
  const navigate = useNavigate();

//   const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
//     const { name, value, type, checked } = e.target;
//     setForm((prev) => ({
//       ...prev,
//       [name]: type === "checkbox" ? checked : value,
//     }));
//   };


  const handleChange = (
  e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
) => {
  const { name, value, type } = e.target;

  if (type === "checkbox") {
    const checked = (e.target as HTMLInputElement).checked;
    setForm((prev) => ({
      ...prev,
      [name]: checked,
    }));
  } else {
    setForm((prev) => ({
      ...prev,
      [name]: value,
    }));
  }
};

  const handleLocationLookup = async () => {
    if (!form.place_name) return alert("Enter place name first");
    setLoadingLocation(true);
    try {
      const coordinates = await fetchLocationFromMapbox(form.place_name);
      if (!coordinates) {
        alert("Location not found");
        return;
    }

        setForm((prev) => ({
        ...prev,
        latitude: coordinates.latitude,
        longitude: coordinates.longitude,
        }));
    
    } catch (err) {
      alert("Location not found.");
    } finally {
      setLoadingLocation(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await createWishlist(form);
      alert("Wishlist created successfully!");
      navigate("/wishlist");
    } catch (err) {
      alert("Failed to create wishlist.");
    }
  };

  return (
    <div className="max-w-3xl mx-auto p-6 bg-white shadow rounded mt-10">
      <h2 className="text-2xl font-bold mb-4">Create Wishlist</h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        <input name="title" placeholder="Title" className="w-full border p-2" required value={form.title} onChange={handleChange} />
        <input name="place_name" placeholder="Place Name" className="w-full border p-2" required value={form.place_name} onChange={handleChange} />

        <button type="button" onClick={handleLocationLookup} className="text-blue-600 underline">
          {loadingLocation ? "Fetching..." : "Fetch Latitude/Longitude"}
        </button>

        <div className="flex gap-4">
          <input name="latitude" value={form.latitude} className="w-1/2 border p-2 bg-gray-100" readOnly />
          <input name="longitude" value={form.longitude} className="w-1/2 border p-2 bg-gray-100" readOnly />
        </div>

        <input name="type" placeholder="Type" className="w-full border p-2" value={form.type} onChange={handleChange} />
        <input name="theme" placeholder="Theme" className="w-full border p-2" value={form.theme} onChange={handleChange} />
        <input name="region" placeholder="Region" className="w-full border p-2" value={form.region} onChange={handleChange} />
        <textarea name="note" placeholder="Note" className="w-full border p-2 h-24" value={form.note} onChange={handleChange} />

        <label className="flex items-center gap-2">
          <input type="checkbox" name="is_public" checked={form.is_public} onChange={handleChange} />
          Make Public
        </label>

        <button type="submit" className="bg-blue-600 text-white px-4 py-2 rounded">
          Create Wishlist
        </button>
      </form>
    </div>
  );
}
