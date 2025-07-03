// src/pages/wishlist/EditWishlistPage.tsx
import { useLocation, useNavigate } from "react-router-dom";
import WishlistForm from "../pages/craeteWishlist";
import type { wishlist, getWishlistType } from "../types/wishlist";

export default function EditWishlistPage() {
  const location = useLocation();
  const navigate = useNavigate();
  const initialData = location.state as wishlist;
  initialData.latitude = location.state.location.latitude 
  initialData.longitude = location.state.location.longitude
  console.log('the init', initialData)

  return (
    <WishlistForm
      initialData={initialData}
      onSubmitSuccess={() => navigate("/wishlists")}
    />
  );
}
