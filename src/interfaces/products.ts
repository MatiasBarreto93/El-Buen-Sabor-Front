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
}