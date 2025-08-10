export interface accommodationDTOType {
    accommodation_id: string
    accommodation_type: 'hotel' | 'motel' | 'resort' | 'villa' | 'cottage' 
    accommodation_name: string 
    location: {
        latitude: number
        longitude: number
    }

}

export type accommodationCreation = {
    accommodation_type: string
    accommodation_name: string 
    latitude: number
    longitude: number
    
}

export type accommodationUpdation = {
    accommodation_id?: string
    accommodation_type?: string
    accommodation_name?: string 
    latitude?: number
    longitude?: number
}