// import { useEffect, useState } from "react";
// import { useNavigate, useParams } from "react-router-dom";
// import { updatePost, getPostByPostId } from "../services/postService";
// import type { getPost } from "../types/post";

// export default function EditPostForm() {
//   const { id } = useParams();
//   const navigate = useNavigate();
//   const [formData, setFormData] = useState<getPost | null>(null);

//   useEffect(() => {
//     const fetchData = async () => {
//       try {
//         const data = await getPostByPostId(id!);
//         setFormData(data);
//       } catch (err) {
//         console.error("Failed to fetch post for editing:", err);
//       }
//     };
//     fetchData();
//   }, [id]);

//   const handleChange = (
//     e: React.ChangeEvent<
//       HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
//     >
//   ) => {
//     if (!formData) return;
//     setFormData({ ...formData, [e.target.name]: e.target.value });
//   };

//   const handleNestedChange = (
//     section: keyof getPost,
//     index: number,
//     field: string,
//     value: any
//   ) => {
//     if (!formData) return;
//     const updated = [...(formData[section] as any[])];
//     updated[index][field] = value;
//     setFormData({ ...formData, [section]: updated });
//   };

//   const handleAddSectionItem = (section: keyof getPost) => {
//     if (!formData) return;
//     setFormData({ ...formData, [section]: [...(formData[section] || []), {}] });
//   };

//   const handleRemoveSectionItem = (section: keyof getPost, index: number) => {
//     if (!formData) return;
//     const updated = [...(formData[section] as any[])];
//     updated.splice(index, 1);
//     setFormData({ ...formData, [section]: updated });
//   };

//   const fetchLatLng = async (placeName: string) => {
//     if (!placeName) return null;
//     const url = `https://nominatim.openstreetmap.org/search?q=${encodeURIComponent(
//       placeName
//     )}&format=json&limit=1`;
//     try {
//       const res = await fetch(url);
//       const data = await res.json();
//       if (data && data.length > 0) {
//         return {
//           latitude: parseFloat(data[0].lat),
//           longitude: parseFloat(data[0].lon),
//         };
//       }
//     } catch (error) {
//       console.error("Geocoding failed:", error);
//     }
//     return null;
//   };

//   const handleAccommodationNameChange = async (
//     index: number,
//     value: string
//   ) => {
//     if (!formData) return;
//     const updated = [...formData.accommodations];
//     updated[index].accommodation_name = value;
//     const coords = await fetchLatLng(value);
//     if (coords) {
//       updated[index].latitude = coords.latitude;
//       updated[index].longitude = coords.longitude;
//     }
//     setFormData({ ...formData, accommodations: updated });
//   };

//   const handlePlaceNameChange = async (index: number, value: string) => {
//     if (!formData) return;
//     const updated = [...formData.places];
//     updated[index].place_name = value;
//     const coords = await fetchLatLng(value);
//     if (coords) {
//       updated[index].latitude = coords.latitude;
//       updated[index].longitude = coords.longitude;
//     }
//     setFormData({ ...formData, places: updated });
//   };

//   const handleImageFileChange = async (index: number, file: File | null) => {
//     if (!file) return;
//     const url = await uploadImageToCloudinary(file);
//     if (url && formData) {
//       const updated = [...formData.images];
//       updated[index].image_url = url;
//       setFormData({ ...formData, images: updated });
//     }
//   };

//   const handleSubmit = async (e: React.FormEvent) => {
//     e.preventDefault();
//     if (!formData || !id) return;

//     const payload = {
//       ...formData,
//       total_cost: Number(formData.total_cost),
//       accommodations: normalizeNumberFields(formData.accommodations, [
//         "latitude",
//         "longitude",
//         "cost",
//         "rating",
//       ]),
//       transports: normalizeNumberFields(formData.transports, ["cost", "rating"]),
//       places: normalizeNumberFields(formData.places, [
//         "latitude",
//         "longitude",
//         "cost",
//         "rating",
//       ]),
//       foods: normalizeNumberFields(formData.foods, ["cost", "rating"]),
//     };

//     try {
//       await updatePost(id, payload);
//       navigate("/home");
//     } catch (err) {
//       console.error("Post update failed:", err);
//       alert("Post update failed. Check console for details.");
//     }
//   };

//   const normalizeNumberFields = (arr: any[], fields: string[]) =>
//     arr.map((item) => {
//       const converted = { ...item };
//       fields.forEach((field) => {
//         if (converted[field] !== undefined && converted[field] !== "") {
//           converted[field] = Number(converted[field]);
//         }
//       });
//       return converted;
//     });

//   const uploadImageToCloudinary = async (file: File) => {
//     const url = `https://api.cloudinary.com/v1_1/dwdtpwu38/image/upload`;

//     const formData = new FormData();
//     formData.append("file", file);
//     formData.append("upload_preset", "CTConnect");

//     try {
//       const response = await fetch(url, {
//         method: "POST",
//         body: formData,
//       });

//       const data = await response.json();
//       return data.secure_url || null;
//     } catch (error) {
//       console.error("Image upload error:", error);
//       return null;
//     }
//   };

