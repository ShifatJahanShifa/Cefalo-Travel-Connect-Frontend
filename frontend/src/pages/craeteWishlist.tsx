// // import { useState } from "react";
// // import { createwishlist } from "../services/wishlistService";
// // import { useNavigate } from "react-router-dom";
// // import { fetchLocationFromMapbox } from "../utils/mapboxfetcher"; // custom helper

// // export default function CreatewishlistPage() {
// //   const [form, setForm] = useState({
// //     place_name: "",
// //     type: "",
// //     title: "",
// //     theme: "",
// //     region: "",
// //     note: "",
// //     is_public: false,
// //     latitude: 0,
// //     longitude: 0,
// //   });

// //   const [loadingLocation, setLoadingLocation] = useState(false);
// //   const navigate = useNavigate();

// // //   const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
// // //     const { name, value, type, checked } = e.target;
// // //     setForm((prev) => ({
// // //       ...prev,
// // //       [name]: type === "checkbox" ? checked : value,
// // //     }));
// // //   };


// //   const handleChange = (
// //   e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
// // ) => {
// //   const { name, value, type } = e.target;

// //   if (type === "checkbox") {
// //     const checked = (e.target as HTMLInputElement).checked;
// //     setForm((prev) => ({
// //       ...prev,
// //       [name]: checked,
// //     }));
// //   } else {
// //     setForm((prev) => ({
// //       ...prev,
// //       [name]: value,
// //     }));
// //   }
// // };

// //   const handleLocationLookup = async () => {
// //     if (!form.place_name) return alert("Enter place name first");
// //     setLoadingLocation(true);
// //     try {
// //       const coordinates = await fetchLocationFromMapbox(form.place_name);
// //       if (!coordinates) {
// //         alert("Location not found");
// //         return;
// //     }

// //         setForm((prev) => ({
// //         ...prev,
// //         latitude: coordinates.latitude,
// //         longitude: coordinates.longitude,
// //         }));
    
// //     } catch (err) {
// //       alert("Location not found.");
// //     } finally {
// //       setLoadingLocation(false);
// //     }
// //   };

// //   const handleSubmit = async (e: React.FormEvent) => {
// //     e.preventDefault();
// //     try {
// //       await createwishlist(form);
// //       alert("wishlist created successfully!");
// //       navigate("/wishlist");
// //     } catch (err) {
// //       alert("Failed to create wishlist.");
// //     }
// //   };

// //   return (
// //     <div className="max-w-3xl mx-auto p-6 bg-white shadow rounded mt-10">
// //       <h2 className="text-2xl font-bold mb-4">Create wishlist</h2>
// //       <form onSubmit={handleSubmit} className="space-y-4">
// //         <input name="title" placeholder="Title" className="w-full border p-2" required value={form.title} onChange={handleChange} />
// //         <input name="place_name" placeholder="Place Name" className="w-full border p-2" required value={form.place_name} onChange={handleChange} />

// //         <button type="button" onClick={handleLocationLookup} className="text-blue-600 underline">
// //           {loadingLocation ? "Fetching..." : "Fetch Latitude/Longitude"}
// //         </button>

// //         <div className="flex gap-4">
// //           <input name="latitude" value={form.latitude} className="w-1/2 border p-2 bg-gray-100" readOnly />
// //           <input name="longitude" value={form.longitude} className="w-1/2 border p-2 bg-gray-100" readOnly />
// //         </div>

// //         <input name="type" placeholder="Type" className="w-full border p-2" value={form.type} onChange={handleChange} />
// //         <input name="theme" placeholder="Theme" className="w-full border p-2" value={form.theme} onChange={handleChange} />
// //         <input name="region" placeholder="Region" className="w-full border p-2" value={form.region} onChange={handleChange} />
// //         <textarea name="note" placeholder="Note" className="w-full border p-2 h-24" value={form.note} onChange={handleChange} />

// //         <label className="flex items-center gap-2">
// //           <input type="checkbox" name="is_public" checked={form.is_public} onChange={handleChange} />
// //           Make Public
// //         </label>

// //         <button type="submit" className="bg-blue-600 text-white px-4 py-2 rounded">
// //           Create wishlist
// //         </button>
// //       </form>
// //     </div>
// //   );
// // }


