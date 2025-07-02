import type { getWishlistType, wishlist } from "../types/wishlist";

export default function WishlistCard({ wishlist }: { wishlist: getWishlistType }) {
  return (
    <div className="p-4 border rounded bg-white shadow">
      <p className="text-sm text-gray-600">Created by: {wishlist.title}</p>
      <h3 className="text-xl font-semibold">{wishlist.place_name}</h3>
    </div>
  );
}
