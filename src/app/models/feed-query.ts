export interface FeedQuery {
    q: string;
    tags: number[];
    markets: number[];
    kind: string[];
    page: number;
    length: number;
}
