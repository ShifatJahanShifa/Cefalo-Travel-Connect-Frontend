import { useEffect, useState } from "react";
import { getAllPosts, deletePost } from "../../services/postService";
import { getFilteredPosts } from "../../services/postService"; 
import type { getPost } from "../../types/post";
import PostCard from "../../components/posts/postCard";
import { useNavigate } from "react-router-dom";

export default function HomePage() {
  const [posts, setPosts] = useState<getPost[]>([]);
  const [loading, setLoading] = useState(true);

 
  const [transportType, setTransportType] = useState("");
  const [placeName, setPlaceName] = useState("");
  const [accommodationType, setAccommodationType] = useState("");

  const navigate = useNavigate()

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
    <div className="max-w-5xl mx-auto p-4 mt-10">
      <div className="flex flex-row justify-between items-center mb-6">
      <h1 className="text-3xl font-bold">Explore Travel Posts</h1>
      <button
          onClick={() => navigate("/posts/create")}
          className="bg-green-600 text-white px-4 py-2 rounded"
        >
          Create Post
        </button>
      </div>

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
