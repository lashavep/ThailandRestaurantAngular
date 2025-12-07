import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, Output } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { BasketService } from '../../services/basket.service';
import { IBasketItem } from '../../models/basketItem.model';

@Component({
  selector: 'app-cart-item',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './cart-item.component.html',
  styleUrls: ['./cart-item.component.css']
})
export class CartItemComponent {
  @Input() cartItem!: IBasketItem;   
  @Output() delete = new EventEmitter<IBasketItem>();

  constructor(private basketService: BasketService) {}

  updateQuantity(newQnty: number) {
    if (newQnty <= 99 && newQnty >= 1) {
      this.cartItem.quantity = newQnty;

      const payload = {
        quantity: this.cartItem.quantity,
        price: this.cartItem.price,
        productId: this.cartItem.productId
      };

      this.basketService.updateBasket(this.cartItem.id, payload).subscribe();
    }
  }

  changeQty(event: any) {
    if (this.cartItem.quantity >= 99) {
      this.cartItem.quantity = 99;
    }
    if (this.cartItem.quantity < 1 || this.cartItem.quantity == null) {
      this.cartItem.quantity = 1;
    }
    event.target.value = this.cartItem.quantity;
  }

  deleteProduct(item: IBasketItem) {
    this.delete.emit(item);
  }
}
