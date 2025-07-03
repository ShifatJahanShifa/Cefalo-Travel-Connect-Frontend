// import { useParams } from "react-router-dom";
// import { useEffect, useState } from "react";
// import { getPostByPostId } from "../services/postService"; // service you'll create
// import type { getPost } from "../types/post";
// import PostCard from "../components/posts/postCard";

// export default function ViewPost() {
//   const { post_id } = useParams();
//   const [post, setPost] = useState<getPost | null>(null);

//   useEffect(() => {
//     const fetchPost = async () => {
//       try {
//         const result = await getPostByPostId(post_id!);
//         setPost(result);
//       } catch (err) {
//         console.error("Error fetching post:", err);
//       }
//     };

//     fetchPost();
//   }, [post_id]);

//   if (!post) return <p>Loading...</p>;

//   return (
//     <div className="p-6 max-w-4xl mx-auto">
//       <PostCard post={post} />
//     </div>
//   );
// }


import { useParams, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { getPostByPostId } from "../services/postService";
import type { getPost } from "../types/post";
import PostCard from "../components/posts/postCard";

export default function ViewPost() {
  const { post_id } = useParams();
  const [post, setPost] = useState<getPost | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchPost = async () => {
      try {
        const result = await getPostByPostId(post_id!);
        setPost(result);
      } catch (err) {
        console.error("Error fetching post:", err);
      }
    };

    fetchPost();
  }, [post_id]);

  if (!post) return <p>Loading...</p>;

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <PostCard 
        post={post} 
        onDelete={() => navigate("/home")}  
      />
    </div>
  );
}
