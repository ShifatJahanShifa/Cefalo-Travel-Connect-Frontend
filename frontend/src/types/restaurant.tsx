export interface restaurantDTOType {
    restaurant_id: string
    restaurant_name: string 
    location: {
        latitude: number
        longitude: number
    }
}

export type restaurantCreation = {
    restaurant_name: string 
    latitude: number
    longitude: number
}

export type restaurantUpdation = { 
    restaurant_id?: string
    restaurant_name?: string 
    latitude?: number
    longitude?: number
}