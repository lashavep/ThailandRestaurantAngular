import { IBasketItem } from "./basketItem.model";


export interface IBasket {
  id: number;
  userId: number;
  items: IBasketItem[];
}