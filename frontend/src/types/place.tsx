export type placeCreation = {
    place_name: string 
    latitude: number
    longitude: number
}

export type getPlace = {
    place_id: string
    place_name: string 
    latitude: number
    longitude: number
}

export type placeUpdation = { 
    place_id?: string
    place_name?: string 
    latitude?: number
    longitude?: number
}

export interface placeDTOType { 
    place_id: string
    place_name: string 
    location: {
        latitude: number
        longitude: number
    }
}