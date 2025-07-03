import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { getWishlists } from "../services/wishlistService";
import type { getWishlistType, wishlist} from "../types/wishlist";
import WishlistCard from "../components/wishlistCard";
import type { placeDTOType } from "../types/place";
import { getPlaces } from "../services/placeService";

export default function WishlistPage() {
  const [wishlists, setWishlists] = useState<getWishlistType[]>([]);
   const [places, setPlaces] = useState<placeDTOType[]>([]);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchWishlists = async () => {
      try {
        const data = await getWishlists();
        const places = await getPlaces();
        setWishlists(data);
        setPlaces(places);
      } catch (err) {
        console.error("Error fetching wishlists:", err);
      }
    };

    fetchWishlists();
  }, []);

  return (
    <div className="max-w-5xl mx-auto p-6 space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold">Wishlist</h1>
        <button
          onClick={() => navigate("/wishlists/create")}
          className="bg-blue-600 text-white px-4 py-2 rounded"
        >
          + Create Wishlist
        </button>
      </div>

      <div>
        <h2 className="text-xl font-semibold mt-6 mb-4">Explore Wishlists</h2>
        {wishlists.length === 0 ? (
          <p>No wishlists found.</p>
        ) : (
          <div className="space-y-4">
            {wishlists.map((wishlist) => (
              <WishlistCard key={wishlist.wishlist_id} wishlist={wishlist} allPlaces={places}/>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
