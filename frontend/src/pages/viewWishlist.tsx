import { useLocation } from "react-router-dom";
import type { getWishlistType } from "../types/wishlist";

export default function ViewWishlistPage() {
  const location = useLocation();
  const data = location.state as getWishlistType;

  return (
    <div className="max-w-2xl mx-auto p-6 bg-white rounded shadow space-y-4">
      <h1 className="text-2xl font-bold">{data.title}</h1>
      <p><strong>Place:</strong> {data.place_name}</p>
      <p><strong>Latitude:</strong> {data.place_latitude}</p>
      <p><strong>Longitude:</strong> {data.place_longitude}</p>
      <p><strong>Type:</strong> {data.type}</p>
      <p><strong>Theme:</strong> {data.theme}</p>
      <p><strong>Region:</strong> {data.region}</p>
      <p><strong>Note:</strong> {data.note}</p>
      <p><strong>Public:</strong> {data.is_public ? "Yes" : "No"}</p>
    </div>
  );
}
