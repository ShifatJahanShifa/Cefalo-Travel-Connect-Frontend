import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { createPost } from "../../services/postService";

const effortLevels = ["easy", "medium", "hard"];
const categories = [
  "Adventure",
  "Beach",
  "Cultural Site",
  "Budget Travel",
  "Historical",
  "Nature",
  "Heritage",
];



// i am adding two needed fucntions. 

async function fetchLatLng(placeName: string) {
    if (!placeName) return null;
    const url = `https://nominatim.openstreetmap.org/search?q=${encodeURIComponent(
      placeName
    )}&format=json&limit=1`;

    try {
      const res = await fetch(url);
      const data = await res.json();
      if (data && data.length > 0) {
        return {
          latitude: parseFloat(data[0].lat),
          longitude: parseFloat(data[0].lon),
        };
      }
    } 
    catch (error) {
      console.error("Geocoding failed:", error);
    }
    return null;
}


async function uploadImageToCloudinary(file: File) {
    const url = `https://api.cloudinary.com/v1_1/dwdtpwu38/image/upload`;

    const formData = new FormData();
    formData.append("file", file);
    formData.append("upload_preset", "CTConnect");  

    try {
      const response = await fetch(url, {
        method: "POST",
        body: formData,
      });

      const data = await response.json();

      if (data.secure_url) {
        return data.secure_url;
      } else {
        console.error("Upload failed", data);
        return null;
      }
    } catch (error) {
      console.error("Error uploading image", error);
      return null;
    }
}

