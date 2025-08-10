export interface wishlist {
    wishlist_id?: string
    place_name: string,
    type: string,
    title: string
    theme: string
    region: string
    note: string,
    is_public: boolean
    latitude: number
    longitude: number
}


export interface getWishlistType  {
    wishlist_id: string
    user_id: string 
    title: string 
    type: string 
    reference_id: string
    place_name?: string
    place_latitude?: number 
    place_longitude?: number  
    theme: string 
    region: string 
    note: string 
    is_public: boolean 
}


export interface groupedUsers  {
    wishlist_id : string
    title: string
    note: string 
    theme: string
    type: string 
    user_id: string 
    username: string 
    email: string 
    profile_picture_url: string 
}