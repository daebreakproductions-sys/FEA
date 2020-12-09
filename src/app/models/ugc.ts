import { Entity } from "./entity";
import { User } from "./user";

export interface UGC extends Entity {
    usr?: User;
    reactionCount?: number;
    iLike?: boolean;
    class?: string;
}
