import { IProduct } from "./product.model";

export interface IGetCategory {
    id: number,
    name: string,
    products: IProduct[]
};