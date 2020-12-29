export interface FeedQuery {
    q?: string;
    tags: string;
    markets: string;
    kind: string;
    page: number;
    length: number;
}
