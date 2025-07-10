import PostForm from "../../components/posts/postForm";
import { createPost } from "../../services/postService";
import { useNavigate } from "react-router-dom";

export default function CreatePostPage() {
  const navigate = useNavigate();

  const handleCreate = async (formData: any) => {
    try {
      await createPost(formData);
      localStorage.removeItem('postFormData')
      navigate("/home");
    } 
    catch (err) {
      console.error("Post creation failed:", err);
      alert("Post creation failed. Check console for details.");
    }
  };

  return (
    <div className="p-4">
      <PostForm onSubmit={handleCreate} />
    </div>
  );
}
