// pages/Dashboard.tsx
import { useEffect, useState } from "react";
import { useAuth } from "../hooks/useAuth";
import { getPostsByUsername } from "../services/userService";
import type { getPost } from "../types/post";
import PostCard from "../components/posts/postCard";

export default function Dashboard() {
  const { username } = useAuth();
  const [posts, setPosts] = useState<getPost[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchUserPosts = async () => {
      try {
        const data = await getPostsByUsername(username!);
        setPosts(data);
      } catch (err) {
        console.error("Failed to fetch user's posts:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchUserPosts();
  }, [username]);

  return (
    <div className="max-w-5xl mx-auto p-6 space-y-6">
      <h1 className="text-3xl font-bold">Your Dashboard</h1>
      <p className="text-gray-600">Here are the posts you've created:</p>

      {loading ? (
        <p>Loading your posts...</p>
      ) : posts.length === 0 ? (
        <p>You haven't created any posts yet.</p>
      ) : (
        posts.map((post) => <PostCard key={post.post_id} post={post} />)
      )}
    </div>
  );
}
