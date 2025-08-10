import { useParams, useLocation } from "react-router-dom";
import { useEffect, useState } from "react";
import { getWishlistById } from "../../services/wishlistService";
import type { getWishlistType } from "../../types/wishlist";

export default function ViewSingleWishlist() {
  const { wishlist_id } = useParams();
  const [wishlist, setWishlist] = useState<getWishlistType | null>(null);

  useEffect(() => {
    const fetchWishlist = async () => {
      try {
        const result = await getWishlistById(wishlist_id!);
        setWishlist(result);
      } catch (err) {
        console.error("Error fetching wishlist:", err);
      }
    };

    fetchWishlist();
  }, [wishlist_id]);

  if (!wishlist) return <p className="text-center mt-10 text-gray-500">Loading...</p>;

  return (
    <div className="p-6 max-w-3xl mx-auto bg-sky-100 rounded border border-sky-400 mt-10 mb-10 shadow-xl space-y-4">
      <div className="flex flex-row gap-10 justify-between items-center">
        <h1 className="text-3xl font-bold text-blue-700 mb-4">{wishlist.title}</h1>
        { wishlist.is_public && (
          <span className="bg-green-500 px-2 py-2 hover:bg-green-800 rounded-2xl hover:text-white"> Public</span>
        )}
      </div>

      <div className="flex flex-col gap-3 text-gray-800">

        <div>
          <span className="font-semibold">Latitude:</span> {wishlist.place_latitude}
        </div>
        <div>
          <span className="font-semibold">Longitude:</span> {wishlist.place_longitude}
        </div>
        <div>
          <span className="font-semibold">Type:</span> {wishlist.type}
        </div>
        <div>
          <span className="font-semibold">Theme:</span> {wishlist.theme}
        </div>
        <div>
          <span className="font-semibold">Region:</span> {wishlist.region}
        </div>
        <div className="sm:col-span-2">
          <span className="font-semibold">Note:</span> {wishlist.note}
        </div>
      </div>
    </div>
  );
}
