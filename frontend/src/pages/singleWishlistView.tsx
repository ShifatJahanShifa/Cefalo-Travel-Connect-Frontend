import { useParams, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { getWishlistById } from "../services/wishlistService";
import type { getWishlistType } from "../types/wishlist";
// import PostCard from "../components/posts/postCard";

export default function ViewSingleWishlist() {
  const { wishlist_id } = useParams();
  const [ wishlist, setWishlist] = useState<getWishlistType | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchWishlist = async () => {
      try {
        const result = await getWishlistById(wishlist_id!)
        setWishlist(result)
      } catch (err) {
        console.error("Error fetching post:", err);
      }
    };

    fetchWishlist()
  }, [wishlist_id]);

  if (!wishlist) return <p>Loading...</p>;

  return (
    <div className="p-6 max-w-4xl mx-auto">
      {/* <PostCard 
        post={post} 
        onDelete={() => navigate("/home")}  
      /> */} 

     <h1 className="text-2xl font-bold">{wishlist.title}</h1>
      {/* <p><strong>Place:</strong> {wishlist.place_name}</p> */}
      <p><strong>Latitude:</strong> {wishlist.place_latitude}</p>
      <p><strong>Longitude:</strong> {wishlist.place_longitude}</p>
      <p><strong>Type:</strong> {wishlist.type}</p>
      <p><strong>Theme:</strong> {wishlist.theme}</p>
      <p><strong>Region:</strong> {wishlist.region}</p>
      <p><strong>Note:</strong> {wishlist.note}</p>
      <p><strong>Public:</strong> {wishlist.is_public ? "Yes" : "No"}</p>
    </div>
  );
}
