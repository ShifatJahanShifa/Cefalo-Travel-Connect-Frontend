import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import PostForm from "../../components/posts/postForm";
import { getPostByPostId, updatePost } from "../../services/postService";
import type { getPost } from "../../types/post";

export default function EditPostPage() {
  const { post_id } = useParams();
  const navigate = useNavigate();
  const [initialData, setInitialData] = useState<getPost | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const data = await getPostByPostId(post_id!);
        setInitialData(data);
      } catch (err) {
        console.error("Failed to fetch post for editing:", err);
      }
    };
    fetchData();
  }, [post_id]);

  const handleUpdate = async (formData: any) => {
    try {
      console.log('update', formData)
      await updatePost(post_id!, formData);
      localStorage.removeItem('postFormData')
      navigate("/home");
    } 
    catch (err) {
      console.error("Post update failed:", err);
      alert("Post update failed. Check console for details.");
    }
  };

  if (!initialData) return <p>Loading post...</p>;

  return (
    <div className="p-4">
      <PostForm initialData={initialData} onSubmit={handleUpdate} />
    </div>
  );
}
