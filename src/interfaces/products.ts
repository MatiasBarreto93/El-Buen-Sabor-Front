import {IngredientQuantity} from "./ingredient";

export interface Product{
    id:number;
    name: string;
    blocked: boolean;
    categoryId: number;
    categoryDenomination: string;
    itemTypeId: number;
    description: string;
    recipeDescription: string;
    ingredients: IngredientQuantity[];
    image: string;
    sellPrice: number;
    currentStock: number;
}

export interface Drink {
    id: number;
    name: string;
    blocked: boolean;
    categoryId: number;
    categoryDenomination: string;
    itemTypeId: number;
    description: string;
    image: string;
    currentStock: number;
    minStock: number;
    maxStock: number;
    sellPrice: number;
    costPrice: number;
}

export interface Item {
    id: number;
    name: string;
    blocked: boolean;
    categoryId: number;
    categoryDenomination: string;
    itemTypeId: number;
    description: string;
    image: string;
    sellPrice: number;
    currentStock: number;
}