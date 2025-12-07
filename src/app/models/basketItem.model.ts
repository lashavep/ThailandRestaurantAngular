import { IProduct } from "./product.model";

export interface IBasketItem {
  id: number;
  productId: number;
  product: IProduct;
  quantity: number;
  price: number;
  basketId?: number;
}