import { EatsLocation } from "./eats-location";

export interface FoodPantrySite extends EatsLocation {
    phone?: string;
    schedule?: string;
    notes?: string;
}
