import { useEffect, useState } from "react";
import { useAuth } from "../../hooks/useAuth";
import { getPostsByUsername, getTravelPlansByUsername, getWishlistsByUsername } from "../../services/userService";
import { getPlaces } from "../../services/placeService";
import PostCard from "../../components/posts/postCard";
import WishlistCard from "../../components/wishlistCard";
import TravelPlanCard from "../../components/travelPlanCard";

import type { getPost } from "../../types/post";
import type { getWishlistType } from "../../types/wishlist";
import type { placeDTOType } from "../../types/place";
import type { travelPlanOutput } from "../../types/travelplan";

export default function Dashboard() {
  const { username, user_id } = useAuth();
  const [posts, setPosts] = useState<getPost[]>([]);
  const [travelplans, setTravelPlans] = useState<travelPlanOutput[]>([]);
  const [wishlists, setWishlists] = useState<getWishlistType[]>([]);
  const [places, setPlaces] = useState<placeDTOType[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedTab, setSelectedTab] = useState<"posts" | "wishlists" | "travelplans">("posts");



  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);

      let postData = [];
      let wishlistData = [];
      let placeData = [];
      let travelplansData = [];


      try {
        postData = await getPostsByUsername(username!);
        setPosts(postData);
      } catch (err) {
        console.error("Failed to fetch posts:", err);
      }

    
      try {
        wishlistData = await getWishlistsByUsername(username!);
        setWishlists(wishlistData);
      } catch (err) {
        console.error("Failed to fetch wishlists:", err);
      }

  
      try {
        placeData = await getPlaces();
        setPlaces(placeData);
      } catch (err) {
        console.error("Failed to fetch places:", err);
      }

   
      try {
        travelplansData = await getTravelPlansByUsername(username!);
        setTravelPlans(travelplansData);
      } catch (err) {
        console.error("Failed to fetch travel plans:", err);
      }

      setLoading(false);
    };

    fetchData();
  }, [username, user_id]);


  return (
    <div className="max-w-5xl mx-auto p-6 space-y-8">
      <h1 className="text-3xl font-bold text-gray-800">📊 Your Dashboard</h1>


      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-blue-50 border-l-4 border-blue-500 p-4 rounded shadow">
          <h3 className="text-sm text-gray-500">Total Posts</h3>
          <p className="text-2xl font-semibold text-blue-700">{posts.length}</p>
        </div>
        <div className="bg-pink-50 border-l-4 border-pink-500 p-4 rounded shadow">
          <h3 className="text-sm text-gray-500">Total Wishlists</h3>
          <p className="text-2xl font-semibold text-pink-700">{wishlists.length}</p>
        </div>
        <div className="bg-indigo-50 border-l-4 border-indigo-500 p-4 rounded shadow">
          <h3 className="text-sm text-gray-500">Total Travel Plans</h3>
          <p className="text-2xl font-semibold text-indigo-700">{travelplans.length}</p>
        </div>
      </div>

     
      <div className="flex gap-4 border-b pb-2">
        {["posts", "wishlists", "travelplans"].map((tab) => (
          <button
            key={tab}
            onClick={() => setSelectedTab(tab as any)}
            className={`px-4 py-2 font-medium rounded-t ${
              selectedTab === tab
                ? "bg-blue-600 text-white"
                : "bg-gray-100 text-gray-700 hover:bg-gray-200"
            }`}
          >
            {tab === "posts" && "Posts"}
            {tab === "wishlists" && "Wishlists"}
            {tab === "travelplans" && "Travel Plans"}
          </button>
        ))}
      </div>

    
      <div className="mt-4 mb-5">
        {loading ? (
          <p className="text-gray-500 italic">Loading {selectedTab}...</p>
        ) : selectedTab === "posts" ? (
          posts.length === 0 ? (
            <p className="text-gray-500">No posts yet.</p>
          ) : (
            posts.map((post) => <PostCard key={post.post_id} post={post} />)
          )
        ) : selectedTab === "wishlists" ? (
          wishlists.length === 0 ? (
            <p className="text-gray-500">No wishlists yet.</p>
          ) : (
            wishlists.map((wishlist) => (
              <WishlistCard
                key={wishlist.wishlist_id}
                wishlist={wishlist}
                allPlaces={places}
              />
            ))
          )
        ) : selectedTab === "travelplans" ? (
          travelplans.length === 0 ? (
            <p className="text-gray-500">No travel plans yet.</p>
          ) : (
            travelplans.map((plan) => (
              <TravelPlanCard key={plan.travel_plan_id} plan={plan} />
            ))
          )
        ) : null}
      </div>
    </div>
  );
}
