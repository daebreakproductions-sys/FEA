import { Entity } from "./entity";
import { UGC } from "./ugc";

export interface Comment extends UGC {
    target: Entity;
    text: string;
}
