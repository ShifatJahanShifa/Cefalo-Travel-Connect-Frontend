// export default function HomePage() {
//   return <div className="p-4">This is the Home Page</div>;
// }

import { useEffect, useState } from "react";
import { getAllPosts } from "../services/postService";
import type { getPost } from "../types/post";
import PostCard from "../components/posts/postCard";


export default function HomePage() {
    const [posts, setPosts] = useState<getPost[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        (async () => {
        try {
            const data = await getAllPosts();
            setPosts(data);
        } catch (err) {
            console.error("Failed to load posts:", err);
        } finally {
            setLoading(false);
        }
        })();
    }, []);

    return (
        <div className="max-w-5xl mx-auto p-4">
        <h1 className="text-3xl font-bold mb-6">All Travel Posts</h1>
        {loading ? (
            <p>Loading posts...</p>
        ) : posts.length === 0 ? (
            <p>No posts found.</p>
        ) : (
            posts.map((post) => <PostCard key={post.post_id} post={post} />)
        )}
        </div>
    );
}
