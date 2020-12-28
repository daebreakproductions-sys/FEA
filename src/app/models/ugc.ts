import { Entity } from "./entity";
import { Tag } from "./tag";
import { User } from "./user";

export interface UGC extends Entity {
    usr?: User;
    reactionCount?: number;
    iLike?: boolean;
    class?: string;
    tags?: Tag[];
}
