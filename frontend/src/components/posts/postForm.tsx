import { useState, useEffect } from "react";
import { fetchLocationFromMapbox } from "../../utils/mapboxfetcher";
import { uploadImageToCloudinary } from "../../utils/cloudinary";
import { useLocation, useNavigate } from "react-router-dom";

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


export default function PostForm({ initialData, onSubmit }: { initialData?: any; onSubmit: (data: any) => Promise<void> }) {
  const [formData, setFormData] = useState(initialData || {
    title: "",
    description: "",
    // total_cost: ,
    duration: "",
    effort: "",
    categories: [] as string[],
    accommodations: [] as any[],
    transports: [] as any[],
    places: [] as any[],
    foods: [] as any[],
    images: [] as any[],
  });


  const navigate = useNavigate();
  const location = useLocation();

  // useEffect(() => {
  //   if (location.state?.lat && location.state?.lng && location.state.section !== undefined) {
  //     const { section, index, lat, lng } = location.state;
  //     const updated = [...formData[section]];
  //     updated[index] = { ...updated[index], latitude: lat, longitude: lng };
  //     setFormData((prev: any) => ({
  //       ...prev,
  //       [section]: updated,
  //     }));

  //     window.history.replaceState({}, document.title);
  //   }
  // }, [location.state]);


  useEffect(() => {
  if (location.state?.lat && location.state?.lng && location.state.section !== undefined) {
    const { section, index, lat, lng, place_name } = location.state;
    const updated = [...formData[section]];
    updated[index] = {
      ...updated[index],
      latitude: lat,
      longitude: lng,
      ...(place_name ? { place_name } : {}),
    };

    setFormData((prev: any) => ({
      ...prev,
      [section]: updated,
    }));

    // Clear location.state to avoid reapplying
    window.history.replaceState({}, document.title);
  }
}, [location.state]);


  useEffect(() => {
    if (initialData) {
      setFormData(initialData);
    }
  }, [initialData]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
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

  const handleNestedChange = (section: string, index: number, field: string, value: any) => {
    const updated = [...(formData as any)[section]];
    updated[index][field] = value;
    setFormData({ ...formData, [section]: updated });
  };

  const handleAccommodationNameChange = async (index: number, value: string) => {
    const updated = [...formData.accommodations];
    updated[index].accommodation_name = value;
    setFormData({ ...formData, accommodations: updated });

    if (value.trim()) {
      try {
        const coords = await fetchLocationFromMapbox(value);
        if (coords) {
          updated[index].latitude = coords.latitude;
          updated[index].longitude = coords.longitude;
          setFormData({ ...formData, accommodations: updated });
        }
      } 
      catch(err) 
      {
        console.log(err)
      }
    }
  };

  const handlePlaceNameChange = async (index: number, value: string) => {
    const updated = [...formData.places];
    updated[index].place_name = value;
    setFormData({ ...formData, places: updated });

    if (value.trim()) {
      try {
        const coords = await fetchLocationFromMapbox(value);
        if (coords) {
          updated[index].latitude = coords.latitude;
          updated[index].longitude = coords.longitude;
          setFormData({ ...formData, places: updated });
        }
      } 
      catch(err) 
      {
        console.log(err)
      }
    }
  };

  const handleImageFileChange = async (index: number, file: File | null) => {
    if (!file) return;
    const url = await uploadImageToCloudinary(file);
    if (url) 
    {
      const updated = [...formData.images];
      updated[index].image_url = url;
      setFormData({ ...formData, images: updated });
    } 
    else 
    {
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


  const cleanEmptyEntries = (arr: any[] = []) =>
    arr.filter((item) => item &&
        Object.values(item).some((val) => val !== null && val !== undefined && val !== "")
  );


  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const isEntryComplete = (entry: any, requiredFields: string[]) => {
      return requiredFields.every(
        (field) => entry[field] !== undefined && entry[field] !== null && entry[field] !== ""
      );
    };

    const sectionsToValidate: { [key: string]: string[] } = {
      accommodations: [
        "accommodation_type",
        "accommodation_name",
        "latitude",
        "longitude",
        "cost",
        "rating",
        "review",
      ],
      transports: ["transport_type", "transport_name", "cost", "rating", "review"],
      places: ["place_name", "latitude", "longitude", "cost", "rating", "review"],
      foods: ["food_name", "cost", "rating", "review"],
      images: ["image_url", "caption"],
    };

    for (const [section, requiredFields] of Object.entries(sectionsToValidate)) {
      const entries = (formData as any)[section] ?? [];

      for (let i = 0; i < entries.length; i++) {
        const entry = entries[i];
        const anyFieldFilled = Object.values(entry).some((val) => val !== undefined && val !== null && val !== "");

        if (anyFieldFilled && !isEntryComplete(entry, requiredFields)) {
          alert(
            `Please complete all fields for the ${section.slice(0, -1)} #${i + 1} or remove it.`
          );
          return; 
        }
      }
    }

    const user_id = localStorage.getItem("user_id")

    const payload = {
      ...formData,
      user_id,
      total_cost: Number(formData.total_cost),
      accommodations: normalizeNumberFields( cleanEmptyEntries(formData.accommodations), [
        "latitude",
        "longitude",
        "cost",
        "rating",
      ]),
      transports: normalizeNumberFields(cleanEmptyEntries(formData.transports), ["cost", "rating"]),
      places: normalizeNumberFields(cleanEmptyEntries(formData.places), [
        "latitude",
        "longitude",
        "cost",
        "rating",
      ]),
        foods: normalizeNumberFields(cleanEmptyEntries(formData.foods), ["cost", "rating"]),
    };

    try {
      await onSubmit(payload);
    } 
    catch (err) 
    {
      console.error("Form submission failed:", err);
      alert("Form submission failed. Check console for details.");
    }
  };

  const renderSection = (sectionName: string, fields: string[]) => (
    <div className="space-y-4">
      <h3 className="text-lg font-semibold">{sectionName}</h3>
      {((formData as any)[sectionName.toLowerCase()] ?? []).map((item: any, index: number) => (
        <div key={index} className="border p-3 rounded bg-gray-50">
          {fields.map((field) => {
            if (sectionName === "Accommodations" && field === "accommodation_name") {
              return (
                <input
                  key={field}
                  type="text"
                  placeholder="Accommodation Name"
                  value={item[field] || ""}
                  onChange={(e) => handleAccommodationNameChange(index, e.target.value)}
                  className="w-full border p-2 mb-2"
                  name={field}
                  required
                />
              );
              
            }

            if (sectionName === "Places" && field === "place_name") {
              return (
                <input
                  key={field}
                  type="text"
                  placeholder="Place Name"
                  value={item[field] || ""}
                  onChange={(e) => handlePlaceNameChange(index, e.target.value)}
                  className="w-full border p-2 mb-2"
                  name={field}
                  required
                /> 
               
                // <div key={field} className="flex gap-2 mb-2">
                //   <input
                //     type="text"
                //     placeholder="Place Name"
                //     value={item[field] || ""}
                //     onChange={(e) => handlePlaceNameChange(index, e.target.value)}
                //     className="flex-1 border p-2"
                //     name={field}
                //     required
                //   />
                //   <button
                //     type="button"
                //     onClick={() =>
                //       navigate("/map", {
                //         state: {
                //           section: "places",
                //           index,
                //           returnTo: location.pathname,
                //         },
                //       })
                //     }
                //     className="text-blue-600 underline whitespace-nowrap"
                //   >
                //     Select on Map
                //   </button>
                // </div>
              
              );
            }

            if (sectionName === "Images" && field === "image_url") {
              return (
                <div key={field} className="mb-2">
                  <input
                    type="file"
                    accept="image/*"
                    onChange={async (e) => {
                      const file = e.target.files?.[0] ?? null;
                      await handleImageFileChange(index, file);
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

            return (
              <input
                key={field}
                type="text"
                placeholder={field.replace(/_/g, " ")}
                value={item[field] || ""}
                onChange={(e) =>
                  handleNestedChange(sectionName.toLowerCase(), index, field, e.target.value)
                }
                className="w-full border p-2 mb-2"
                name={field}
                required
              />
            );
          })}
          <button
            type="button"
            className="text-red-500 underline"
            onClick={() => handleRemoveSectionItem(sectionName.toLowerCase(), index)}
          >
            Remove
          </button>
        </div>
      ))}
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
      <h2 className="text-2xl font-bold">
        {initialData ? "Edit Travel Post" : "Create Travel Post"}
      </h2>

      <input
        name="title"
        value={formData.title}
        onChange={handleChange}
        placeholder="Title"
        className="w-full border p-2"
        required
      />
      <textarea
        name="description"
        value={formData.description}
        onChange={handleChange}
        placeholder="Description"
        className="w-full border p-2 h-24"
        required
      />
      <input
        name="total_cost"
        type="number"
        value={formData.total_cost}
        onChange={handleChange}
        placeholder="Total Cost (e.g. 500.00)"
        className="w-full border p-2"
        required
      />
      <input
        name="duration"
        value={formData.duration}
        onChange={handleChange}
        placeholder="Duration"
        className="w-full border p-2"
        required
      />

      <select
        name="effort"
        value={formData.effort}
        onChange={handleChange}
        className="w-full border p-2"
        required
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
        required
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
        {initialData ? "Update Post" : "Publish Post"}
      </button>
    </form>
  );
}
