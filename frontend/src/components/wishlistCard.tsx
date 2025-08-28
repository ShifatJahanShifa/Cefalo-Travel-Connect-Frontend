import { useAuth } from "../hooks/useAuth";
import { useNavigate } from "react-router-dom";
import { getPlaceById } from "../utils/placeInformation";
import type { wishlist, getWishlistType } from "../types/wishlist";
import type { placeDTOType } from "../types/place";
import { deleteWishlist } from "../services/wishlistService";
import { useState, useEffect } from "react";
import type { getUser } from "../types/user";
import { getUserInfo } from "../utils/userInfo";
import UserInfo from "./userInfo";
import { Share2 } from "lucide-react";
import { logger } from "../utils/logger";


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
  const [wishlistWriter, setWishlistWriter] = useState<getUser | undefined>(undefined)

  const place = getPlaceById(allPlaces, wishlist.reference_id);
  if (!place) return null;

  useEffect(() => {
      const fetchUserInfo = async () => {
        try {
          const writer: getUser| undefined = await getUserInfo(wishlist.user_id);
          setWishlistWriter(writer);
        } catch (error) {
          logger.error("Failed to fetch user:", error);
        }
      };
  
      fetchUserInfo();
    }, [wishlist.user_id]);
  

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
    
   
    {shareLink && (
      <div className="absolute  z-50 w-[280px] bg-white rounded-lg shadow-lg border border-gray-300 p-4">
        <p className="text-sm text-gray-800 font-medium break-words">{shareLink}</p>
        <div className="flex justify-between items-center mt-3">
          <button
            onClick={handleCopy}
            className="text-xs text-blue-600 hover:text-blue-800 font-semibold"
          >
            {copied ? "✓ Copied!" : "Copy"}
          </button>
          <button
            onClick={() => setShareLink(null)}
            className="text-xs text-red-500 hover:text-red-700"
          >
            ✕ Close
          </button>
        </div>
      </div>
    )}

 
    <div className="flex justify-between items-start">
      <div>
        <UserInfo
          username={wishlistWriter?.username!}
          imageUrl={wishlistWriter?.profile_picture_url!}
        />
        <h3 className="text-xl font-semibold text-blue-700 mb-1">{wishlist.title}</h3>
        <p className="text text-gray-800">
          <span className="font-bold">Place name:</span> {place.place_name}
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
      <button
        onClick={handleShare}
        className="text-sm text-blue-600 hover:underline"
      >
        <Share2 className="w-5 h-5 hover:text-blue-600 cursor-pointer" />
      </button>
    )}
  </div>
);


}
