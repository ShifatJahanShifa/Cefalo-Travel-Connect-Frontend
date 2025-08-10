import { uploadImageToCloudinary } from "../../utils/cloudinary";
import { useState, useEffect } from "react";
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

interface Props {
  initialData?: any; 
  onSubmit: (data: any) => Promise<void> 
}

export default function PostForm({ initialData, onSubmit }: Props) {
  const [formData, setFormData] = useState(initialData || {
    title: "",
    description: "",
    duration: "",
    effort: "",
    categories: [] as string[],
    accommodations: [] as any[],
    transports: [] as any[],
    places: [] as any[],
    foods: [] as any[],
    images: [] as any[],
  });
  
  const location = useLocation();
  const navigate = useNavigate();
  
 
  
  useEffect(() => {

  const saved = localStorage.getItem("postFormData");
    if (saved) {
      setFormData(JSON.parse(saved));
    }
  }, []);
    
   
    
  useEffect(() => {
    const state = location.state;
    if (!state || !state.mapType || !state.place_name) return;

    const alreadyExists = (list: any[], lat: number, lng: number) => {
      return list.some((item) => item.latitude === lat && item.longitude === lng);
    };

    setFormData((prev: any) => {
      if (state.mapType === "place") {
        if (alreadyExists(prev.places || [], state.lat, state.lng)) return prev;
      

        const data = [...(prev.places || [])];


        if (state.index !== undefined && data[state.index]) {
          data[state.index] = {
            ...data[state.index],
            place_name: state.place_name,
            latitude: state.lat,
            longitude: state.lng,
          };

          return {
            ...prev,
            places: data,
          };
        }
      }

      if (state.mapType === "accommodation") {
        if (alreadyExists(prev.accommodations || [], state.lat, state.lng)) return prev;
      
        const data = [...(prev.accommodations || [])];

        if (state.index !== undefined && data[state.index]) {
          data[state.index] = {
            ...data[state.index],
            accommodation_name: state.place_name,
            latitude: state.lat,
            longitude: state.lng,
          };
          console.log('a', state, 'b', data)
          return {
            ...prev,
            accommodations: data,
          };
        }

        
      }
  
      return prev;
    });

    window.history.replaceState({}, document.title);
    localStorage.removeItem('postFormData')
  }, [location.state]);
  


  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };


  const handleRemoveSectionItem = (section: string, index: number) => {
    const updated = [...(formData as any)[section]];
    updated.splice(index, 1);
    setFormData({ ...formData, [section]: updated });
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
   
  };

  const handlePlaceNameChange = async (index: number, value: string) => {
    const updated = [...formData.places];
    updated[index].place_name = value;
    setFormData({ ...formData, places: updated });
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

  function formatLabel(field: string): string {
    return field
      .replace(/[_-]/g, ' ')                    
      .replace(/\w\S*/g, (w) => w.charAt(0).toUpperCase() + w.slice(1).toLowerCase()); 
  }


  const handleAddSectionItem = (section: string, newItem: any) => {
    const updated = [...(formData as any)[section], newItem];
    const newFormData = { ...formData, [section]: updated };

    setFormData(newFormData);
    localStorage.setItem("postFormData", JSON.stringify(newFormData)); 
  };



  const normalizeNumberFields = (arr: any[], fields: string[]) =>
    arr.map((item) => {
      const converted = { ...item };
      fields.forEach((field) => {
        if (converted[field] !== undefined && converted[field] !== "") 
        {
          converted[field] = Number(converted[field]);
        }
      });
      return converted;
    });

  const cleanEmptyEntries = (arr: any[] = []) =>
    arr.filter((item) => item && Object.values(item).some((val) => val !== null && val !== undefined && val !== ""));

    const handleSubmit = async (e: React.FormEvent) => {
      e.preventDefault();
      const isEntryComplete = (entry: any, requiredFields: string[]) => {
        return requiredFields.every((field) => entry[field] !== undefined && entry[field] !== null && entry[field] !== "");
      };

    const sectionsToValidate: { [key: string]: string[] } = {
      accommodations: ["accommodation_type", "accommodation_name", "latitude", "longitude", "cost", "rating", "review"],
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
        if (anyFieldFilled && !isEntryComplete(entry, requiredFields)) 
        {
          alert(`Please complete all fields for the ${section.slice(0, -1)} #${i + 1} or remove it.`);
          return;
        }
      }
    }

    const user_id = localStorage.getItem("user_id");

    const payload = {
      ...formData,
      user_id,
      total_cost: Number(formData.total_cost),
      accommodations: normalizeNumberFields(cleanEmptyEntries(formData.accommodations), ["latitude", "longitude", "cost", "rating"]),
      transports: normalizeNumberFields(cleanEmptyEntries(formData.transports), ["cost", "rating"]),
      places: normalizeNumberFields(cleanEmptyEntries(formData.places), ["latitude", "longitude", "cost", "rating"]),
      foods: normalizeNumberFields(cleanEmptyEntries(formData.foods), ["cost", "rating"]),
    };

    try {
      await onSubmit(payload);
    } catch (err) {
      console.error("Form submission failed:", err);
      alert("Form submission failed. Check console for details.");
    }
  };

  const renderSection = (sectionName: string, fields: string[]) => (
    <div className="space-y-4">
      <h3 className="text-lg font-semibold text-black border-blue-700 border-b pb-1">{sectionName}</h3>
      {((formData as any)[sectionName.toLowerCase()] ?? []).map((item: any, index: number) => (
        <div key={index} className="border p-4 rounded bg-gray-100">
          {fields.map((field) => {
           
            if (sectionName === "Accommodations" && field === "accommodation_type") {
              const types = ["hotel", "motel", "resort", "villa", "cottage"];
              return (
                <div key={field} className="mb-2">
                  <label className="block text-gray-700 font-medium mb-1">Accommodation Type<span className="text-red-500">*</span></label>
                  <select
                    value={item[field] || ""}
                    onChange={(e) =>
                      handleNestedChange(sectionName.toLowerCase(), index, field, e.target.value)
                    }
                    className="w-full border p-2 rounded"
                    required
                  >
                    <option value="">Select Type</option>
                    {types.map((type) => (
                      <option key={type} value={type}>
                        {type.charAt(0).toUpperCase() + type.slice(1)}
                      </option>
                    ))}
                  </select>
                </div>
              );
            }
       
            if (sectionName === "Transports" && field === "transport_type") {
              const transportTypes = ["bus", "car", "train", "flight", "boat"];
              return (
                <div key={field} className="mb-2">
                  <label className="block text-gray-700 font-medium mb-1">Transport Type<span className="text-red-500">*</span></label>
                  <select
                    value={item[field] || ""}
                    onChange={(e) =>
                      handleNestedChange(sectionName.toLowerCase(), index, field, e.target.value)
                    }
                    className="w-full border p-2 rounded"
                    required
                  >
                    <option value="">Select Transport Type</option>
                    {transportTypes.map((type) => (
                      <option key={type} value={type}>
                        {type.charAt(0).toUpperCase() + type.slice(1)}
                      </option>
                    ))}
                  </select>
                </div>
              );
            }

            if (sectionName === "Accommodations" && field === "accommodation_name") {
              return (
                <div key={field} >
                  <label className="block font-medium text-gray-700 mb-1">Accommodation Name<span className="text-red-500">*</span></label>
                  <div className="flex gap-2">
                    <input
                      key={field}
                      type="text"
                      placeholder="Accommodation Name"
                      value={item[field] || ""}
                      onChange={(e) => handleAccommodationNameChange(index, e.target.value)}
                      className="flex-1 border p-2 mb-2 rounded"
                      name={field}
                      required
                    />
                  <button
                    type="button"
                    onClick={() =>{
                    localStorage.setItem("postFormData", JSON.stringify(formData));
                    navigate("/post/map", {
                      state: {
                        returnTo: location.pathname,
                        mapType: "accommodation",
                        index,
                        query: item[field] || "",
                      },
                    })
                  } }
                    className="bg-blue-500 text-white px-2 mb-2 py-1 rounded hover:bg-blue-700"
                  >
                    Select on Map
                  </button>
                  </div>
                </div>
              );
            }
            if (sectionName === "Places" && field === "place_name") {
              return (
                <div key={field} >
                  <label className="block font-medium text-gray-700 mb-1">Place Name<span className="text-red-500">*</span></label>
                  <div className="flex gap-2"> 
                <input
                  key={field}
                  type="text"
                  placeholder="Place Name"
                  value={item[field] || ""}
                  onChange={(e) => handlePlaceNameChange(index, e.target.value)}
                  className="flex-1 border p-2 mb-2 rounded"
                  name={field}
                  required
                />
                <button
                  type="button"
                  onClick={() =>{
                    localStorage.setItem("postFormData", JSON.stringify(formData));
                    navigate("/post/map", {
                      state: {
                        returnTo: location.pathname,
                        mapType: "place",
                        index,
                        query: item[field] || "",
                      },
                    })
                  }}
                  className="bg-blue-500 text-white px-2 py-1 mb-2 rounded hover:bg-blue-700"
                >
                  Select on Map
                </button>
                </div>
                </div>
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
                    className="w-full border p-2 mb-1 rounded"
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
            if (field === "rating") {
              return (
                <div key={field} className="mb-2">
                  <label className="block font-medium text-gray-700 mb-1">Rating<span className="text-red-500">*</span></label>
                  <div className="flex gap-3">
                    {[1, 2, 3, 4, 5].map((num) => (
                      <label key={num} className="flex items-center gap-1">
                        <input
                          type="radio"
                          name={`rating-${sectionName}-${index}`}
                          value={num}
                          checked={Number(item[field]) === num}
                          onChange={(e) =>
                            handleNestedChange(sectionName.toLowerCase(), index, field, Number(e.target.value))
                          }
                        />
                        {num}
                      </label>
                    ))}
                  </div>
                </div>
              );
            }

            if(sectionName === "places" && field === "latitude") 
            {
              return (
                <div> 
                  <label className="block font-medium text-gray-700 mb-1">{formatLabel(field)}<span className="text-red-500">*</span></label>
                  <input
                    type="number"
                    value={item[field] || ""}
                    placeholder="Latitude"
                    onChange={(e) => {
                      const updated = [...formData.places!];
                      updated[index].latitude = Number(e.target.value);
                      setFormData((prev: any) => ({ ...prev, places: updated }));
                    }}
                    className="border p-2 rounded"
                  />
              </div>
              )
            }

            if(sectionName === "places" && field === "longitude") 
            {
              return (
                <div> 
                  <label className="block font-medium text-gray-700 mb-1">{formatLabel(field)}<span className="text-red-500">*</span></label>
                  <input
                    type="number"
                    value={item[field] || ""}
                    placeholder="Longitude"
                    onChange={(e) => {
                      const updated = [...formData.places!];
                      updated[index].longitude = Number(e.target.value);
                      setFormData((prev: any) => ({ ...prev, places: updated }));
                    }}
                    className="border p-2 rounded"
                  />
              </div>
              )
            }

            if(sectionName === "accommodations" && field === "latitude") 
            {
              return (
                <div> 
                  <label className="block font-medium text-gray-700 mb-1">{formatLabel(field)}<span className="text-red-500">*</span></label>
                  <input
                    type="number"
                    value={item[field] || ""}
                    placeholder="Latitude"
                    onChange={(e) => {
                      const updated = [...formData.accommodations!];
                      updated[index].latitude = Number(e.target.value);
                      setFormData((prev: any) => ({ ...prev, accommodations: updated }));
                    }}
                    className="border p-2 rounded"
                  />
              </div>
              )
            }

            if(sectionName === "accommodations" && field === "longitude") 
            {
              return (
                <div> 
                  <label className="block font-medium text-gray-700 mb-1">{formatLabel(field)}<span className="text-red-500">*</span></label>
                  <input
                    type="number"
                    value={item[field] || ""}
                    placeholder="Longitude"
                    onChange={(e) => {
                      const updated = [...formData.accommodations!];
                      updated[index].latitude = Number(e.target.value);
                      setFormData((prev: any) => ({ ...prev, accommodations: updated }));
                    }}
                    className="border p-2 rounded"
                  />
              </div>
              )
            }

            return (
              <div> 
                <label className="block font-medium text-gray-700 mb-1">{formatLabel(field)}<span className="text-red-500">*</span></label>
                <input
                  key={field}
                  type="text"
                  placeholder={" enter "+field.replace(/_/g, " ")}
                  value={item[field] || ""}
                  onChange={(e) => handleNestedChange(sectionName.toLowerCase(), index, field, e.target.value)}
                  className="w-full border p-2 mb-2 rounded"
                  name={field}
                  required
                />
                </div>
            );
          })}
          <button
            type="button"
            className="text-white p-2 bg-red-500 rounded-sm hover:bg-red-800"
            onClick={() => handleRemoveSectionItem(sectionName.toLowerCase(), index)}
          >
            Remove
          </button>
        </div>
      ))}
      <button
        type="button"
        className="text-white p-2 bg-green-500 rounded-sm  hover:bg-green-800"
        onClick={() => handleAddSectionItem(sectionName.toLowerCase(), {})}
      >
        Add {sectionName.slice(0, -1)}
      </button>
    </div>
  );

  return (
    <form onSubmit={handleSubmit} className="max-w-4xl mx-auto p-6 bg-sky-100  border border-sky-400 rounded shadow space-y-6">
      <h2 className="text-2xl text-center font-bold text-blue-800">
        {initialData ? "Edit Travel Post" : "Create Travel Post"}
      </h2>
      <p><span className="text-red-500">*</span> indicates required field</p>

      <div>
        <label className="block text-sm font-medium text-gray-700">Title<span className="text-red-500">*</span></label>
        <input name="title" value={formData.title} onChange={handleChange} placeholder="Title" className="w-full border p-2 rounded" required />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700">Description<span className="text-red-500">*</span></label>
        <textarea name="description" value={formData.description} onChange={handleChange} placeholder="Description" className="w-full border p-2 h-24 rounded" required />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700">Total Cost<span className="text-red-500">*</span></label>
        <input name="total_cost" type="number" value={formData.total_cost} onChange={handleChange} placeholder="Total Cost (e.g. 500.00)" className="w-full border p-2 rounded" required />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700">Duration<span className="text-red-500">*</span></label>
        <input name="duration" value={formData.duration} onChange={handleChange} placeholder="Duration" className="w-full border p-2 rounded" required />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700">Select effort<span className="text-red-500">*</span></label>
        <select name="effort" value={formData.effort} onChange={handleChange} className="w-full border p-2 rounded" required>
          <option value="">Select Effort</option>
          {effortLevels.map((level) => (
            <option key={level} value={level}>{level}</option>
          ))}
        </select>
      </div>

      <div className="space-y-2">
        <p className="font-medium text-gray-700">Categories<span className="text-red-500">*</span></p>
        <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
          {categories.map((cat) => (
            <label key={cat} className="flex items-center gap-2">
              <input
                type="checkbox"
                value={cat}
                checked={formData.categories.includes(cat)}
                onChange={(e) => {
                  const updatedCategories = e.target.checked
                    ? [...formData.categories, cat]
                    : formData.categories.filter((c: any) => c !== cat);
                  setFormData({ ...formData, categories: updatedCategories });
                }}
              />
              {cat}
            </label>
          ))}
        </div>
      </div>

      {renderSection("Accommodations", ["accommodation_type", "accommodation_name", "latitude", "longitude", "cost", "review", "rating"])}
      {renderSection("Transports", ["transport_type", "transport_name", "cost", "review", "rating"])}
      {renderSection("Places", ["place_name", "latitude", "longitude", "cost", "review", "rating"])}
      {renderSection("Foods", ["food_name", "cost", "review", "rating"])}
      {renderSection("Images", ["image_url", "caption"])}

      <button type="submit" className="bg-blue-600 text-white w-full px-4 py-2 rounded hover:bg-blue-700">
        {initialData ? "Update Post" : "Publish Post"}
      </button>
    </form>
  );
}

