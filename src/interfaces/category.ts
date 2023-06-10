export interface Category {
    id: number;
    denomination: string;
    isBanned: boolean;
    fatherCategory?: Category | null;
    childCategories?: Category[] | null;
}