import { useState, useEffect, useRef } from "react";
import { MapContainer, TileLayer, Marker, Popup, useMap } from "react-leaflet";
import L, { Icon } from "leaflet";
import type { LatLngBoundsExpression } from "leaflet";
import "leaflet/dist/leaflet.css";
import { getAccommodationsByProximity } from '../services/accommodationService';
import { getPlacesByProximity } from "../services/placeService";
import { getRestauranstsByProximity } from "../services/restaurantService";

type LocationType = "attractions" | "accommodations" | "restaurants";


const icons = {
  user: new Icon({
    iconUrl: "https://cdn-icons-png.flaticon.com/512/149/149071.png",
    iconSize: [30, 30],
    iconAnchor: [15, 30],
  }),
  accommodations: new Icon({
    iconUrl: "https://cdn-icons-png.flaticon.com/512/684/684908.png",
    iconSize: [30, 30],
    iconAnchor: [15, 30],
  }),
  restaurants: new Icon({
    iconUrl: "https://cdn-icons-png.flaticon.com/512/1046/1046784.png", 
    iconSize: [30, 30],
    iconAnchor: [15, 30],
  }),
  attractions: new Icon({
    iconUrl: "https://cdn-icons-png.flaticon.com/512/854/854878.png", 
    iconSize: [30, 30],
    iconAnchor: [15, 30],
  }),
};


function FitBounds({ positions }: { positions: [number, number][] }) {
  const map = useMap();

  useEffect(() => {
    if (positions.length > 0) {
      const bounds = L.latLngBounds(positions);
      map.fitBounds(bounds, { padding: [50, 50] });
    }
  }, [positions, map]);

  return null;
}



export default function SeeNearbyPage() {
  const [selectedType, setSelectedType] = useState<LocationType | null>(null);
  const [radius, setRadius] = useState("");
  const [showForm, setShowForm] = useState(false);
  const [results, setResults] = useState<any[] | null>(null);
  const [loading, setLoading] = useState(false);
  const [userPosition, setUserPosition] = useState<[number, number] | null>(null);

  const handleOptionClick = (type: LocationType) => {
    setSelectedType(type);
    setShowForm(true);
  };

  const handleCancel = () => {
    setSelectedType(null);
    setShowForm(false);
  };

  const handleSearch = async () => {
    if (!navigator.geolocation) {
      alert("Geolocation not supported");
      return;
    }

    if (!radius || isNaN(Number(radius))) {
      alert("Enter valid radius in KM");
      return;
    }

    setShowForm(false);
    setLoading(true);

    navigator.geolocation.getCurrentPosition(async (pos) => {
      const lat = pos.coords.latitude;
      const lng = pos.coords.longitude;
      setUserPosition([lat, lng]);

      try {
        let data: any[] = [];
        if (selectedType === "attractions") {
          data = await getPlacesByProximity(lat, lng, Number(radius));
        } else if (selectedType === "accommodations") {
          data = await getAccommodationsByProximity(lat, lng, Number(radius));
        } else if (selectedType === "restaurants") {
          data = await getRestauranstsByProximity(lat, lng, Number(radius));
        }
        setResults(data);
      } catch (err) {
        alert("Failed to fetch nearby places");
      } finally {
        setLoading(false);
      }
    });
  };

  const handleCloseResults = () => {
    setResults(null);
    setSelectedType(null);
  };

  return (
    <div className="p-6 max-w-6xl mx-auto mt-10">
      <h2 className="text-3xl font-bold mb-6">See Nearby Services</h2>

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
        <div className="bg-white border rounded shadow p-4 mb-6 w-96 space-y-4">
          <label className="block font-semibold">Enter Radius (KM)</label>
          <input
            type="number"
            value={radius}
            onChange={(e) => setRadius(e.target.value)}
            className="w-full border p-2 rounded"
          />
          <div className="flex gap-4">
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

      {results && userPosition && (
        <div className="mt-6 mb-10 h-[500px]">
          <MapContainer
            center={userPosition}
            zoom={13}
            scrollWheelZoom={true}
            style={{ height: "100%", width: "100%" }}
          >
            <TileLayer
              url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
              attribution="&copy; OpenStreetMap contributors"
            />

            {/* User Marker */}
            <Marker position={userPosition} icon={icons.user}>
              <Popup>You are here</Popup>
            </Marker>

            {/* Nearby Markers */}
            {results.map((item, idx) => {
              const location = item.location || item;
              const type = selectedType ?? "attractions"; // fallback
              return (
                <Marker
                  key={idx}
                  position={[location.latitude, location.longitude]}
                  icon={icons[type]}
                >
                  <Popup>
                    <strong>{item.accommodation_name || item.restaurant_name || item.place_name}</strong>
                  </Popup>
                </Marker>
              );
            })}

            
            {userPosition && (
              <FitBounds
                positions={[
                  userPosition,
                  ...results
                    .map((item) => item.location || item)
                    .filter((loc) => loc.latitude && loc.longitude)
                    .map((loc) => [loc.latitude, loc.longitude] as [number, number]),
                ]}
              />
            )}

          </MapContainer>

          <button
            onClick={handleCloseResults}
            className="text-white bg-red-500 mt-4 py-2 px-4 rounded text-sm"
          >
            Close Map
          </button>
        </div>
      )}

    </div>
  );
}
