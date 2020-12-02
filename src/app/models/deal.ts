import { Market } from "./market";
import { Tag } from "./tag";
import { UGC } from "./ugc";

export interface Deal extends UGC {
    market: Market;
    startDate: Date;
    endDate: Date;
    image: object;
    title: string;
    price: string;
    text: string;
    tags: Tag[];
}
