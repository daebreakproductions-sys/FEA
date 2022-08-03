import { Entity } from "./entity";

export interface RecipeIngredient extends Entity {
    name: string;
    measurement: string;
}