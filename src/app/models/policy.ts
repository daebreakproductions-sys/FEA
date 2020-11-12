import { Entity } from "./entity";

export interface Policy extends Entity {
    name: string;
    displayName: string;
    text: string;
}
