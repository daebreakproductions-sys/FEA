import { EatsLocation } from "./eats-location";

export interface Market extends EatsLocation {
    email: string;
    hours: string;
    phone: string;
    url: string;
    image: object;
    dealsCount: number;
    image64: string;
}
