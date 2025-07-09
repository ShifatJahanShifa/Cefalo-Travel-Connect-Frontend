import { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { MapContainer, TileLayer, Marker, useMap } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import L from "leaflet";


function FlyToMarker({ lat, lng }: { lat: number; lng: number }) {
  const map = useMap();
  useEffect(() => {
    if (lat && lng) {
      map.flyTo([lat, lng], 12);
    }
  }, [lat, lng]);
  return null;
}

export default function WishlistMapSelector() {
  const [searchText, setSearchText] = useState("");
  const [selected, setSelected] = useState<{ lat: number; lng: number } | null>(null);
  const [placeName, setPlaceName] = useState("");

  const navigate = useNavigate();
  const location = useLocation();

    const handleSearch = async () => {
    try {
      const response = await fetch(
        `https://nominatim.openstreetmap.org/search?q=${encodeURIComponent(searchText)}&format=json&limit=1`);
      const data = await response.json();
      const firstResult = data?.[0];

      if (firstResult) {
        const lat = parseFloat(firstResult.lat);
        const lng = parseFloat(firstResult.lon);
        setSelected({ lat, lng });
        setPlaceName(firstResult.display_name);
      } 
      else {
        alert("No results found. Manually add place name and latitude longitude");
      }
    } 
    catch (error) 
    {
      console.error("Nominatim error:", error);
      alert("Failed to search location.");
    }
  };

  const handleAddPlace = () => {
    if (!selected || !placeName) return;

    const returnTo = location.state?.returnTo || "/wishlist/create";

    navigate(returnTo, {
      state: {
        lat: selected.lat,
        lng: selected.lng,
        place_name: placeName,
      },
    });
  };


  return (
    <div className="h-screen w-full relative">
      
      <div className="absolute z-[1000] left-20 top-5 bg-white rounded shadow p-3 w-[90%] max-w-md flex gap-2">
        <input
          type="text"
          className="flex-1 border p-2 rounded"
          placeholder="Search for a place"
          value={searchText}
          onChange={(e) => setSearchText(e.target.value)}
        />
        <button
          className="bg-blue-600 text-white px-3 py-2 rounded"
          onClick={handleSearch}
        >
          Search
        </button>
      </div>

     
      <MapContainer
        center={[23.8103, 90.4125]}
        zoom={6}
        style={{ height: "100%", width: "100%" }}
      >
        <TileLayer
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          attribution="&copy; OpenStreetMap contributors"
        />
        {selected && (
          <>
            <Marker
              position={[selected.lat, selected.lng]}
              icon={L.icon({
                iconUrl: "https://unpkg.com/leaflet@1.9.3/dist/images/marker-icon.png",
                iconSize: [25, 41],
                iconAnchor: [12, 41],
              })}
            />
            <FlyToMarker lat={selected.lat} lng={selected.lng} />
          </>
        )}
      </MapContainer>
      
      {selected && (
      <div className="absolute bottom-20 left-1/2 -translate-x-1/2 bg-white p-4 rounded shadow w-[90%] max-w-md space-y-2 z-[1000]">
        <p className="text-sm font-semibold">{placeName}</p>
        <p className="text-xs text-gray-600">
          Lat: {selected.lat.toFixed(4)}, Lng: {selected.lng.toFixed(4)}
        </p>
        <button
          className="bg-green-600 text-white px-4 py-2 rounded w-full"
          onClick={handleAddPlace}
        >
          Add This Place
        </button>
      </div>
    )}
    </div>
  );
}
