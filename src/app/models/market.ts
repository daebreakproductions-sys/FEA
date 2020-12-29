import { Entity } from "./entity";

export interface Market extends Entity {
    name: string;
    email: string;
    address: string;
    hours: string;
    phone: string;
    url: string;
    lat: number;
    lng: number;
    image: object;
    dealsCount: number;
    image64: string;
}
