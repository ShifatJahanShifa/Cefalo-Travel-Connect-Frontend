export interface Post {
    post_id: string
    user_id: string;
    title: string;
    description: string;
    total_cost: number;
    duration: string;
    effort: string;
    categories: string[];
    accommodations?: {
        accommodation_type: string;
        accommodation_name: string;
        latitude: number;
        longitude: number;
        cost: number;
        rating: number;
        review: string;
    }[];
    transports?: {
        transport_type: string;
        transport_name: string;
        cost: number;
        rating: number;
        review: string;
    }[];
    places?: {
        place_name: string;
        latitude: number;
        longitude: number;
        cost: number;
        rating: number;
        review: string;
    }[];
    foods?: {
        food_name: string;
        cost: number;
        rating: number;
        review: string;
    }[];
    images?: {
        image_url: string;
        caption: string;
    }[];
    createdAt: string
}


export type getPost = {
    post_id: string;
    user_id: string;
    title: string;
    description: string;
    total_cost: number;
    duration: string;
    effort: string;
    categories: string[];
    likes_count: number;
    comments_count: number;
    created_at?: string;
    updated_at?: string;

    accommodations?: any[];
    transports?: any[];
    places?: any[];
    restaurants?: any[];
    postFoods?: any[];
    images?: { image_url: string; caption?: string }[];
};

