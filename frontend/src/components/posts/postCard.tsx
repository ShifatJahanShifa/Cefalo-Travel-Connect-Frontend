import type { getPost } from "../../types/post";
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../hooks/useAuth";
import { deletePost, togglePostlike } from "../../services/postService";
import { getUserInfo } from "../../utils/userInfo";
import type { getUser } from "../../types/user";
import UserInfo from "../userInfo";
import { toast } from "react-toastify";
import { logger } from "../../utils/logger";
import { postFormKeyLabelMap } from "../../constants/keyLabelMap";
import { renderStars } from "../../utils/starRenderer";
import { LIKE_TEXT, LIKES_TEXT, TOGGLE_LIKE_ARIA, HEART_EMPTY, HEART_FILLED } from "../../constants/constantStrings";

interface Props {
  post: getPost;
  onDelete?: (postId: string) => void;
}

const mainFieldsPerCategory: Record<string, string[]> = {
  Accommodations: ["accommodation_type", "accommodation_name"],
  Transports: ["transport_type", "transport_name"],
  Places: ["place_name"],
  Foods: ["food_name"],
};

export default function PostCard({ post, onDelete }: Props) {
  const { user_id } = useAuth();
  const [menuOpen, setMenuOpen] = useState(false);
  const [likesCount, setLikesCount] = useState(post.likes_count);
  const [hasLiked, setHasLiked] = useState(false);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const navigate = useNavigate();
  const [postWriter, setPostWriter] = useState<getUser | undefined>(undefined);


  const handleView = () => navigate(`/posts/${post.post_id}/view`);
  const handleEdit = () => navigate(`/posts/${post.post_id}/edit`);

  useEffect(() => {
    const fetchUserInfo = async () => {
      try {
        const writer: getUser| undefined = await getUserInfo(post.user_id);
        setPostWriter(writer);
      } catch (error) {
        logger.error("Failed to fetch user:", error);
      }
    };

    fetchUserInfo();
  }, [post.user_id]);


  const handleDelete = async () => {
    const deleteConfirmed = confirm("Are you sure you want to delete this post?");
    if (!deleteConfirmed) return;
    try 
    {
      await deletePost(post.post_id);
      toast.success("Deleted successfully.");
      if (onDelete) onDelete(post.post_id);
    } 
    catch (err) 
    {
      logger.error("Delete failed", err);
      toast.error("Something went wrong.");
    }
  };

  const handleLikeToggle = async () => {
    try {
      await togglePostlike(post.post_id);
      setHasLiked(!hasLiked);
      setLikesCount((prev) => (hasLiked ? Math.max(prev - 1, 0) : prev + 1));
    } 
    catch (err) {
      logger.error("Failed to toggle like:", err);
    }
  };

 

  const images = post.images || [];
  const totalImages = images.length;

  const prevImage = () => {
    setCurrentImageIndex((prevIndex) => {
      if (prevIndex === 0) {
        return totalImages - 1;
      }
      return prevIndex - 1;
    });
  };

  const nextImage = () => {
    setCurrentImageIndex((prevIndex) => {
      if (prevIndex === totalImages - 1) {
        return 0;
      }
      return prevIndex + 1;
    });
  };

  const renderInfoCards = (category: string, items: any[]) => {
    const mainFields = mainFieldsPerCategory[category] || [];

    return (
      <div className="flex flex-col gap-4 rounded-lg bg-sky-50">
        {items.map((item: any, i: number) => {
          const filteredEntries = Object.entries(item).filter(([key, val]) => {
            if (val === null || val === "") return false;
            if (mainFields.includes(key)) return true;
            if (["rating", "cost", "cost_per_person", "review"].includes(key)) return true;
            return false;
          });

          return (
            <div
              key={i}
              className="rounded-lg border border-sky-300  p-4 shadow hover:shadow-lg transition cursor-default bg-sky-50"
            >
              {filteredEntries.map(([key, val]) => {
                const label = postFormKeyLabelMap[key] || key.replace(/_/g, " ");
                if (key === "rating" && typeof val === "number") {
                  return (
                    <div key={key} className="mb-1">
                      <strong className="capitalize">{label}:</strong> {renderStars(val)}
                    </div>
                  );
                }
                if (
                  (key === "cost" || key === "cost_per_person") &&
                  typeof val === "number"
                ) {
                  return (
                    <div key={key} className="mb-1">
                      <p><strong className="capitalize">{label}:</strong> ${val.toFixed(2)}<span> BDT</span></p>
                    </div>
                  );
                }
                return (
                  <div key={key} className="mb-1">
                    <strong className="capitalize">{label}:</strong> {String(val)}
                  </div>
                );
              })}
            </div>
          );
        })}
      </div>
    );
  };

  return (
    <div className="border border-blue-400 rounded-xl bg-sky-100 p-6 shadow-lg mb-8  relative transition-transform  duration-300">
      <div className="absolute top-3 right-3">
        <button
          onClick={() => setMenuOpen(!menuOpen)}
          className="text-gray-600 text-xl font-bold focus:outline-none"
        >
          ⋮
        </button>
        {menuOpen && (
          <div className="absolute right-0 mt-2 w-40 bg-white shadow-lg rounded z-20">
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

      <UserInfo username={postWriter?.username as string} imageUrl={postWriter?.profile_picture_url as string} />
      <h2 className="text-3xl font-bold text-indigo-700 mb-2">{post.title}</h2>

      <p className=" text-gray-800 mb-2">
        <b>Duration:</b> {post.duration} | <b>Total Cost:</b> {post.total_cost} BDT | <b>Effort:</b> {post.effort}
      </p>

      <p className=" mb-4">
        <strong className="text-gray-800">Categories:</strong> {post.categories.join(", ")}
      </p>

     
      <p className="mb-5 text-gray-700">{post.description}</p>
    
      {totalImages > 0 && (
        <div className="relative mt-6 max-w-xl mx-auto rounded-lg overflow-hidden shadow-lg">
          <img
            src={images[currentImageIndex].image_url}
            alt={images[currentImageIndex].caption || `Image ${currentImageIndex + 1}`}
            className="w-full h-64 object-cover"
          />
          {images[currentImageIndex].caption && (
            <p className="absolute bottom-0 left-0 right-0 bg-sky-50 bg-opacity-50 text-black text-center p-2 text-sm">
              {images[currentImageIndex].caption}
            </p>
          )}

       
          <button
            onClick={prevImage}
            className="absolute top-1/2 left-2 -translate-y-1/2 bg-white bg-opacity-40 hover:bg-opacity-70 text-slate-400 rounded-full p-2 focus:outline-none"
            aria-label="Previous Image"
          >
            ‹
          </button>
          <button
            onClick={nextImage}
            className="absolute top-1/2 right-2 -translate-y-1/2 bg-white bg-opacity-40 hover:bg-opacity-70 text-slate-400 rounded-full p-2 focus:outline-none"
            aria-label="Next Image"
          >
            ›
          </button>
        </div>
      )}

    
      {[
        { label: "Accommodations", items: post.accommodations },
        { label: "Places", items: post.places },
        { label: "Transports", items: post.transports },
        { label: "Foods", items: post.postFoods },
      ].map(({ label, items }, index) =>
        items && items.length > 0 ? (
          <section key={index} className="mb-8">
            <h3 className="text-xl font-semibold text-blue-600 mb-4">{label}</h3>
            {renderInfoCards(label, items)}
          </section>
        ) : null
      )}


      <hr className="my-6 border-gray-200" />
      <div className="flex items-center gap-2">
        <button
          onClick={handleLikeToggle}
          className={`text-2xl focus:outline-none transition-colors ${
            hasLiked ? "text-red-500" : "text-gray-400 hover:text-red-500"
          }`}
          aria-label={TOGGLE_LIKE_ARIA}
        >
          {hasLiked ? HEART_FILLED : HEART_EMPTY}
        </button>
        <span className="text-sm text-gray-700">
          {likesCount} {likesCount === 1 ? LIKE_TEXT : LIKES_TEXT}
        </span>
      </div>
    </div>
  );
}
