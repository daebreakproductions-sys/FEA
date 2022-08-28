import { Entity } from "./entity";

export interface RecipeStep extends Entity {
    stepOrder: number;
    title: string;
    instructions: string;
    image64: string;
    timeMinutes: number;
}

export interface EditableRecipeStep extends RecipeStep {
    deleted: boolean;
    editing: boolean;
    edited: boolean;
}