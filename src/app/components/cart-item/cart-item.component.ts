import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, Output } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { IBasket } from '../../models/basket.model';
import { IPartialProduct } from '../../models/partial-product.model';
import { BasketService } from '../../services/basket.service';


@Component({
    selector: 'app-cart-item',
    standalone: true,
    imports: [CommonModule, FormsModule],
    templateUrl: './cart-item.component.html',
    styleUrl: './cart-item.component.css'
})
export class CartItemComponent {
    @Input() cartItem !: IBasket;
    @Input() quantity !: number;

    @Output() delete = new EventEmitter<IBasket>();

    constructor(private basketService:BasketService) { }

    updateQuantity(newQnty: number) {
        if (newQnty <= 99 && newQnty >= 1) {
            this.quantity = newQnty;
            const updatedProduct: IPartialProduct = {
                quantity: this.quantity,
                price: this.cartItem.price,
                productId: this.cartItem.product.id
            }
            const updatedBasketItem: IBasket = {
                ...this.cartItem,
                quantity: this.quantity
            }
            this.basketService.updateProduct(updatedProduct, updatedBasketItem).subscribe();
        }
    }

    changeQty(event: any) {
        if (this.quantity >= 99) {
            this.quantity = 99;
        }
        if (this.quantity < 1) {
            this.quantity = 1;
        }
        if (this.quantity === null) {
            this.quantity = 1;
        }
        event.target.value = this.quantity;
    }

    deleteProduct(item: IBasket) {
        this.delete.emit(item);
    }
}
