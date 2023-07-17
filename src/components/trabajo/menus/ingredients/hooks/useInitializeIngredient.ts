import {Ingredient} from "../../../../../interfaces/ingredient";
import React, {useState} from "react";

const defaultIngredient = {
    id: 0,
    name: "",
    blocked: false,
    categoryId: 0,
    categoryDenomination: "",
    itemTypeId: 1,
    measurementUnitId: 0,
    measurementDenomination: "",
    currentStock: 0,
    costPrice: 0,
    minStock: 0,
    maxStock: 0
}

export const useInitializeIngredient = (ing: Ingredient | undefined): [Ingredient, React.Dispatch<React.SetStateAction<Ingredient>>, () => Ingredient] => {
    const [ingredient, setIngredient] = useState<Ingredient>(ing?? defaultIngredient);
    const createNewIngredient = () => defaultIngredient;
    return [ingredient, setIngredient, createNewIngredient];
}