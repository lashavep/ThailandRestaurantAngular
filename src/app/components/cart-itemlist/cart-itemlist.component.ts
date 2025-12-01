import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IBasket } from '../../models/basket.model';
import { BasketService } from '../../services/basket.service';
import { CartItemComponent } from '../cart-item/cart-item.component';
import { TranslateModule } from '@ngx-translate/core';

@Component({
    selector: 'app-cart-item-list',
    standalone: true,
    imports: [CartItemComponent, CommonModule, TranslateModule],
    templateUrl: './cart-itemlist.component.html',
    styleUrl: './cart-itemlist.component.css'
})
export class CartItemListComponent {
    cartItems: IBasket[] = [];
    page = 1;
    pageSize = 5;

    constructor(private basketService: BasketService) { }

    ngOnInit(): void {
        this.getBasket();
    }

    getBasket(): void {
        this.basketService.getBasket().subscribe(basket => this.cartItems = basket);
    }

    deleteItem(item: IBasket) {
        this.basketService.deleteProduct(item).subscribe();
    }

    get pagedItems(): IBasket[] {
        const start = (this.page - 1) * this.pageSize;
        return this.cartItems.slice(start, start + this.pageSize);
    }

    get totalPages(): number {
        return Math.ceil(this.cartItems.length / this.pageSize);
    }

    changePage(newPage: number) {
        if (newPage < 1) return;
        const maxPage = Math.ceil(this.cartItems.length / this.pageSize);
        if (newPage > maxPage) return;
        this.page = newPage;
    }
}
