import { EatsLocation, FoodResourceType } from "./eats-location";

export interface FoodPantrySite extends EatsLocation {
    // Override provider_type - typically 'FoodPantry' or 'MealSite'
    provider_type?: FoodResourceType;
    
    // Schedule information (can differ from standard hours)
    schedule?: string;
    
    // Additional eligibility or service notes
    notes?: string;
}
