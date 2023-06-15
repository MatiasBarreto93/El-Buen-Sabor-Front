import {Category} from "../../../../../interfaces/category";
import {useState} from "react";

const defaultCategory = {
    id: 0,
    denomination: "",
    blocked: false,
    fatherCategoryId: 0,
    fatherCategoryDenomination: "",
}

export const useInitializeCategory = (cat: Category | undefined): [Category, React.Dispatch<React.SetStateAction<Category>>, () => Category] => {
    const [category, setCategory] = useState<Category>(cat ?? defaultCategory);
    const createNewCategory = () => defaultCategory;
    return [category, setCategory, createNewCategory];
}