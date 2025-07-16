import PostForm from "../../components/posts/postForm";
import { createPost } from "../../services/postService";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

export default function CreatePostPage() {
  const navigate = useNavigate();

  const handleCreate = async (formData: any) => {
    try {
      await createPost(formData);
      localStorage.removeItem('postFormData')
      toast.success("successfully created post")
      navigate("/home");
    } 
    catch (err) {
      console.error("Post creation failed:", err);
      alert("Post creation failed. Check console for details.");
    }
  };

  return (
    <div>
      <PostForm onSubmit={handleCreate} />
    </div>
  );
}
