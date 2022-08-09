import { RecipeIngredient } from "./recipe-ingredient";
import { RecipeStep } from "./recipe-step";
import { UGC } from "./ugc";

export interface Recipe extends UGC {
    title: string;
    description: string;
    image64: object;
    servings: bigint;
    published: boolean;
    ingredients: RecipeIngredient[];
    steps: RecipeStep[];
}
