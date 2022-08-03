import { Entity } from "./entity";

export interface RecipeStep extends Entity {
    stepOrder: number;
    title: string;
    instructions: string;
    image: object;
    timeMinutes: number;
}