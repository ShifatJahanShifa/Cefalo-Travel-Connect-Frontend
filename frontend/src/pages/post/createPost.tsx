import PostForm from "../../components/posts/postForm";
import { createPost } from "../../services/postService";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { logger } from "../../utils/logger";

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
      logger.error("Post creation failed:", err);
      toast.error("Post creation failed. Check console for details.");
    }
  };

  return (
    <div>
      <PostForm onSubmit={handleCreate} />
    </div>
  );
}
