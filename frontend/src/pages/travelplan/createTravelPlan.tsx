import { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { createTravelPlan, updateTravelPlan } from '../../services/travelPlanService';
import type { travelPlanInput } from "../../types/travelplan";

interface Props {
  initialData?: travelPlanInput; 
  travel_plan_id?: string;
}

export default function TravelPlanForm({ initialData, travel_plan_id }: Props) {
  const navigate = useNavigate();
  const location = useLocation();

  const [formData, setFormData] = useState<travelPlanInput>(
    initialData || {
      start_date: "",
      end_date: "",
      note: "",
      estimated_cost: 0,
      accommodations: [],
      transports: [],
      places: [],
    }
  );
  
  // accommodations: [{ accommodation_name: "", accommodation_type: "", latitude: 0, longitude: 0 }],
  // transports: [{ transport_type: "", transport_name: "" }],
  // places: [{ place_name: "", latitude: 0, longitude: 0 }],

  useEffect(() => {
    // Restore form from localStorage if available
    const saved = localStorage.getItem("travelFormData");
    if (saved) {
      setFormData(JSON.parse(saved));
    }
  }, []);


  useEffect(() => {
    const saved = localStorage.getItem("travelFormData");
  
    if (saved) {
      setFormData(JSON.parse(saved));
      localStorage.removeItem("travelFormData"); 
    } 
    else if (initialData) {
      setFormData(initialData);
    }
  }, [initialData]);


    
  useEffect(() => {
    const state = location.state;
    if (!state || !state.mapType || !state.place_name) return;

    const alreadyExists = (list: any[], lat: number, lng: number) => {
      return list.some((item) => item.latitude === lat && item.longitude === lng);
    };

    setFormData((prev) => {
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

          return {
            ...prev,
            accommodations: data,
          };
        }
      }

      return prev;
    });

    window.history.replaceState({}, document.title);
  }, [location.state]);



  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: name === "estimated_cost" ? Number(value) : value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (initialData) {
        await updateTravelPlan(initialData.travel_plan_id!, formData);
      } 
      else {
        await createTravelPlan(formData);
        localStorage.removeItem("travelFormData");
      }
      navigate("/travelplans");
    } 
    catch (err) {
      alert("Failed to save travel plan");
    }
  };

  const addTransport = () => {
    setFormData((prev) => ({
      ...prev,
      transports: [...(prev.transports || []), { transport_type: "", transport_name: "" }],
    }));
  };

  const removeTransport = (index: number) => {
    const updated = [...(formData.transports || [])];
    updated.splice(index, 1);
    setFormData({ ...formData, transports: updated });
  };



  const updateTransport = (index: number, field: "transport_type" | "transport_name", value: string) => {
    const updated = [...(formData.transports || [])];
    updated[index] = { ...updated[index], [field]: value };
    setFormData({ ...formData, transports: updated });
  };

  const removePlace = (index: number) => {
    const updated = [...(formData.places || [])];
    updated.splice(index, 1);
    setFormData({ ...formData, places: updated });
  };

  const removeAccommodation = (index: number) => {
    const updated = [...(formData.accommodations || [])];
    updated.splice(index, 1);
    setFormData({ ...formData, accommodations: updated });
  };

  return (

    <form onSubmit={handleSubmit} className="max-w-3xl mx-auto p-8 bg-sky-100 mt-6 border mb-6 border-sky-400 rounded-lg shadow space-y-6">
      <h2 className="text-center text-2xl font-bold text-blue-800 pb-2">
        {initialData ? "Edit Travel Plan" : "Create Travel Plan"}
      </h2>
      <p><span className="text-red-500">*</span> indicates required field</p>

      <div className="grid md:grid-cols-2 gap-4">
        <div>
          <label className="font-medium">Start Date<span className="text-red-500">*</span></label>
          <input
            name="start_date"
            value={formData.start_date}
            onChange={handleChange}
            placeholder="Start Date"
            className="w-full border p-2 rounded mt-1"
            required
          />
        </div>
        <div>
          <label className="font-medium">End Date<span className="text-red-500">*</span></label>
          <input
            name="end_date"
            value={formData.end_date}
            onChange={handleChange}
            placeholder="End Date"
            className="w-full border p-2 rounded mt-1"
            required
          />
        </div>
      </div>

      <div>
        <label className="font-medium">Trip Note<span className="text-red-500">*</span></label>
        <textarea
          name="note"
          value={formData.note}
          onChange={handleChange}
          placeholder="Notes about this trip..."
          className="w-full border p-2 rounded mt-1"
        />
      </div>

      <div>
        <label className="font-medium">Estimated Cost (BDT)<span className="text-red-500">*</span></label>
        <input
          name="estimated_cost"
          type="number"
          value={formData.estimated_cost ?? ""}
          onChange={handleChange}
          placeholder="Estimated Cost"
          className="w-full border p-2 rounded mt-1"
          required
        />
      </div>

    
      <div>
        <div className="flex flex-col mb-2">
          <label className="font-bold text-lg mb-2 border-b pb-1 border-blue-700">Places</label>
          <div className="flex gap-2">
           
            <button
              type="button"
              onClick={() =>
                setFormData((prev) => ({
                  ...prev,
                  places: [...(prev.places || []), { place_name: "", latitude: 0, longitude: 0 }],
                }))
              }
              className="text-white p-2 bg-green-600 rounded text-md"
            >
              Add places
            </button>
          </div>
        </div>

        {formData.places?.map((place, index) => (
          <div key={index} className="border border-gray-300 p-3 rounded mb-3 bg-gray-50">
            <div className="flex flex-row gap-2 items-center justify-between">
            <input
              type="text"
              value={place.place_name}
              placeholder="Place Name"
              onChange={(e) => {
                const updated = [...formData.places!];
                updated[index].place_name = e.target.value;
                setFormData((prev) => ({ ...prev, places: updated }));
              }}
              className="flex-1 border p-2 rounded mb-2"
            />
            <button
              type="button"
              onClick={() => {
                localStorage.setItem("travelFormData", JSON.stringify(formData));
                navigate("/travelplan/map", {
                  state: { returnTo: location.pathname, mapType: "place" , index},
                });
              }}
              className="text-white p-2 mb-2 bg-blue-600 rounded text-md"
            >
              Add from Map
            </button>
            </div>
            <div className="grid grid-cols-2 gap-2">
              <input
                type="number"
                value={place.latitude}
                placeholder="Latitude"
                onChange={(e) => {
                  const updated = [...formData.places!];
                  updated[index].latitude = Number(e.target.value);
                  setFormData((prev) => ({ ...prev, places: updated }));
                }}
                className="border p-2 rounded"
              />
              <input
                type="number"
                value={place.longitude}
                placeholder="Longitude"
                onChange={(e) => {
                  const updated = [...formData.places!];
                  updated[index].longitude = Number(e.target.value);
                  setFormData((prev) => ({ ...prev, places: updated }));
                }}
                className="border p-2 rounded"
              />
            </div>
            <button
              type="button"
              onClick={() => removePlace(index)}
              className="text-md mt-2 text-white p-2 bg-red-500 rounded"
            >
              Remove
            </button>
          </div>
        ))}
      </div>


        <div>
          <div className="flex flex-col mb-2">
            <label className="font-bold text-lg mb-2 border-b pb-1 border-blue-700">Accommodations</label>
            <div className="flex gap-2">
              <button
                type="button"
                onClick={() =>
                  setFormData((prev) => ({
                    ...prev,
                    accommodations: [...(prev.accommodations || []), {
                      accommodation_name: "",
                      accommodation_type: "",
                      latitude: 0,
                      longitude: 0
                    }]
                  }))
                }
                className="text-white p-2 bg-green-600 rounded text-md"
              >
               Add Accommodations
              </button>
            </div>
          </div>

          {formData.accommodations?.map((acc, index) => (
            <div key={index} className="border border-gray-300 p-3 rounded mb-3 bg-gray-50">
              <input
                value={acc.accommodation_type}
                placeholder="Type (e.g. Hotel)"
                onChange={(e) => {
                  const updated = [...formData.accommodations!];
                  updated[index].accommodation_type = e.target.value;
                  setFormData((prev) => ({ ...prev, accommodations: updated }));
                }}
                className="w-full border p-2 rounded mb-2"
              />
              <div className="flex flex-row gap-2 items-center justify-between">
              <input
                value={acc.accommodation_name}
                placeholder="Name"
                onChange={(e) => {
                  const updated = [...formData.accommodations!];
                  updated[index].accommodation_name = e.target.value;
                  setFormData((prev) => ({ ...prev, accommodations: updated }));
                }}
                className="flex-1 border p-2 rounded mb-2"
              />
              <button
                type="button"
                onClick={() => {
                  localStorage.setItem("travelFormData", JSON.stringify(formData));
                  navigate("/travelplan/map", {
                    state: { returnTo: location.pathname, mapType: "accommodation" , index},
                  });
                }}
                className="text-white p-2 bg-blue-600 mb-2 rounded text-md"
              >
                Add from Map
              </button> </div>
              <div className="grid grid-cols-2 gap-2">
                <input
                  type="number"
                  value={acc.latitude}
                  placeholder="Latitude"
                  onChange={(e) => {
                    const updated = [...formData.accommodations!];
                    updated[index].latitude = Number(e.target.value);
                    setFormData((prev) => ({ ...prev, accommodations: updated }));
                  }}
                  className="border p-2 rounded"
                />
                <input
                  type="number"
                  value={acc.longitude}
                  placeholder="Longitude"
                  onChange={(e) => {
                    const updated = [...formData.accommodations!];
                    updated[index].longitude = Number(e.target.value);
                    setFormData((prev) => ({ ...prev, accommodations: updated }));
                  }}
                  className="border p-2 rounded"
                />
              </div>
              <button
                type="button"
                onClick={() => removeAccommodation(index)}
                className="text-md mt-2 text-white p-2 bg-red-500 rounded"
              >
                Remove
              </button>
            </div>
          ))}
        </div>



      {/* Transports */}
      <div>
        <div className="grid grid-cols-1 mb-2">
          <label className="font-bold text-lg mb-2 border-b pb-1 border-blue-700">Transports</label>
          <button
            type="button"
            onClick={addTransport}
            className="text-white p-2 w-fit bg-green-600 rounded text-md"
          >
            Add Transports
          </button>
        </div>

        {formData.transports?.map((trans, index) => (
          <div
            key={index}
            className="border border-gray-300 p-3 rounded mb-3 bg-gray-50"
          >
            <input
              value={trans.transport_type}
              placeholder="Transport Type (e.g. Bus)"
              onChange={(e) =>
                updateTransport(index, "transport_type", e.target.value)
              }
              className="w-full border p-2 rounded mb-2"
            />
            <input
              value={trans.transport_name}
              placeholder="Transport Name"
              onChange={(e) =>
                updateTransport(index, "transport_name", e.target.value)
              }
              className="w-full border p-2 rounded"
            />
            <button
              type="button"
              onClick={() => removeTransport(index)}
              className=" text-md mt-2 text-white p-2 bg-red-500 rounded "
            >
              Remove
            </button>
          </div>
        ))}
      </div>


      {/* Submit Button */}
      <div className="pt-4">
        <button
          type="submit"
          className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded text-lg w-full"
        >
          {initialData ? "Update Travel Plan" : "Create Travel Plan"}
        </button>
      </div>
    </form>
  ) 
}

