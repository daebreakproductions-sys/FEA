import { Entity } from "./entity";

export interface EatsLocation extends Entity {
    name: string;
    address: string;
    lat: number;
    lng: number;
}