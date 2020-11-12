import { Entity } from "./entity";
import { ReviewProperty } from "./review-property";
import { UGC } from "./ugc";

export class Review extends UGC {
    target: Entity;
    properties: ReviewProperty[];
    text: string;
}
