import { Market } from "./market";
import { UGC } from "./ugc";

export interface Deal extends UGC {
    market: Market;
    startDate: Date;
    endDate: Date;
    image: object;
    title: string;
    price: string;
    text: string;
}
