export interface Category {
    id: number;
    denomination: string;
    isBanned: boolean;
    categoryFatherId?: number;
}