export interface Ingredient{
    id: number;
    name: string;
    blocked: boolean;
    categoryId: number;
    categoryDenomination: string;
    itemTypeId: number;
    itemTypeDenomination: string;
    measurementUnitId: number;
    measurementDenomination: string;
    currentStock: number;
    costPrice: number;
    minStock: number;
    maxStock: number;
}