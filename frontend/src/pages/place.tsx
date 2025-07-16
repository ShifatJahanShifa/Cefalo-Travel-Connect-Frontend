import { useEffect, useState } from "react";
import PlaceCard from "../components/placeCard";
import type { getPlace, placeDTOType } from "../types/place";
import api from "../api"; // Axios instance
import { getPlaces } from "../services/placeService";
import { getWishlistsByUsername } from "../services/userService";
import { useAuth } from "../hooks/useAuth";
import type { getWishlistType, wishlist } from "../types/wishlist";
import MapOverlay from "../components/mapOverlay";

export default function PlacesPage() {
    const [places, setPlaces] = useState<placeDTOType[]>([]);
    const [loading, setLoading] = useState(true);
    const [wishlist, setWishlist] = useState<getWishlistType[]>([]);
    const [selectedPlace, setSelectedPlace] = useState<{lat: number; lng: number; name: string;} | null>(null);

    const { username } = useAuth() 
    const wishlistedPlaceIds = wishlist.map(item => item.reference_id);
    let isWishlisted = false;


    useEffect(() => {
        const fetchWishlist = async () => {
        try {
            const data = await getWishlistsByUsername(username!); 
            setWishlist(data);
        } 
        catch(error) 
        {
            
        }
        };
        fetchWishlist();
    }, []);

    useEffect(() => {
        const fetchPlaces = async () => {
        try {
            const res = await getPlaces()
            setPlaces(res);
        } 
        catch (err) {
            // console.error("Failed to fetch places", err);
        } 
        finally {
            setLoading(false);
        }
        };

        fetchPlaces();
    }, []);




    return (
        <div className="min-h-screen mt-15 mb-10">
            <div className="max-w-6xl mx-auto">
                <h1 className="text-3xl font-bold text-black mb-6 ">Explore Places</h1>

                {loading ? (
                <div className="text-center text-gray-500">Loading places...</div>
                ) : (
                <div className="grid gap-6 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
                    {places.length > 0 ? (
                    places.map((place) => (
                        // isWishlisted = wishlistedPlaceIds.includes(place.place_id)
                        <div key={place.place_id} className="flex">
                        <PlaceCard place={place} isWishlisted={wishlistedPlaceIds.includes(place.place_id)} wishlist={wishlist}
                        onMapClick={() =>
                        setSelectedPlace({
                        lat: place.location.latitude,
                        lng: place.location.longitude,
                        name: place.place_name,
                        })
                        } />
                        </div>
                    ))
                    ) : (
                    <p className="text-center text-gray-500 col-span-full">No places available.</p>
                    )}

                </div>
                )}
            </div>
            {selectedPlace && (
            <MapOverlay
                lat={selectedPlace.lat}
                lng={selectedPlace.lng}
                name={selectedPlace.name}
                onClose={() => setSelectedPlace(null)}
            />
            )}
        </div>
    );
}
