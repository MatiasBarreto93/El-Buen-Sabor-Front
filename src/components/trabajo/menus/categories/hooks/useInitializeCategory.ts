import {Category} from "../../../../../interfaces/category";
import {useState} from "react";

const defaultCategory = {
    id: 0,
    denomination: "",
    blocked: false,
    fatherCategoryId: 0,
    fatherCategoryDenomination: "",
    itemTypeId: 0
}

export const useInitializeCategory = (cat: Category | undefined): [Category, React.Dispatch<React.SetStateAction<Category>>, () => Category] => {
    const [category, setCategory] = useState<Category>(cat ?? defaultCategory);
    const createNewCategory = () => {
        const newCategory = { ...defaultCategory };
        newCategory.itemTypeId = 1; // Establecer el valor predeterminado de itemTypeId en 1
        return newCategory;
    };
    return [category, setCategory, createNewCategory];
}