// // src/pages/CreatewishlistPage.tsx
// import { useEffect, useState } from "react";
// import { useLocation, useNavigate } from "react-router-dom";
// import { createwishlist,  } from "../services/wishlistService";

// interface wishlist {
//   place_name: string;
//   latitude: number;
//   longitude: number;
//   type: string;
//   title: string;
//   theme: string;
//   region: string;
//   note: string;
//   is_public: boolean;
// }

// export default function CreatewishlistPage({ initialData, onSubmit }: { initialData?: wishlist; onSubmit?: (data: wishlist) => Promise<void> }) {
//   const [formData, setFormData] = useState<wishlist>(
//     initialData || {
//       place_name: "",
//       latitude: 0,
//       longitude: 0,
//       type: "",
//       title: "",
//       theme: "",
//       region: "",
//       note: "",
//       is_public: false,
//     }
//   );

//   const location = useLocation();
//   const navigate = useNavigate();

// //   useEffect(() => {
// //     if (location.state?.lat && location.state?.lng && location.state?.place_name) {
// //       setFormData((prev) => ({
// //         ...prev,
// //         place_name: location.state.place_name,
// //         latitude: location.state.lat,
// //         longitude: location.state.lng,
// //       }));
// //       window.history.replaceState({}, document.title);
// //     }
// //   }, [location.state]);

// //   const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
// //     const { name, value, type, checked } = e.target;
// //     setFormData({
// //       ...formData,
// //       [name]: type === "checkbox" ? checked : value,
// //     });
// //   };

 


//     useEffect(() => {
//     if (location.state?.lat && location.state?.lng && location.state?.place_name) {
//             setFormData((prev) => ({
//             ...prev,
//             latitude: location.state.lat,
//             longitude: location.state.lng,
//             place_name: location.state.place_name,
//             }));
//             window.history.replaceState({}, document.title); // clear state
//         }
//         }, [location.state]);

//     const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
//     const { name, value, type } = e.target;

//     const newValue =
//         type === "checkbox"
//         ? (e.target as HTMLInputElement).checked
//         : value;

//     setFormData({ ...formData, [name]: newValue });
//     };


//     const handleSubmit = async (e: React.FormEvent) => {
//         e.preventDefault();
//         if (onSubmit) {
//         await onSubmit(formData);
//         } else {
//         await createwishlist(formData);
//         navigate("/wishlist");
//         }
//     };

//   return (
//     <form onSubmit={handleSubmit} className="max-w-3xl mx-auto bg-white p-6 rounded shadow space-y-4">
//       <h2 className="text-2xl font-bold">{initialData ? "Update wishlist" : "Create wishlist"}</h2>

//       <div>
//         <label className="block font-medium">Place</label>
//         <div className="flex gap-2">
//           <input
//             type="text"
//             name="place_name"
//             value={formData.place_name}
//             readOnly
//             className="flex-1 border p-2 bg-gray-100"
//             placeholder="Select a place on map"
//           />
//           <button
//             type="button"
//             className="text-blue-600 underline whitespace-nowrap"
//             onClick={() =>
//             //   navigate("/wishlist-map", {
//             //     state: {
//             //       returnTo: location.pathname,
//             //     },
//             //   }) 
//                             navigate("/wishlist/map", {
//                 state: {
//                     returnTo: location.pathname,
//                 },
//                 });

//             }
//           >
//             Select from Map
//           </button>
//         </div>
//       </div>

//       <input
//         type="text"
//         name="title"
//         placeholder="Title"
//         value={formData.title}
//         onChange={handleChange}
//         className="w-full border p-2"
//         required
//       />

//       <input
//         type="text"
//         name="type"
//         placeholder="Type"
//         value={formData.type}
//         onChange={handleChange}
//         className="w-full border p-2"
//         required
//       />

//       <input
//         type="text"
//         name="theme"
//         placeholder="Theme"
//         value={formData.theme}
//         onChange={handleChange}
//         className="w-full border p-2"
//       />

//       <input
//         type="text"
//         name="region"
//         placeholder="Region"
//         value={formData.region}
//         onChange={handleChange}
//         className="w-full border p-2"
//       />

//       <textarea
//         name="note"
//         placeholder="Note"
//         value={formData.note}
//         onChange={handleChange}
//         className="w-full border p-2"
//       />

