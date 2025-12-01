export interface IProduct {
    id: number;
    categoryId: number;
    categoryName: string;
    image: string;
    name: string;
    nuts: boolean;
    price: number;
    spiciness: number;
    vegeterian: boolean;
    ingredients:string[];
}
