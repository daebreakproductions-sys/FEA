import { Entity } from "./entity";
import { Review } from "./review";
import { ReviewPropertyType } from "./review-property-type.enum";

export interface ReviewProperty extends Entity {
    review: Review;
    propertyType: ReviewPropertyType;
    value: bigint;
}
