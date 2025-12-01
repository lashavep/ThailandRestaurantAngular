import { IProduct } from "./product.model";

export interface IBasket {
    quantity: number,
    price: number,
    product: IProduct
};