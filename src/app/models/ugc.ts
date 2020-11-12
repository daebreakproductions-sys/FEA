import { Entity } from "./entity";
import { User } from "./user";

export class UGC extends Entity {
    usr: User;
    reactionCount: bigint;
    iLike: boolean;
}
