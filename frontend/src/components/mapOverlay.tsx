import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import L from "leaflet";
import { X } from "lucide-react";
import "leaflet/dist/leaflet.css";

const markerIcon = new L.Icon({
  iconUrl: "https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon.png",
  iconSize: [25, 41],
  iconAnchor: [12, 41],
});

interface MapOverlayProps {
  lat: number;
  lng: number;
  name: string;
  onClose: () => void;
}

export default function MapOverlay({ lat, lng, name, onClose }: MapOverlayProps) {
  return (
    <div className="fixed top-1/4 left-1/2 transform -translate-x-1/2 z-50 h-[50vh] w-[50vw] bg-white border-b shadow-lg animate-slide-down">
      <div className="flex items-center justify-between px-4 py-2 border-b bg-blue-100">
        <h2 className="text-lg font-semibold text-blue-800">Map View: {name}</h2>
        <button onClick={onClose} className="text-gray-600 hover:text-red-600">
          <X />
        </button>
      </div>
      <div className="h-full w-full">
        <MapContainer
          center={[lat, lng]}
          zoom={13}
          scrollWheelZoom={false}
          className="w-full h-full"
        >
          <TileLayer
            attribution='&copy; OpenStreetMap contributors'
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          />
          <Marker position={[lat, lng]} icon={markerIcon}>
            <Popup>{name}</Popup>
          </Marker>
        </MapContainer>
      </div>
    </div>
  );
}
