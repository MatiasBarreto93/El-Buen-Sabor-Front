import {Drink} from "../../../../../interfaces/products";
import React, {useState} from "react";

const defaultProduct = {
    id: 0,
    name: "",
    blocked: false,
    categoryId: 0,
    categoryDenomination: "",
    itemTypeId: 3,
    description: "",
    image: "",
    currentStock: 0,
    minStock: 0,
    maxStock: 0,
    sellPrice: 0,
    costPrice: 0,
}

export const useInitializeDrink = (drink: Drink | undefined): [Drink , React.Dispatch<React.SetStateAction<Drink>>, () => Drink] => {
    const [newDrink, setDrink] = useState<Drink>(drink?? defaultProduct);
    const createNewDrink = () => defaultProduct;
    return [newDrink, setDrink, createNewDrink];
}