//       <label className="flex items-center gap-2">
//         <input
//           type="checkbox"
//           name="is_public"
//           checked={formData.is_public}
//           onChange={handleChange}
//         />
//         Make Public
//       </label>

//       <button type="submit" className="bg-blue-600 text-white px-4 py-2 rounded">
//         {initialData ? "Update" : "Create"}
//       </button>
//     </form>
//   );
// }



import { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { createWishlist, updateWishlist } from "../services/wishlistService";
import type { getWishlistType, wishlist } from "../types/wishlist";

interface Props {
  initialData?: wishlist;
  onSubmitSuccess?: () => void;
}

export default function wishlistForm({ initialData, onSubmitSuccess }: Props) {
  const [formData, setFormData] = useState<wishlist>({
    place_name: "",
    latitude: 0,
    longitude: 0,
    type: "",
    title: "",
    theme: "",
    region: "",
    note: "",
    is_public: false,
  });

  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {

    if (initialData) 
    {
    
        setFormData(initialData);
        
    }
  }, [initialData]);

  useEffect(() => {
    const state = location.state;
    console.log(state)
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

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value, type } = e.target;

    const newValue =
        type === "checkbox"
        ? (e.target as HTMLInputElement).checked
        : value;

    setFormData({ ...formData, [name]: newValue });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (initialData) {
        console.log('now inti',initialData, formData)
        await updateWishlist(initialData.wishlist_id!, formData);
      } else {
        await createWishlist(formData);
        navigate('/home')
      }
      onSubmitSuccess?.();
    } catch (err) {
      console.error("Failed to save wishlist:", err);
      alert("Failed to save wishlist. Check console for details.");
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="max-w-2xl mx-auto p-6 bg-white rounded shadow space-y-4"
    >
      <h2 className="text-xl font-bold">
        {initialData ? "Edit wishlist" : "Create wishlist"}
      </h2>

      {/* Place Name + Select on Map */}
      <div>
        <label className="block font-medium mb-1">Place</label>
        <div className="flex gap-2">
          <input
            type="text"
            name="place_name"
            value={formData.place_name ?? ""}
            onChange={handleChange}
            className="flex-1 border p-2"
            placeholder="Place Name"
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
            className="text-blue-600 underline whitespace-nowrap"
          >
            Select on Map
          </button>
        </div>
      </div>

      {/* Latitude and Longitude */}
      <div className="flex gap-4">
        <input
          name="latitude"
          value={formData.latitude ?? ""}
          readOnly
          className="w-1/2 border p-2 bg-gray-100"
        />
        <input
          name="longitude"
          value={formData.longitude ?? ""}
          readOnly
          className="w-1/2 border p-2 bg-gray-100"
        />
      </div>

      <input
        name="title"
        value={formData.title ?? ""}
        onChange={handleChange}
        placeholder="Title"
        className="w-full border p-2"
        required
      />

      <input
        name="type"
        value={formData.type ?? ""}
        onChange={handleChange}
        placeholder="Type (e.g. beach, city, mountain)"
        className="w-full border p-2"
        required
      />

      <input
        name="theme"
        value={formData.theme ?? ""}
        onChange={handleChange}
        placeholder="Theme"
        className="w-full border p-2"
      />

      <input
        name="region"
        value={formData.region  ?? ""}
        onChange={handleChange}
        placeholder="Region"
        className="w-full border p-2"
      />

      <textarea
        name="note"
        value={formData.note  ?? ""}
        onChange={handleChange}
        placeholder="Your notes"
        className="w-full border p-2 h-24"
      />

      <label className="flex items-center space-x-2">
        <input
          type="checkbox"
          name="is_public"
          checked={formData.is_public}
          onChange={handleChange}
        />
        <span>Make public</span>
      </label>

      <button
        type="submit"
        className="bg-blue-600 text-white px-4 py-2 rounded"
      >
        {initialData ? "Update wishlist" : "Create wishlist"}
      </button>
    </form>
  );
}

// import { useState, useEffect } from "react";
// import { useLocation, useNavigate } from "react-router-dom";
// import { createWishlist, updateWishlist } from "../services/wishlistService";
// import { wishlist } from "../types/wishlist";

// interface Props {
//   initialData?: Wishlist;
//   onSubmitSuccess?: () => void;
// }

