export interface Product{
    id:number;
    name: string;
    blocked: boolean;
    categoryId: number;
    categoryDenomination: string;
    itemTypeId: number;
    description: string;
    recipeDescription: string;
    ingredients: IngredientProduct[];
    image: string;
    sellPrice: number;
}

export interface IngredientProduct {
    idIngredient: number;
    quantity: number;
}