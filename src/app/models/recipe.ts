import { UGC } from "./ugc";

export interface Recipe extends UGC {
    servings: bigint;
    directions: string;
}
