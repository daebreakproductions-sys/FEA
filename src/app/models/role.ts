import { Entity } from "./entity";

export interface Role extends Entity {
    name: string;
    description: string;
}
