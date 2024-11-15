export interface PgUGC {
    id: number;
    entity: PgEntity;
    reaction: PgReaction[];
    usr: PgUser;
    tip?: PgTip;
    deal?: PgDeal;
    recipe?: PgRecipe;
    review?: PgReview;
}
export interface PgEntity {
    created: string;
    modified: string;
    entity_tag: {
        tag: {
            id: number;
            name: string;
        }
    }[];
    comment: {
        id: number;
        text: string;
    }[];
}
export interface PgUser {
    id: number;
    firstname?: string;
    lastname?: string;
    username: string;
    image_path?: string;
}
export interface PgReaction {
    user_id: number;
}
export interface PgTip {
    id: number;
    text: string;
    tiptype: string;
    image_path?: string;
}
export interface PgDeal {
    id: number;
    text: string;
    price: string;
    title: string;
    enddate: string;
    startdate: string;
    market: {
        id: number;
        name: string;
    };
    image_path?: string;
}
export interface PgRecipe {
    id: number;
    servings: number;
    title: string;
    description: string;
    published: boolean;
    image_path?: string;
    recipestep: PgRecipeStep[];
}
export interface PgRecipeStep {
    id: number;
    title: string;
    image_path?: string;
    step_order: number;
    instructions: string;
    time_minutes: number;
}
export interface PgReview {
    id: number;
    text: string;
    entity: {
        market: {
            id: number;
            name: string;
        }
    },
    reviewproperty: { value: number }[];
}