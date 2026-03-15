import { EatsLocation, FoodResourceType } from "./eats-location";

export interface Market extends EatsLocation {
    email: string;
    hours: string;
    phone: string;
    url: string;
    image: object;
    dealsCount: number;
    image64: string;
    
    // Override provider_type to be more specific for markets
    provider_type?: FoodResourceType;
    
    // Additional market-specific fields from CSV data
    image_path?: string;
}
