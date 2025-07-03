// import { useEffect, useState } from "react";
// import { useAuth } from "../hooks/useAuth";
// import { getPostsByUsername } from "../services/userService";
// import type { getPost } from "../types/post";
// import PostCard from "../components/posts/postCard";
// import WishlistCard from "../components/wishlistCard";
// import type { wishlist, getWishlistType } from "../types/wishlist";
// import { getWishlistsByUsername } from "../services/userService";
// import { getPlaces } from "../services/placeService";
// import { getPlaceById } from "../utils/getPlaceById";
// import type { placeDTOType } from "../types/place";

// export default function Dashboard() {
//   const { username } = useAuth();
//   const [posts, setPosts] = useState<getPost[]>([]);
//   const [wishlists, setWishlists] = useState<getWishlistType[]>([]);
//   const [loading, setLoading] = useState(true);

//   useEffect(() => {
//     const fetchData = async () => {
//       try {
//         const [postsData, wishlistsData, places] = await Promise.all([
//           getPostsByUsername(username!),
//           getWishlistsByUsername(username!),
//           getPlaces()
//         ]);
//         setPosts(postsData);
        
//         // loop through every wishlists 
//         wishlistsData.map(w => {
//             const myInterestedPlace: placeDTOType | null = getPlaceById(places, w.reference_id);
//             w.place_name = myInterestedPlace?.place_name
//             w.place_latitude = myInterestedPlace?.location.latitude
//             w.place_longitude = myInterestedPlace?.location.longitude
//         })
//         setWishlists(wishlistsData);
//       } catch (err) {
//         console.error("Failed to fetch user data:", err);
//       } finally {
//         setLoading(false);
//       }
//     };

//     fetchData();
//   }, [username]);

//   return (
//     <div className="max-w-5xl mx-auto p-6 space-y-6">
//       <h1 className="text-3xl font-bold">Your Dashboard</h1>

//       {/* Posts */}
//       <div>
//         <h2 className="text-2xl font-semibold">Your Posts</h2>
//         {loading ? (
//           <p>Loading your posts...</p>
//         ) : posts.length === 0 ? (
//           <p>You haven't created any posts yet.</p>
//         ) : (
//           posts.map((post) => <PostCard key={post.post_id} post={post} />)
//         )}
//       </div>

//       {/* Wishlists */}
//       <div>
//         <h2 className="text-2xl font-semibold ">Your Wishlists</h2>
//         {loading ? (
//           <p>Loading your wishlists...</p>
//         ) : wishlists.length === 0 ? (
//           <p>You haven't added any wishlists yet.</p>
//         ) : (
//           wishlists.map((w) => <WishlistCard key={w.wishlist_id} wishlist={w} />)
//         )}
//       </div>
//     </div>
//   );
// }


import { useEffect, useState } from "react";
import { useAuth } from "../hooks/useAuth";
import { getPostsByUsername, getWishlistsByUsername } from "../services/userService";
// import { getWishlistsByUserId } from "../services/wishlistService";
import { getPlaces } from "../services/placeService";
import PostCard from "../components/posts/postCard";
import WishlistCard from "../components/wishlistCard";
import type { getPost } from "../types/post";
import type { wishlist, getWishlistType } from "../types/wishlist";
import type { placeDTOType } from "../types/place";

export default function Dashboard() {
  const { username, user_id } = useAuth();
  const [posts, setPosts] = useState<getPost[]>([]);

  const [wishlists, setWishlists] = useState<getWishlistType[]>([]);
  const [places, setPlaces] = useState<placeDTOType[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        // const postData = await getPostsByUsername(username!);
        // const wishlistData = await getWishlistsByUsername(username!);
        // const placeData = await getPlaces();
        const [postData, wishlistData, placeData]= await Promise.all([
        getPostsByUsername(username!),
        getWishlistsByUsername(username!),
        getPlaces()])
        setPosts(postData);
        setWishlists(wishlistData);
        setPlaces(placeData);
      } catch (err) {
        console.error("Dashboard fetch failed:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [username, user_id]);

  return (
    <div className="max-w-5xl mx-auto p-6 space-y-8">
      <h1 className="text-3xl font-bold">Your Dashboard</h1>

      {/* Posts */}
      <section>
        <h2 className="text-xl font-semibold">Your Posts</h2>
        {loading ? (
          <p>Loading posts...</p>
        ) : posts.length === 0 ? (
          <p>No posts yet.</p>
        ) : (
          posts.map((post) => <PostCard key={post.post_id} post={post} />)
        )}
      </section>

      {/* Wishlists */}
      <section>
        <h2 className="text-xl font-semibold">Your Wishlists</h2>
        {loading ? (
          <p>Loading wishlists...</p>
        ) : wishlists.length === 0 ? (
          <p>No wishlists yet.</p>
        ) : (
          wishlists.map((wishlist) => (
            <WishlistCard
              key={wishlist.wishlist_id}
              wishlist={wishlist}
              allPlaces={places}
            />
          ))
        )}
      </section>
    </div>
  );
}
