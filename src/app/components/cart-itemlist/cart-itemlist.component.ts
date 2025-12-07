import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IBasket } from '../../models/basket.model';
import { BasketService } from '../../services/basket.service';
import { CartItemComponent } from '../cart-item/cart-item.component';
import { TranslateModule } from '@ngx-translate/core';
import { IBasketItem } from '../../models/basketItem.model';

@Component({
  selector: 'app-cart-item-list',
  standalone: true,
  imports: [CartItemComponent, CommonModule, TranslateModule],
  templateUrl: './cart-itemlist.component.html',
  styleUrls: ['./cart-itemlist.component.css']
})
export class CartItemListComponent {
  basket: IBasket | null = null;        // ერთი Basket ობიექტი
  page = 1;
  pageSize = 5;

  constructor(public basketService: BasketService) {}

  ngOnInit(): void {
    this.loadBasket();
  }

  loadBasket(): void {
    this.basketService.basket$.subscribe(basket => {
      this.basket = basket;
    });
  }

  deleteItem(item: IBasketItem) {
    this.basketService.deleteProduct(item.productId).subscribe();
  }

  get pagedItems(): IBasketItem[] {
    if (!this.basket) return [];
    const start = (this.page - 1) * this.pageSize;
    return this.basket.items.slice(start, start + this.pageSize);
  }

  get totalPages(): number {
    if (!this.basket) return 0;
    return Math.ceil(this.basket.items.length / this.pageSize);
  }

  changePage(newPage: number) {
    if (newPage < 1) return;
    const maxPage = this.totalPages;
    if (newPage > maxPage) return;
    this.page = newPage;
  }
}
