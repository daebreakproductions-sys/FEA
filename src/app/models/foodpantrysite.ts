import { Entity } from "./entity";

export interface FoodPantrySite extends Entity {
    name: string;
    address: string;
    phone: string;
    schedule: string;
    notes: string;
    lat: number;
    lng: number;
}
