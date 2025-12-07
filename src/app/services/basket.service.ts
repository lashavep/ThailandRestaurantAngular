import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { IBasket } from '../models/basket.model';

import { AuthService } from './auth.service';
import { HttpClient } from '@angular/common/http';
import { IBasketItem } from '../models/basketItem.model';

@Injectable({
  providedIn: 'root'
})
export class BasketService {
  private apiUrl = "https://localhost:7183/api/baskets";

  public basketSubject = new BehaviorSubject<IBasket | null>(null);
  public basket$ = this.basketSubject.asObservable();

  public totalPriceSubject = new BehaviorSubject<number>(0);
  public totalPrice$ = this.totalPriceSubject.asObservable();

  constructor(private http: HttpClient, private authService: AuthService) {}

  // GET /api/baskets
  loadBasket(): void {
    if (!this.authService.isLoggedIn()) {
      this.basketSubject.next(null);
      this.totalPriceSubject.next(0);
      return;
    }

    const headers = this.authService.getAuthHeaders();
    this.http.get<IBasket>(`${this.apiUrl}`, headers).subscribe({
      next: (basket) => {
        this.basketSubject.next(basket);
        this.calculateTotal(basket);
      },
      error: (err) => console.error('Failed to load basket', err)
    });
  }

  // POST /api/baskets/addToBasket
  addToBasket(item: Partial<IBasketItem>): Observable<IBasket> {
    const headers = this.authService.getAuthHeaders();
    return new Observable<IBasket>((observer) => {
      this.http.post<IBasket>(`${this.apiUrl}/addToBasket`, item, headers).subscribe({
        next: (basket) => {
          this.basketSubject.next(basket);
          this.calculateTotal(basket);
          observer.next(basket);
          observer.complete();
        },
        error: (err) => observer.error(err)
      });
    });
  }

  // PUT /api/baskets/updateBasket/{itemId}
  updateBasket(itemId: number, dto: Partial<IBasketItem>): Observable<void> {
    const headers = this.authService.getAuthHeaders();
    return new Observable<void>((observer) => {
      this.http.put<void>(`${this.apiUrl}/updateBasket/${itemId}`, dto, headers).subscribe({
        next: () => {
          this.loadBasket(); // reload basket after update
          observer.next();
          observer.complete();
        },
        error: (err) => observer.error(err)
      });
    });
  }

  // DELETE /api/baskets/items/{productId}
  deleteProduct(productId: number): Observable<void> {
    const headers = this.authService.getAuthHeaders();
    return new Observable<void>((observer) => {
      this.http.delete<void>(`${this.apiUrl}/items/${productId}`, headers).subscribe({
        next: () => {
          this.loadBasket(); // reload basket after delete
          observer.next();
          observer.complete();
        },
        error: (err) => observer.error(err)
      });
    });
  }

  // DELETE /api/baskets
  clearBasket(): Observable<void> {
    const headers = this.authService.getAuthHeaders();
    return new Observable<void>((observer) => {
      this.http.delete<void>(`${this.apiUrl}/ClearBasket`, headers).subscribe({
        next: () => {
          this.basketSubject.next(null);
          this.totalPriceSubject.next(0);
          observer.next();
          observer.complete();
        },
        error: (err) => observer.error(err)
      });
    });
  }

  // Helpers
  private calculateTotal(basket: IBasket | null): void {
    if (!basket) {
      this.totalPriceSubject.next(0);
      return;
    }
    const total = basket.items.reduce((sum, item) => sum + item.price * item.quantity, 0);
    this.totalPriceSubject.next(total);
  }

  isInBasket(productId: number): boolean {
    const basket = this.basketSubject.getValue();
    if (!basket) return false;
    return basket.items.some(item => item.product.id === productId);
  }
}
