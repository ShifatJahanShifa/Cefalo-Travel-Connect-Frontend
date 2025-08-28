import type { getPlace, placeDTOType } from "../types/place";
import { MapPin, Heart, Map } from "lucide-react";
import { useNavigate } from "react-router-dom";
import type { getWishlistType } from "../types/wishlist";
import { useState } from 'react';
import MapModal from "./mapModal";




interface PlaceCardProps {
  place: placeDTOType;
  isWishlisted: boolean;
  wishlist: getWishlistType[];
  onMapClick: (lat: number, lng: number, name: string) => void;
};




export default function PlaceCard({ place, isWishlisted, wishlist, onMapClick }: PlaceCardProps) {
    const navigate = useNavigate();

    const [showMap, setShowMap] = useState(false);


    const handleWishlistClick = () => {
        navigate("/wishlists/create", {
        state: {
            place_name: place.place_name,
            lat: place.location.latitude,
            lng: place.location.longitude,
        },
        });
    };

    const handleViewWishlist = () => {
        const wishlistDetails = wishlist.find(wishlist => wishlist.reference_id === place.place_id)
        navigate(`/wishlists/${wishlistDetails?.wishlist_id}/view`)
    }

    return (
        <div className="relative w-full h-52 bg-sky-100 rounded-xl shadow hover:shadow-md border border-sky-400 flex flex-col">
            {/* Wishlist Heart Icon */}
            <button
                onClick={handleWishlistClick}
                className="absolute top-3 right-3 z-10 text-gray-400 hover:text-red-500 transition"
                title={isWishlisted ? "Added to Wishlist": " Add to wishlist"}
            >
                {/* <Heart className="w-5 h-5" /> */}
                <Heart
                className="w-5 h-5"
                fill={isWishlisted ? "red" : "none"}            
                stroke={isWishlisted ? "red" : "currentColor"}  
                />
            </button>

            {/* Content Wrapper with Padding to Avoid Overlap */}
            <div className="flex-1 px-4 pt-4 pb-3 overflow-hidden flex flex-col justify-between">
                <div className=" max-h-24 pr-1">
                <h3 className="text-lg font-semibold text-blue-700 break-words">
                    {place.place_name}
                </h3>
                </div>

                <div className="text-sm text-gray-600 mt-2 flex items-center gap-5">
                {/* <MapPin className="w-4 h-4 text-red-500" /> */}
                {/* <span>{`Lat: ${place.location.latitude.toFixed(4)} | Lng: ${place.location.longitude.toFixed(4)}`}</span> */}
                <button
                    onClick={() =>
                        onMapClick(
                        place.location.latitude,
                        place.location.longitude,
                        place.place_name
                        )
                    }
                    className="ml-2 text-blue-600 hover:text-blue-800"
                    title="View on map"
                >
                    <Map className="w-5 h-5" />
                </button>

                {isWishlisted && (
                    <button
                        onClick={handleViewWishlist} 
                        className=" text-md text-blue-600  hover:text-blue-800 "
                    >
                        View Wishlist
                    </button>
                )}
                </div>
            </div>


            {showMap && (
                <MapModal
                    lat={place.location.latitude}
                    lng={place.location.longitude}
                    name={place.place_name}
                    onClose={() => setShowMap(false)}
                />
            )}


        </div>

    );

}


