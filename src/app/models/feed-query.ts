export interface FeedQuery {
    q?: string;
    tags: string;
    markets: string;
    kind: string;
    page: number;
    length: number;
}
export interface FeedQueryPg {
    select: string;
    or: string; // (deal.not.is.null,tip.not.is.null,recipe.not.is.null,review.not.is.null)
    "deal.market_id"?: string;
    "entity.entity_tag.tag.id"?: string;
    limit: number;
    offset: number;
    order?: string;
}