// export default function WishlistForm({ initialData, onSubmitSuccess }: Props) {
//   const [formData, setFormData] = useState<Wishlist>({
//     place_name: "",
//     latitude: 0,
//     longitude: 0,
//     type: "",
//     title: "",
//     theme: "",
//     region: "",
//     note: "",
//     is_public: false,
//   });

//   const location = useLocation();
//   const navigate = useNavigate();

//   useEffect(() => {
//     if (initialData) setFormData(initialData);
//   }, [initialData]);

//   useEffect(() => {
//     const state = location.state;
//     if (state?.lat && state?.lng && state?.place_name) {
//       setFormData((prev: any) => ({
//         ...prev,
//         latitude: state.lat,
//         longitude: state.lng,
//         place_name: state.place_name,
//       }));
//       window.history.replaceState({}, document.title);
//     }
//   }, [location.state]);

//   const handleChange = (
//     e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
//   ) => {
//     const { name, value, type, checked } = e.target;
//     setFormData((prev) => ({
//       ...prev,
//       [name]: type === "checkbox" ? checked : value,
//     }));
//   };

//   const handleSubmit = async (e: React.FormEvent) => {
//     e.preventDefault();
//     try {
//       if (initialData) {
//         await updateWishlist(initialData.id, formData);
//       } else {
//         await createWishlist(formData);
//       }
//       onSubmitSuccess?.();
//     } catch (err) {
//       console.error("Failed to save wishlist:", err);
//       alert("Failed to save wishlist. Check console for details.");
//     }
//   };

//   return (
//     <form
//       onSubmit={handleSubmit}
//       className="max-w-2xl mx-auto p-6 bg-white rounded shadow space-y-4"
//     >
//       <h2 className="text-xl font-bold">
//         {initialData ? "Edit Wishlist" : "Create Wishlist"}
//       </h2>

//       {/* Place Name + Select on Map */}
//       <div>
//         <label className="block font-medium mb-1">Place</label>
//         <div className="flex gap-2">
//           <input
//             type="text"
//             name="place_name"
//             value={formData.place_name}
//             onChange={handleChange}
//             className="flex-1 border p-2"
//             placeholder="Place Name"
//             required
//           />
//           <button
//             type="button"
//             onClick={() =>
//               navigate("/wishlist/map", {
//                 state: {
//                   returnTo: location.pathname,
//                 },
//               })
//             }
//             className="text-blue-600 underline whitespace-nowrap"
//           >
//             Select on Map
//           </button>
//         </div>
//       </div>

//       {/* Latitude and Longitude */}
//       <div className="flex gap-4">
//         <input
//           name="latitude"
//           value={formData.latitude}
//           readOnly
//           className="w-1/2 border p-2 bg-gray-100"
//         />
//         <input
//           name="longitude"
//           value={formData.longitude}
//           readOnly
//           className="w-1/2 border p-2 bg-gray-100"
//         />
//       </div>

//       <input
//         name="title"
//         value={formData.title}
//         onChange={handleChange}
//         placeholder="Title"
//         className="w-full border p-2"
//         required
//       />

//       <input
//         name="type"
//         value={formData.type}
//         onChange={handleChange}
//         placeholder="Type (e.g. beach, city, mountain)"
//         className="w-full border p-2"
//         required
//       />

//       <input
//         name="theme"
//         value={formData.theme}
//         onChange={handleChange}
//         placeholder="Theme"
//         className="w-full border p-2"
//       />

//       <input
//         name="region"
//         value={formData.region}
//         onChange={handleChange}
//         placeholder="Region"
//         className="w-full border p-2"
//       />

//       <textarea
//         name="note"
//         value={formData.note}
//         onChange={handleChange}
//         placeholder="Your notes"
//         className="w-full border p-2 h-24"
//       />

//       <label className="flex items-center space-x-2">
//         <input
//           type="checkbox"
//           name="is_public"
//           checked={formData.is_public}
//           onChange={handleChange}
//         />
//         <span>Make public</span>
//       </label>

//       <button
//         type="submit"
//         className="bg-blue-600 text-white px-4 py-2 rounded"
//       >
//         {initialData ? "Update Wishlist" : "Create Wishlist"}
//       </button>
//     </form>
//   );
// }
