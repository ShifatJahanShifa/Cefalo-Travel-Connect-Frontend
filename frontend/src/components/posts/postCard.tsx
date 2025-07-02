import type { getPost } from "../../types/post";

interface Props {
    post: getPost;
}

export default function PostCard({ post }: Props) {
  console.log(post)
    return (
        <div className="border rounded p-4 shadow mb-6 bg-white">
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
                      {a.accommodation_type} - {a.accommodation_name} (Cost: ${a.cost}, Rating: {a.rating})
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
                      {p.place_name} (Cost: ${p.cost}, Rating: {p.rating})<br></br>
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
                      {t.transport_type} - {t.transport_name} (Cost: ${t.cost}, Rating: {t.rating})
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
                      {f.food_name} (Cost: ${f.cost}, Rating: {f.rating})
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
        </div>
    );
}
