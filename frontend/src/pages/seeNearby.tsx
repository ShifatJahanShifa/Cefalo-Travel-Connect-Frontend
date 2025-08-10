import { useState } from "react";
import { getAccommodationsByProximity } from '../services/accommodationService';
import { getPlacesByProximity } from "../services/placeService";
import { getRestauranstsByProximity } from "../services/restaurantService";

type LocationType = "attractions" | "accommodations" | "restaurants";

export default function SeeNearbyPage() {
  const [selectedType, setSelectedType] = useState<LocationType | null>(null);
  const [radius, setRadius] = useState("");
  const [showForm, setShowForm] = useState(false);
  const [results, setResults] = useState<any[] | null>(null);
  const [loading, setLoading] = useState(false);

  const handleOptionClick = (type: LocationType) => {
    setSelectedType(type);
    setShowForm(true);
  };

  const handleCancel = async () => {
    setSelectedType(null)
    setShowForm(false)
  }

  const handleSearch = async () => {
    if (!navigator.geolocation) {
      alert("Geolocation not supported by your browser");
      return;
    }

    if (!radius || isNaN(Number(radius))) {
      alert("Please enter a valid radius in KM");
      return;
    }

    setShowForm(false);
    setLoading(true);

    navigator.geolocation.getCurrentPosition(async (pos) => {
      const lat = pos.coords.latitude;
      const lng = pos.coords.longitude;

      try {
          let data: any[];
          if (selectedType === "attractions") 
          {
              data = await getPlacesByProximity(lat, lng, Number(radius));
              setResults(data);
          } 
          else if (selectedType === "accommodations") 
          {
              data = await getAccommodationsByProximity(lat, lng, Number(radius));
              setResults(data);
          } 
          else if (selectedType === "restaurants") 
          {
              data = await getRestauranstsByProximity(lat, lng, Number(radius));
              setResults(data);
          }
      } 
      catch (err) {
        alert("Failed to fetch nearby places");
      } 
      finally {
        setLoading(false);
      }
    });
  };

  const handleCloseResults = () => {
    setResults(null);
    setSelectedType(null);
  };

  return (
    <div className="p-6 max-w-3xl mx-auto">
      <h2 className="text-3xl font-bold mb-10">See Nearby Services</h2>

      <div className="flex gap-4 mb-6">
        {["attractions", "accommodations", "restaurants"].map((type) => (
          <button
            key={type}
            onClick={() => handleOptionClick(type as LocationType)}
            className={`px-4 py-2 rounded ${
              selectedType === type
                ? "bg-blue-600 text-white"
                : "bg-gray-200 text-gray-700"
            }`}
          >
            {type.charAt(0).toUpperCase() + type.slice(1)}
          </button>
        ))}
      </div>

      {showForm && (
        <div className="bg-white border rounded shadow p-4 mb-6 space-y-4">
          <label className="block font-semibold">Enter Radius (KM)</label>
          <input
            type="number"
            value={radius}
            onChange={(e) => setRadius(e.target.value)}
            className="w-full border p-2 rounded"
          />
          <div className="flex flex-row gap-10">
          <button
            onClick={handleSearch}
            className="bg-blue-600 text-white px-4 py-2 rounded"
          >
            Search
          </button>

          <button
            onClick={handleCancel}
            className="bg-red-500 text-white px-4 py-2 rounded"
          >
            Cancel
          </button>
          </div>
        </div>
      )}

    
      {loading && <p>Searching nearby places...</p>}

   
      {results && (
        <div className="mt-4">

          {results.length > 0 ? (
          <div className="space-y-3">
            
            {results.length &&results.map((item, idx) => (
              <div
                key={idx}
                className="border border-sky-400 rounded p-3 bg-sky-100 shadow-xl"
              >
                <p className="font-bold">{item.accommodation_name || item.place_name || item.restaurant_name}</p>
                {item.location.latitude && item.location.longitude && (
                  <p className="text-sm text-gray-700">
                    Location: (Latitude: {item.location.latitude}, Longitude: {item.location.longitude})
                  </p>
                )}
              </div>
            ))}
          </div>) 
          : (
            <p className="text-gray-500  text-center mt-4">No results found.</p>
          )}
          <button
            onClick={handleCloseResults}
            className="text-white bg-red-500 p-2 rounded text-sm mt-2 "
          >
            Close Results
          </button>
        </div>
      )}
    </div>
  );
}