//   const renderSection = (section: keyof getPost, fields: string[]) => (
//     <div className="space-y-4">
//       <h3 className="text-lg font-semibold">{section}</h3>
//       {(formData?.[section] as any[]).map((item, idx) => (
//         <div key={idx} className="border p-3 rounded bg-gray-50">
//           {fields.map((field) => {
//             if (section === "accommodations" && field === "accommodation_name") {
//               return (
//                 <input
//                   key={field}
//                   type="text"
//                   placeholder="Accommodation Name"
//                   value={item[field] || ""}
//                   onChange={(e) => handleAccommodationNameChange(idx, e.target.value)}
//                   className="w-full border p-2 mb-2"
//                   name={field}
//                 />
//               );
//             }
//             if (section === "places" && field === "place_name") {
//               return (
//                 <input
//                   key={field}
//                   type="text"
//                   placeholder="Place Name"
//                   value={item[field] || ""}
//                   onChange={(e) => handlePlaceNameChange(idx, e.target.value)}
//                   className="w-full border p-2 mb-2"
//                   name={field}
//                 />
//               );
//             }
//             if (section === "images" && field === "image_url") {
//               return (
//                 <div key={field} className="mb-2">
//                   <input
//                     type="file"
//                     accept="image/*"
//                     onChange={async (e) => {
//                       const file = e.target.files?.[0] ?? null;
//                       await handleImageFileChange(idx, file);
//                     }}
//                     className="w-full border p-2 mb-1"
//                   />
//                   {item.image_url && (
//                     <img
//                       src={item.image_url}
//                       alt="Uploaded"
//                       className="w-32 h-20 object-cover rounded"
//                     />
//                   )}
//                 </div>
//               );
//             }
//             return (
//               <input
//                 key={field}
//                 type="text"
//                 placeholder={field.replace(/_/g, " ")}
//                 value={item[field] || ""}
//                 onChange={(e) =>
//                   handleNestedChange(section, idx, field, e.target.value)
//                 }
//                 className="w-full border p-2 mb-2"
//                 name={field}
//               />
//             );
//           })}
//           <button
//             type="button"
//             className="text-red-500 underline"
//             onClick={() => handleRemoveSectionItem(section, idx)}
//           >
//             Remove
//           </button>
//         </div>
//       ))}
//       <button
//         type="button"
//         className="text-blue-600 underline"
//         onClick={() => handleAddSectionItem(section)}
//       >
//         Add {section.slice(0, -1)}
//       </button>
//     </div>
//   );

//   if (!formData) return <p>Loading post...</p>;

//   return (
//     <form
//       onSubmit={handleSubmit}
//       className="max-w-4xl mx-auto p-4 bg-white rounded shadow space-y-6"
//     >
//       <h2 className="text-2xl font-bold">Edit Travel Post</h2>

//       <input
//         name="title"
//         value={formData.title}
//         onChange={handleChange}
//         placeholder="Title"
//         className="w-full border p-2"
//       />

//       <textarea
//         name="description"
//         value={formData.description}
//         onChange={handleChange}
//         placeholder="Description"
//         className="w-full border p-2 h-24"
//       />

//       <input
//         name="total_cost"
//         type="number"
//         value={formData.total_cost}
//         onChange={handleChange}
//         placeholder="Total Cost"
//         className="w-full border p-2"
//       />

//       <input
//         name="duration"
//         value={formData.duration}
//         onChange={handleChange}
//         placeholder="Duration"
//         className="w-full border p-2"
//       />

//       <select
//         name="effort"
//         value={formData.effort}
//         onChange={handleChange}
//         className="w-full border p-2"
//       >
//         <option value="">Select Effort</option>
//         <option value="easy">Easy</option>
//         <option value="medium">Medium</option>
//         <option value="hard">Hard</option>
//       </select>

//       <select
//         name="categories"
//         multiple
//         value={formData.categories}
//         onChange={(e) =>
//           setFormData({
//             ...formData,
//             categories: Array.from(e.target.selectedOptions, (opt) => opt.value),
//           })
//         }
//         className="w-full border p-2 h-40"
//       >
//         {["Adventure", "Beach", "Cultural Site", "Budget Travel", "Historical", "Nature", "Heritage"].map(
//           (cat) => (
//             <option key={cat} value={cat}>
//               {cat}
//             </option>
//           )
//         )}
//       </select>

//       {renderSection("accommodations", [
//         "accommodation_type",
//         "accommodation_name",
//         "latitude",
//         "longitude",
//         "cost",
//         "rating",
//         "review",
//       ])}

//       {renderSection("transports", [
//         "transport_type",
//         "transport_name",
//         "cost",
//         "rating",
//         "review",
//       ])}

//       {renderSection("places", [
//         "place_name",
//         "latitude",
//         "longitude",
//         "cost",
//         "rating",
//         "review",
//       ])}

//       {renderSection("foods", ["food_name", "cost", "rating", "review"])}

//       {renderSection("images", ["image_url", "caption"])}

//       <button type="submit" className="bg-blue-600 text-white px-4 py-2 rounded">
//         Update Post
//       </button>
//     </form>
//   );
// }




// src/pages/EditPostPage.tsx
import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import PostForm from "../components/posts/postForm";
import { getPostByPostId, updatePost } from "../services/postService";
import type { getPost } from "../types/post";

export default function EditPostPage() {
  const { post_id } = useParams();
  const navigate = useNavigate();
  const [initialData, setInitialData] = useState<getPost | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const data = await getPostByPostId(post_id!);
        setInitialData(data);
      } catch (err) {
        console.error("Failed to fetch post for editing:", err);
      }
    };
    fetchData();
  }, [post_id]);

  const handleUpdate = async (formData: any) => {
    try {

        console.log('post updated form data', formData)
      await updatePost(post_id!, formData);
      navigate("/home");
    } catch (err) {
      console.error("Post update failed:", err);
      alert("Post update failed. Check console for details.");
    }
  };

  if (!initialData) return <p>Loading post...</p>;

  return (
    <div className="p-4">
      <PostForm initialData={initialData} onSubmit={handleUpdate} />
    </div>
  );
}
