import type { getPost } from "../../types/post";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../hooks/useAuth";
import { deletePost, togglePostlike, unlikePost } from "../../services/postService"; 

interface Props {
    post: getPost;
    onDelete?: (postId: string) => void;
}

export default function PostCard({ post, onDelete }: Props) {
  const { user_id } = useAuth();
  const [menuOpen, setMenuOpen] = useState(false);
  const navigate = useNavigate();

  const handleView = () => navigate(`/posts/${post.post_id}/view`);
  const handleEdit = () => navigate(`/posts/${post.post_id}/edit`);
    
  const handleDelete = async () => {
    const confirmed = confirm("Are you sure you want to delete this post?");
    if (!confirmed) return;
    try {
      await deletePost(post.post_id);
      alert("Deleted successfully.");
      if (onDelete) onDelete(post.post_id);  
    } 
    catch (err) {
      console.error("Delete failed", err);
      alert("Something went wrong.");
    }
  };

  const [likesCount, setLikesCount] = useState(post.likes_count);
  const [hasLiked, setHasLiked] = useState(false); 

  const handleLikeToggle = async () => {
    try {
      if (hasLiked) {
        await togglePostlike(post.post_id);
        setLikesCount((prev) => Math.max(prev - 1, 0));
      } 
      else 
      {
        await togglePostlike(post.post_id);
        setLikesCount((prev) => prev + 1);
      }
      setHasLiked(!hasLiked);
    } 
    catch (err) {
      console.error("Failed to toggle like:", err);
    }
  };


  return (
        <div className="border rounded p-4 shadow mb-6 bg-white relative">
          <div className="absolute top-2 right-2">
            <button
              onClick={() => setMenuOpen(!menuOpen)}
              className="text-gray-600 text-xl font-bold"
            >
              ⋮
            </button>
            {menuOpen && (
              <div className="absolute right-0 mt-2 w-40 bg-white border shadow-md rounded z-10">
                <button
                  onClick={handleView}
                  className="block px-4 py-2 w-full hover:bg-gray-100 text-left"
                >
                  View
                </button>
                {post.user_id === user_id && (
                  <>
                    <button
                      onClick={handleEdit}
                      className="block px-4 py-2 w-full hover:bg-gray-100 text-left"
                    >
                      Edit
                    </button>
                    <button
                      onClick={handleDelete}
                      className="block px-4 py-2 w-full hover:bg-red-100 text-left text-red-600"
                    >
                      Delete
                    </button>
                  </>
                )}
              </div>
            )}
          </div> 

          <h2 className="text-2xl font-bold mb-1">{post.title}</h2>
          <p className="text-gray-500 text-sm mb-2">
            Duration: {post.duration} | Cost: ${post.total_cost} | Effort: {post.effort}
          </p>
          <p className="mb-2"><b>Categories:</b> {post.categories.join(", ")}</p>
          <p className="mb-4">{post.description}</p>

          {post.accommodations && post.accommodations?.length > 0 && (
            <div className="mb-3">
              <h3 className="font-semibold text-lg">Accommodations</h3>
              <ul className="list-disc pl-5">
                {post.accommodations.map((a, i) => (
                  <li key={i}>
                    {a.accommodation_type} - {a.accommodation_name} <br></br>
                    Cost: ${a.cost} <br></br>
                    Rating: {a.rating} <br></br>
                    Review: {a.review}
                  </li>
                ))}
              </ul>
            </div>
          )}

          {post.places && post.places?.length > 0 && (
            <div className="mb-3">
              <h3 className="font-semibold text-lg">Places</h3>
              <ul className="list-disc pl-5">
                {post.places.map((p, i) => (
                  <li key={i}>
                    {p.place_name} <br></br>
                    Cost: ${p.cost} <br></br>
                    Rating: {p.rating} <br></br>
                    review: {p.review}
                  </li>
                ))}
              </ul>
            </div>
          )}

          {post.transports && post.transports?.length > 0 && (
            <div className="mb-3">
              <h3 className="font-semibold text-lg">Transports</h3>
              <ul className="list-disc pl-5">
                {post.transports.map((t, i) => (
                  <li key={i}>
                    {t.transport_type} - {t.transport_name} <br></br>
                    Cost: ${t.cost} <br></br>
                    Rating: {t.rating}
                  </li>
                ))}
              </ul>
            </div>
          )}

          {post.postFoods && post.postFoods?.length > 0 && (
            <div className="mb-3">
              <h3 className="font-semibold text-lg">Foods</h3>
              <ul className="list-disc pl-5">
                {post.postFoods.map((f, i) => (
                  <li key={i}>
                    {f.food_name} <br></br>
                    Cost: ${f.cost} <br></br>
                    Rating: {f.rating} <br></br> 
                    Review: {f.review}
                  </li>
                ))}
              </ul>
            </div>
          )}

          {post.images && post.images?.length > 0 && (
            <div className="mt-4 grid grid-cols-2 gap-4">
              {post.images.map((img, i) => (
                <div key={i} className="border rounded overflow-hidden">
                  <img
                    src={img.image_url}
                    alt={img.caption || "Image"}
                    className="w-full h-48 object-cover"
                  />
                  {img.caption && <p className="p-2 text-sm text-center">{img.caption}</p>}
                </div>
              ))}
            </div>
          )}

          <br></br>
          <hr className="text-zinc-400"></hr>
          <div className="mb-3 flex items-center gap-2">
            <button
              onClick={handleLikeToggle}
              className={`text-xl ${hasLiked ? "text-red-600" : "text-gray-400"}`}
              aria-label="Toggle Like"
            >
              {hasLiked ? "♥" : "♡"}
            </button>
            <span className="text-sm">{likesCount} {likesCount === 1 ? "Like" : "Likes"}</span>
          </div>

        </div>
    );
}
