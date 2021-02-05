import { Market } from "./market";
import { Tag } from "./tag";

export interface FilterModalResult {
    markets?: Market[],
    tags?: Tag[]
}