export default function PostForm() {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    title: "",
    description: "",
    total_cost: 0,
    duration: "",
    effort: "",
    categories: [] as string[],
    accommodations: [] as any[],
    transports: [] as any[],
    places: [] as any[],
    foods: [] as any[],
    images: [] as any[],
  });

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };


  const handleAddSectionItem = (section: string, newItem: any) => {
    setFormData({
      ...formData,
      [section]: [...(formData as any)[section], newItem],
    });
  };


  const handleRemoveSectionItem = (section: string, index: number) => {
    const updated = [...(formData as any)[section]];
    updated.splice(index, 1);
    setFormData({
      ...formData,
      [section]: updated,
    });
  };


  const handleNestedChange = (
    section: string,
    index: number,
    field: string,
    value: any
  ) => {
    const updated = [...(formData as any)[section]];
    updated[index][field] = value;
    setFormData({ ...formData, [section]: updated });
  };


  const handleAccommodationNameChange = async (
    index: number,
    value: string
  ) => {
    const updated = [...formData.accommodations];
    updated[index].accommodation_name = value;
    setFormData({ ...formData, accommodations: updated });

    if (value.trim()) {
      const coords = await fetchLatLng(value);
      if (coords) {
        updated[index].latitude = coords.latitude;
        updated[index].longitude = coords.longitude;
        setFormData({ ...formData, accommodations: updated });
      }
    }
  };


  const handlePlaceNameChange = async (index: number, value: string) => {
    const updated = [...formData.places];
    updated[index].place_name = value;
    setFormData({ ...formData, places: updated });

    if (value.trim()) {
      const coords = await fetchLatLng(value);
      if (coords) {
        updated[index].latitude = coords.latitude;
        updated[index].longitude = coords.longitude;
        setFormData({ ...formData, places: updated });
      }
    }
  };


  const handleImageFileChange = async (
    index: number,
    file: File | null
  ) => {
    if (!file) return;
    const url = await uploadImageToCloudinary(file);
    if (url) {
      const updated = [...formData.images];
      updated[index].image_url = url;
      setFormData({ ...formData, images: updated });
    } else {
      alert("Image upload failed. Try again.");
    }
  };

 
  const normalizeNumberFields = (arr: any[], fields: string[]) =>
    arr.map((item) => {
      const converted = { ...item };
      fields.forEach((field) => {
        if (converted[field] !== undefined && converted[field] !== "") {
          converted[field] = Number(converted[field]);
        }
      });
      return converted;
    });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // currently hardcoded
    const user_id = "510b9fec-1fbe-4c94-a91b-3f9eaf83afd1";

    const payload = {
      ...formData,
      user_id,
      total_cost: Number(formData.total_cost),
      accommodations: normalizeNumberFields(formData.accommodations, [
        "latitude",
        "longitude",
        "cost",
        "rating",
      ]),
      transports: normalizeNumberFields(formData.transports, ["cost", "rating"]),
      places: normalizeNumberFields(formData.places, [
        "latitude",
        "longitude",
        "cost",
        "rating",
      ]),
      foods: normalizeNumberFields(formData.foods, ["cost", "rating"]),
     
    };

    console.log("Payload being sent to backend:", payload);

    try {
      const result = await createPost(payload);
      console.log("Post created:", result);
      navigate("/");
    } catch (err) {
      console.error("Post creation failed:", err);
      alert("Post creation failed. Check console for details.");
    }
  };

  const renderSection = (sectionName: string, fields: string[]) => (
    <div className="space-y-4">
      <h3 className="text-lg font-semibold">{sectionName}</h3>
      {(formData as any)[sectionName.toLowerCase()].map(
        (item: any, idx: number) => (
          <div key={idx} className="border p-3 rounded bg-gray-50">
            {fields.map((field) => {
              // For accommodations: use special handler on accommodation_name field
              if (
                sectionName === "Accommodations" &&
                field === "accommodation_name"
              ) {
                return (
                  <input
                    key={field}
                    type="text"
                    placeholder="Accommodation Name"
                    value={item[field] || ""}
                    onChange={(e) =>
                      handleAccommodationNameChange(idx, e.target.value)
                    }
                    className="w-full border p-2 mb-2"
                    name={field}
                  />
                );
              }

              // For places: special handler on place_name
              if (sectionName === "Places" && field === "place_name") {
                return (
                  <input
                    key={field}
                    type="text"
                    placeholder="Place Name"
                    value={item[field] || ""}
                    onChange={(e) => handlePlaceNameChange(idx, e.target.value)}
                    className="w-full border p-2 mb-2"
                    name={field}
                  />
                );
              }

              // For images, handle file upload input for image_url field
              if (sectionName === "Images" && field === "image_url") {
                return (
                  <div key={field} className="mb-2">
                    <input
                      type="file"
                      accept="image/*"
                      onChange={async (e) => {
                        const file = e.target.files?.[0] ?? null;
                        await handleImageFileChange(idx, file);
                      }}
                      className="w-full border p-2 mb-1"
                    />
                    {item.image_url && (
                      <img
                        src={item.image_url}
                        alt="Uploaded"
                        className="w-32 h-20 object-cover rounded"
                      />
                    )}
                  </div>
                );
              }

              // Default input for all other fields
              return (
                <input
                  key={field}
                  type="text"
                  placeholder={field.replace(/_/g, " ")}
                  value={item[field] || ""}
                  onChange={(e) =>
                    handleNestedChange(
                      sectionName.toLowerCase(),
                      idx,
                      field,
                      e.target.value
                    )
                  }
                  className="w-full border p-2 mb-2"
                  name={field}
                />
              );
            })}
            <button
              type="button"
              className="text-red-500 underline"
              onClick={() => handleRemoveSectionItem(sectionName.toLowerCase(), idx)}
            >
              Remove
            </button>
          </div>
        )
      )}
      <button
        type="button"
        className="text-blue-600 underline"
        onClick={() => handleAddSectionItem(sectionName.toLowerCase(), {})}
      >
        Add {sectionName.slice(0, -1)}
      </button>
    </div>
  );

  return (
    <form
      onSubmit={handleSubmit}
      className="max-w-4xl mx-auto p-4 bg-white rounded shadow space-y-6"
    >
      <h2 className="text-2xl font-bold">Create Travel Post</h2>

      <input
        name="title"
        value={formData.title}
        onChange={handleChange}
        placeholder="Title"
        className="w-full border p-2"
      />
      <textarea
        name="description"
        value={formData.description}
        onChange={handleChange}
        placeholder="Description"
        className="w-full border p-2 h-24"
      />
      <input
        name="total_cost"
        type="number"
        value={formData.total_cost}
        onChange={handleChange}
        placeholder="Total Cost (e.g. 500.00)"
        className="w-full border p-2"
      />
      <input
        name="duration"
        value={formData.duration}
        onChange={handleChange}
        placeholder="Duration"
        className="w-full border p-2"
      />

      <select
        name="effort"
        value={formData.effort}
        onChange={handleChange}
        className="w-full border p-2"
      >
        <option value="">Select Effort</option>
        {effortLevels.map((level) => (
          <option key={level} value={level}>
            {level}
          </option>
        ))}
      </select>

      <select
        name="categories"
        multiple
        value={formData.categories}
        onChange={(e) =>
          setFormData({
            ...formData,
            categories: Array.from(e.target.selectedOptions, (option) => option.value),
          })
        }
        className="w-full border p-2 h-40"
      >
        {categories.map((cat) => (
          <option key={cat} value={cat}>
            {cat}
          </option>
        ))}
      </select>

      {renderSection("Accommodations", [
        "accommodation_type",
        "accommodation_name",
        "latitude",
        "longitude",
        "cost",
        "rating",
        "review",
      ])}
      {renderSection("Transports", [
        "transport_type",
        "transport_name",
        "cost",
        "rating",
        "review",
      ])}
      {renderSection("Places", [
        "place_name",
        "latitude",
        "longitude",
        "cost",
        "rating",
        "review",
      ])}
      {renderSection("Foods", ["food_name", "cost", "rating", "review"])}
      {renderSection("Images", ["image_url", "caption"])}

      <button type="submit" className="bg-blue-600 text-white px-4 py-2 rounded">
        Publish Post
      </button>
    </form>
  );
}