import { logger } from "./logger";

const MAPBOX_TOKEN = import.meta.env.VITE_MAPBOX;

export const fetchLocationFromMapbox = async (place: string): Promise<{ latitude: number; longitude: number }| null> => {
    try {
        const res = await fetch(
          `https://api.mapbox.com/geocoding/v5/mapbox.places/${encodeURIComponent(place)}.json?access_token=${MAPBOX_TOKEN}`
        );

        if (!res.ok) {
            throw new Error(`Mapbox error: ${res.status}`);
        }

        const data = await res.json();

        if (!data.features || data.features.length === 0) throw new Error("Not found");

        const center = data.features[0]?.center; 
        
        if (!center) return null;

        return {
            latitude: center[1], 
            longitude: center[0],
        };
    }
    catch (err) 
    {
        logger.error("Error fetching coordinates from Mapbox:", err);
        return null;
    }
};
