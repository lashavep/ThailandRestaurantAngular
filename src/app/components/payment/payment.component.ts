import { Component } from '@angular/core';
import Swal from 'sweetalert2';
import { BasketService } from '../../services/basket.service';
import { OrderService } from '../../services/order.service';
import { AuthService } from '../../services/auth.service';
import { Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { IBasket } from '../../models/basket.model';
import { IBasketItem } from '../../models/basketItem.model';


@Component({
  selector: 'app-payment',
  standalone: true,
  imports: [FormsModule],
  templateUrl: './payment.component.html',
  styleUrls: ['./payment.component.css']
})
export class PaymentComponent {
  cardName = '';
  cardNumber = '';
  expiryDate = '';
  cvv = '';

  constructor(
    private router: Router,
    private basketService: BasketService,
    private orderService: OrderService,
    private authService: AuthService
  ) {}

  formatExpiryDate() {
    let value = this.expiryDate.replace(/\D/g, '');
    if (value.length >= 2) {
      value = value.substring(0, 2) + '/' + value.substring(2, 4);
    }
    this.expiryDate = value;
  }

  checkout() {
    // ვალიდაციები
    if (!this.cardName || !this.cardNumber || !this.expiryDate || !this.cvv) {
      Swal.fire({ title: 'Missing Information', text: 'Please fill out all required fields.', icon: 'warning' });
      return;
    }

    const cleanedCardNumber = this.cardNumber.replace(/\s+/g, '');
    if (cleanedCardNumber.length !== 16 || !/^\d+$/.test(cleanedCardNumber)) {
      Swal.fire({ title: 'Invalid Card Number', text: 'Card number must be 16 digits.', icon: 'error' });
      return;
    }

    if (!/^\d{2}\/\d{2}$/.test(this.expiryDate)) {
      Swal.fire({ title: 'Invalid Expiry Date', text: 'Use MM/YY format.', icon: 'error' });
      return;
    }

    const [expMonthStr, expYearStr] = this.expiryDate.split('/');
    const expMonth = parseInt(expMonthStr, 10);
    const expYear = 2000 + parseInt(expYearStr, 10);

    const now = new Date();
    const currentMonth = now.getMonth() + 1;
    const currentYear = now.getFullYear();

    if (expYear < currentYear || (expYear === currentYear && expMonth < currentMonth)) {
      Swal.fire({ title: 'Card Expired', text: 'Your card has expired.', icon: 'error' });
      return;
    }

    if (this.cvv.length < 3 || this.cvv.length > 4 || !/^\d+$/.test(this.cvv)) {
      Swal.fire({ title: 'Invalid CVV', text: 'CVV must be 3 or 4 digits.', icon: 'error' });
      return;
    }

    // კალათის ამოღება
    const basket: IBasket | null = this.basketService.basketSubject.value;
    if (!basket || basket.items.length === 0) {
      Swal.fire({ title: 'Empty Cart', text: 'Your basket is empty.', icon: 'warning' });
      return;
    }

    const total = this.basketService.totalPriceSubject.value;

    const order = {
      items: basket.items.map((i: IBasketItem) => ({
        name: i.product.name,
        quantity: i.quantity,
        price: i.price
      })),
      total,
      date: new Date().toISOString()
    };

    this.orderService.createOrder(order).subscribe({
      next: () => {
        this.orderService.loadPendingCount();
        this.basketService.clearBasket().subscribe({
          next: () => {
            Swal.fire({
              title: 'Payment Successful',
              text: 'Your order has been placed.',
              icon: 'success',
              confirmButtonText: 'Great!'
            }).then(() => {
              this.router.navigate(['/orders']);
            });
          },
          error: () => {
            Swal.fire({ title: 'Cart Clear Failed', text: 'Order placed, but cart not cleared.', icon: 'warning' });
          }
        });
      },
      error: () => {
        Swal.fire({ title: 'Order Failed', text: 'Could not place order.', icon: 'error' });
      }
    });
  }
}
