import { Entity } from "./entity";

export interface Market extends Entity {
    name: string;
    email: string;
    address: string;
    hours: string;
    phone: string;
    url: string;
    lat: number;
    lon: number;
    image: object;
    dealsCount: bigint;
    image64: string;
}
