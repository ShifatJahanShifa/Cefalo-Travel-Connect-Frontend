export type travelPlanInput = {
    travel_plan_id?: string; 
    planner_id?: string
    start_date: string 
    end_date: string 
    note: string 
    estimated_cost: number

    accommodations?: Array<{
        accommodation_type: string
        accommodation_name: string;
        cost_per_night?: number;
        latitude: number;
        longitude: number;
    }>;

    transports?: Array<{
        transport_type: string;
        transport_name: string;
        cost_per_person?: number;
        starting_location_name?: string;
        starting_location_latitude?: number;
        starting_location_longitude?: number;
        ending_location_name?: string
        ending_location_latitude?: number;
        ending_location_longitude?: number;
        // cost: number 
        // rating: number
        // review: string;
    }>;

    places?: Array<{
        place_name: string;
        latitude: number;
        longitude: number;
        // cost: number;
        // rating: number
        // review: string;
    }>;
}


export interface travelPlanOutput  {
    travel_plan_id: string;         
    planner_id: string;             
    start_date: string       
    end_date: string         
    note: string            
    estimated_cost: number   
    created_at: string;             
    updated_at: string;

    accommodations?: any[];
    transports?: any[];
    places?: any[];
}

export interface travelPlanMemberAdd  {
    travel_plan_id: string 
    user_id: string
    role?: string
}

export interface travelPlanMember  {
    user_id: string 
    username: string
    email: string 
    travel_plan_member_role: string 
}


export interface travelPlanComment {
    message_id?: string 
    travel_plan_id: string 
    sender_id: string 
    message: string 
}