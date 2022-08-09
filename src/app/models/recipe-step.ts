import { Entity } from "./entity";

export interface RecipeStep extends Entity {
    stepOrder: number;
    title: string;
    instructions: string;
    image64: object;
    timeMinutes: number;
}