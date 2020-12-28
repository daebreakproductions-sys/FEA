import { Market } from "./market";
import { Tag } from "./tag";
import { UGC } from "./ugc";

export interface Deal extends UGC {
    market: Market;
    startDate: any;
    endDate: any;
    image64: string;
    title: string;
    price: string;
    text: string;
}
