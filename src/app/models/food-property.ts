import { Food } from "./food";
import { FoodPropertyType } from "./food-property-type.enum";

export interface FoodProperty {
    food: Food;
    propertyType: FoodPropertyType;
    value: number;
}
