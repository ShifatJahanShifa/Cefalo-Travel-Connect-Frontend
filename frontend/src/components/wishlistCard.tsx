// import type { getWishlistType, wishlist } from "../types/wishlist";
// import { useNavigate } from "react-router-dom";
// import { useAuth } from "../hooks/useAuth";
// import { useState, useEffect } from 'react'

// interface Props {
//     wishlist: getWishlistType
//     onDelete?: (wishlist_id: string) => void;
// }


// export default function WishlistCard({ wishlist, onDelete }: Props) {


//     const { user_id } = useAuth();
//     const [menuOpen, setMenuOpen] = useState(false);
//     const navigate = useNavigate();

//     const handleView = () => navigate(`/posts/${wishlist.wishlist_id}/view`);
//     const handleEdit = () => navigate(`/posts/${wishlist.wishlist_id}/edit`);
        
//     const handleDelete = async () => {
//         const confirmed = confirm("Are you sure you want to delete this post?");
//         if (!confirmed) return;
//         try {
//         // await deletePost(post.post_id);
//         alert("Deleted successfully.");
//         if (onDelete) 
//         {
//             // onDelete(post.post_id);  
//         }
//         } 
//         catch (err) {
//         console.error("Delete failed", err);
//         alert("Something went wrong.");
//         }
//   };
//   return (
//     <div className="p-4 border rounded bg-white shadow m-2">

//         <div className="absolute top-2 right-2">
//             <button
//               onClick={() => setMenuOpen(!menuOpen)}
//               className="text-gray-600 text-xl font-bold"
//             >
//               ⋮
//             </button>
//             {menuOpen && (
//               <div className="absolute right-0 mt-2 w-40 bg-white border shadow-md rounded z-10">
//                 <button
//                   onClick={handleView}
//                   className="block px-4 py-2 w-full hover:bg-gray-100 text-left"
//                 >
//                   View
//                 </button>
//                 {wishlist.user_id === user_id && (
//                   <>
//                     <button
//                       onClick={handleEdit}
//                       className="block px-4 py-2 w-full hover:bg-gray-100 text-left"
//                     >
//                       Edit
//                     </button>
//                     <button
//                       onClick={handleDelete}
//                       className="block px-4 py-2 w-full hover:bg-red-100 text-left text-red-600"
//                     >
//                       Delete
//                     </button>
//                   </>
//                 )}
//               </div>
//             )}
//           </div> 
//       <h3 className=" text-gray-600"><b>Title:</b> {wishlist.title}</h3>
//       <p className="text-xl">{wishlist.place_name}</p>
//       <p><b>Theme: </b>{wishlist.theme}</p>
//       <p><b>Region: </b>{wishlist.region}</p>
      
//     </div>
//   );
// }



// refined -----------------------------------------------------------------

// src/components/wishlist/WishlistCard.tsx
import { useAuth } from "../hooks/useAuth";
import { useNavigate } from "react-router-dom";
import { getPlaceById } from "../utils/getPlaceById"; // utility created earlier
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
    navigate(`/wishlist/${wishlist.wishlist_id}/edit`, {
      state: { ...wishlist, ...place },
    });
  };

  const handleView = () => {
    navigate(`/wishlist/${wishlist.wishlist_id}/view`, {
      state: { ...wishlist, ...place },
    });
  };

  const handleDelete = async () => {
    if (confirm("Are you sure you want to delete this wishlist?")) {
      try {
        await deleteWishlist(wishlist.wishlist_id);
        // location.reload(); // optionally lift state up instead  
        
        navigate('/wishlists')
      } catch (err) {
        alert("Failed to delete.");
      }
    }
  };


    const handleShare = () => {
    const link = `${window.location.origin}/shared/wishlist/${wishlist.wishlist_id}`;
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
    <div className="border rounded p-4 m-4 shadow relative">
      <h3 className="text-lg font-bold">{wishlist.title}</h3>
      <p className="text-sm text-gray-600">{place.place_name}</p>
      <p className="text-sm text-gray-500">Lat: {place.location.latitude}, Lng: {place.location.longitude}</p>


         {(
        <div className="mt-2">
          <button
            onClick={handleShare}
            className="text-sm text-blue-600 underline"
          >
            Share
          </button>
          {shareLink && (
            <div className="mt-1 bg-gray-100 p-2 rounded flex items-center justify-between">
              <span className="text-sm break-all">{shareLink}</span>
              <button
                onClick={handleCopy}
                className="ml-2 text-xs text-blue-500 underline"
              >
                {copied ? "Copied!" : "Copy"}
              </button>
            </div>
          )}
        </div>
      )}
      {/* Three dot menu */}
      <div className="absolute top-2 right-2">
        <div className="dropdown dropdown-end">
          <button className="text-gray-500" onClick={() => setMenuOpen(!menuOpen)}>⋮</button>
       

             {menuOpen && (
              <div className="absolute right-0 mt-2 w-40 bg-white border shadow-md rounded z-10">
                <button
                  onClick={handleView}
                  className="block px-4 py-2 w-full hover:bg-gray-100 text-left"
                >
                  View
                </button>
                {wishlist.user_id === user_id && (
                  <>
                    <button
                      onClick={handleEdit}
                      className="block px-4 py-2 w-full hover:bg-gray-100 text-left"
                    >
                      Edit
                    </button>
                    <button
                      onClick={handleDelete}
                      className="block px-4 py-2 w-full hover:bg-red-100 text-left text-red-600"
                    >
                      Delete
                    </button>
                  </>
                )}
              </div>
            )}

                  {/* Share Button */}
     
        </div>
      </div>
    </div>
  );
}
