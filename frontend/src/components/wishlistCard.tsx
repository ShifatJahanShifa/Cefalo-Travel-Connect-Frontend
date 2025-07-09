import { useAuth } from "../hooks/useAuth";
import { useNavigate } from "react-router-dom";
import { getPlaceById } from "../utils/getPlaceById";
import type { wishlist, getWishlistType } from "../types/wishlist";
import type { placeDTOType } from "../types/place";
import { deleteWishlist } from "../services/wishlistService";
import { useState } from "react";

interface Props {
  wishlist: getWishlistType;
  allPlaces: placeDTOType[];
}

export default function WishlistCard({ wishlist, allPlaces }: Props) {
  const { user_id } = useAuth();
  const navigate = useNavigate();
  const [menuOpen, setMenuOpen] = useState(false);
  const [shareLink, setShareLink] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);

  const place = getPlaceById(allPlaces, wishlist.reference_id);
  if (!place) return null;

  const handleEdit = () => {
    navigate(`/wishlists/${wishlist.wishlist_id}/edit`, {
      state: { ...wishlist, ...place },
    });
  };

  const handleView = () => {
    navigate(`/wishlists/${wishlist.wishlist_id}/view`, {
      state: { ...wishlist, ...place },
    });
  };

  const handleDelete = async () => {
    if (confirm("Are you sure you want to delete this wishlist?")) {
      try {
        await deleteWishlist(wishlist.wishlist_id);
        navigate("/wishlists");
      } catch (err) {
        alert("Failed to delete.");
      }
    }
  };

  const handleShare = () => {
    const link = `${window.location.origin}/shared/wishlists/${wishlist.wishlist_id}`;
    setShareLink(link);
    setCopied(false);
  };

  const handleCopy = async () => {
    if (shareLink) {
      await navigator.clipboard.writeText(shareLink);
      setCopied(true);
    }
  };

  return (
    <div className="relative mb-6 bg-sky-100 border border-sky-400 rounded-xl p-6 shadow-xl transition duration-300 space-y-3">
      <div className="flex justify-between items-start">
        <div>
          <h3 className="text-xl font-semibold text-blue-700 mb-1">{wishlist.title}</h3>
          <p className="text text-gray-800"><span className="font-bold">Place name:</span> {place.place_name}</p>
          <p className="text text-gray-800">
            <span className="font-bold">Latitude:</span> {place.location.latitude}, <span className="font-bold">Longitude: </span>{place.location.longitude}
          </p>
        </div>

        <div className="relative">
          <button
            className="text-gray-500 hover:text-gray-800 text-lg font-bold px-2"
            onClick={() => setMenuOpen(!menuOpen)}
          >
            ⋮
          </button>

          {menuOpen && (
            <div className="absolute right-0 mt-2 w-40 bg-white border border-gray-200 rounded-md shadow-lg z-20">
              <button
                onClick={handleView}
                className="w-full text-left px-4 py-2 hover:bg-gray-100"
              >
                View
              </button>
              {wishlist.user_id === user_id && (
                <>
                  <button
                    onClick={handleEdit}
                    className="w-full text-left px-4 py-2 hover:bg-gray-100"
                  >
                    Edit
                  </button>
                  <button
                    onClick={handleDelete}
                    className="w-full text-left px-4 py-2 text-red-600 hover:bg-red-50"
                  >
                    Delete
                  </button>
                </>
              )}
            </div>
          )}
        </div>
      </div>

      {wishlist.is_public && (
      <div className="mt-2 space-y-2">
        <button
          onClick={handleShare}
          className="text-sm text-blue-600 hover:underline"
        >
          Share
        </button>

        {shareLink && (
          <div className="bg-gray-50 border rounded p-2 flex items-center justify-between">
            <span className="text-xs text-gray-800 break-all">{shareLink}</span>
            <button
              onClick={handleCopy}
              className="ml-2 text-xs text-blue-500 hover:underline"
            >
              {copied ? "Copied!" : "Copy"}
            </button>
          </div>
        )}
      </div>
      )}
    </div>
  );
}
