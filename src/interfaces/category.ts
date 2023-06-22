export interface Category {
    id: number;
    denomination: string;
    blocked: boolean;
    categoryFatherId?: number;
    categoryFatherDenomination?: string;
    itemTypeId: number;
}