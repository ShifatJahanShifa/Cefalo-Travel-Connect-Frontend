// import { useEffect, useState } from "react";
// import { getAllPosts, deletePost } from "../services/postService";
// import type { getPost } from "../types/post";
// import PostCard from "../components/posts/postCard";

// export default function HomePage() {
//   const [posts, setPosts] = useState<getPost[]>([]);
//   const [loading, setLoading] = useState(true);

//   useEffect(() => {
//     (async () => {
//       try {
//         const data = await getAllPosts();
//         setPosts(data);
//       } 
//       catch (err) 
//       {
//         console.error("Failed to load posts:", err);
//       } 
//       finally {
//         setLoading(false);
//       }
//     })();
//   }, []);

//   const handleDelete = (postId: string) => {
//     setPosts((prevPosts) => prevPosts.filter((post) => post.post_id !== postId));
//   };

//   return (
//     <div className="max-w-5xl mx-auto p-4">
//       <h1 className="text-3xl font-bold mb-6">All Travel Posts</h1>
//         {loading ? (
//             <p>Loading posts...</p>
//         ) : posts.length === 0 ? (
//             <p>No posts found.</p>
//         ) : (
//         posts.map((post) => (
//             <PostCard key={post.post_id} post={post} onDelete={handleDelete} />
//         ))
//       )}
//     </div>
//   );
// }


import { useEffect, useState } from "react";
import { getAllPosts, deletePost } from "../../services/postService";
import { getFilteredPosts } from "../../services/postService"; // import new filter fn
import type { getPost } from "../../types/post";
import PostCard from "../../components/posts/postCard";

export default function HomePage() {
  const [posts, setPosts] = useState<getPost[]>([]);
  const [loading, setLoading] = useState(true);

  // Filter states
  const [transportType, setTransportType] = useState("");
  const [placeName, setPlaceName] = useState("");
  const [accommodationType, setAccommodationType] = useState("");

  useEffect(() => {
    loadAllPosts();
  }, []);

  const loadAllPosts = async () => {
    try {
      const data = await getAllPosts();
      setPosts(data);
    } catch (err) {
      console.error("Failed to load posts:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = (postId: string) => {
    setPosts((prevPosts) => prevPosts.filter((post) => post.post_id !== postId));
  };

  const handleFilter = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const filtered = await getFilteredPosts({
        transport_type: transportType,
        place_name: placeName,
        accommodation_type: accommodationType,
      });
      setPosts(filtered);
    } catch (err) {
      console.error("Failed to filter posts:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleClearFilters = () => {
    setTransportType("");
    setPlaceName("");
    setAccommodationType("");
    loadAllPosts();
  };

  return (
    <div className="max-w-5xl mx-auto p-4">
      <h1 className="text-3xl font-bold mb-6">All Travel Posts</h1>

      {/* Filter Form */}
      <form
        onSubmit={handleFilter}
        className="bg-slate-100 rounded-xl shadow p-4 mb-6 space-y-4 border"
      >
        <h2 className="text-xl font-semibold text-gray-700">Filter Posts</h2>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <input
            type="text"
            value={transportType}
            onChange={(e) => setTransportType(e.target.value)}
            placeholder="Transport Type (e.g., bus)"
            className="border p-2 rounded"
          />
          <input
            type="text"
            value={placeName}
            onChange={(e) => setPlaceName(e.target.value)}
            placeholder="Place Name (e.g., Sylhet)"
            className="border p-2 rounded"
          />
          <input
            type="text"
            value={accommodationType}
            onChange={(e) => setAccommodationType(e.target.value)}
            placeholder="Accommodation Type (e.g., villa)"
            className="border p-2 rounded"
          />
        </div>
        <div className="flex gap-3 mt-4">
          <button
            type="submit"
            className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
          >
          Filter
          </button>
          <button
            type="button"
            onClick={handleClearFilters}
            className="bg-gray-200 text-gray-800 px-4 py-2 rounded hover:bg-gray-300"
          >
          Clear
          </button>
        </div>
      </form>

      {/* Posts Section */}
      {loading ? (
        <p>Loading posts...</p>
      ) : posts.length === 0 ? (
        <p>No posts found.</p>
      ) : (
        posts.map((post) => (
          <PostCard key={post.post_id} post={post} onDelete={handleDelete} />
        ))
      )}
    </div>
  );
}
