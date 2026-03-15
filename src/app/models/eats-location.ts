import { Entity } from "./entity";

/**
 * Represents the type of food resource location
 * Used for color-coded map icons per documentation:
 * - FarmersMarket: Green icon
 * - FoodRetailer (Grocery): Blue icon
 * - FoodPantry: Purple icon with canned goods symbol
 * - MealSite: Purple icon with fork/spoon symbol
 * - MobileMarket: Purple icon (seasonal)
 */
export type FoodResourceType = 'FarmersMarket' | 'FoodRetailer' | 'FoodPantry' | 'MealSite' | 'MobileMarket' | 'WIC_SNAP_Office';

export interface EatsLocation extends Entity {
    name: string;
    address: string;
    lat: number;
    lng: number;
    
    // Type classification for icon rendering (from food_resources.json)
    provider_type?: FoodResourceType;
    
    // Program flags for badge overlays (from food_resources.json)
    ebt_accepted?: boolean;      // Shows Credit Card badge
    dufb_offered?: boolean;      // Shows Carrot & Coin badge (Double Up Food Bucks)
    wic_accepted?: boolean;      // Shows WIC badge
    
    // Inventory for search filtering (from documentation requirements)
    // Array of items like ["Fresh Produce", "Apples", "Canned Goods"]
    food_categories_list?: string[];
    
    // Operating hours for "Open Now" filter
    hours?: string;
    
    // Contact information
    phone?: string;
    url?: string;
    
    // Additional notes
    notes?: string;
    
    // Classification used by current map component (to be deprecated in favor of provider_type)
    class?: string;
    
    // Rating for display
    reviewsRating?: number;
}
