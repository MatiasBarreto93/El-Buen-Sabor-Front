import {Product} from "../../../../../interfaces/products";
import React, {useState} from "react";

const defaultProduct = {
    id: 0,
    name: "",
    blocked: false,
    categoryId: 0,
    categoryDenomination: "",
    itemTypeId: 2,
    description: "",
    recipeDescription: "",
    ingredients: [],
    image: "",
    sellPrice: 0
}

export const useInitializeProduct = (prod: Product | undefined): [Product , React.Dispatch<React.SetStateAction<Product>>, () => Product] => {
    const [product, setProduct] = useState<Product>(prod?? defaultProduct);
    const createNewProduct = () => defaultProduct;
    return [product, setProduct, createNewProduct];
}