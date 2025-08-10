import type { placeDTOType } from "../types/place";

export function getPlaceById(places: placeDTOType[], place_id: string): placeDTOType | null {

    return places.find((p) => p.place_id === place_id) || null;
}
