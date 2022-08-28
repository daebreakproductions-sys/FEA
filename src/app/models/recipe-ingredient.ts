import { Entity } from "./entity";

export interface RecipeIngredient extends Entity {
    name: string;
    measurement: string;
}

export interface EditableRecipeIngredient extends RecipeIngredient {
    deleted: boolean;
    editing: boolean;
    edited: boolean;
}