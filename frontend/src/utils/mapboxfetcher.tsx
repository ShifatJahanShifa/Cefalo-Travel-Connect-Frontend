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
        console.error("Error fetching coordinates from Mapbox:", err);
        return null;
    }
};


// this is by using nominator.openstreetmap
// async function fetchLocationFromMapbox(placeName: string) {
//   if (!placeName) return null;
//   const url = `https://nominatim.openstreetmap.org/search?q=${encodeURIComponent(
//     placeName
//   )}&format=json&limit=1`;

//   try {
//     const res = await fetch(url);
//     const data = await res.json();
//     if (data && data.length > 0) {
//       return {
//         latitude: parseFloat(data[0].lat),
//         longitude: parseFloat(data[0].lon),
//       };
//     }
//   } catch (error) {
//     console.error("Geocoding failed:", error);
//   }
//   return null;
// }