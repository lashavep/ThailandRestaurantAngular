import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { IBasket } from '../models/basket.model';
import { IPartialProduct } from '../models/partial-product.model';
import { AuthService } from './auth.service';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})

export class BasketService {
  private apiUrl = "https://localhost:7183/api";

  public basketItemsSubject = new BehaviorSubject<IBasket[]>([]);
  public basketItems$ = this.basketItemsSubject.asObservable();

  public totalPriceSubject = new BehaviorSubject<number>(0);
  public totalPrice$ = this.totalPriceSubject.asObservable();

  constructor(private http: HttpClient, private authService: AuthService) { }

  loadBasket() {
    if (!this.authService.isLoggedIn()) {
      this.basketItemsSubject.next([]);
      this.totalPriceSubject.next(0);
      return;
    }

    const url = `${this.apiUrl}/Baskets/GetAll`;
    const headers = this.authService.getAuthHeaders();

    this.http.get<IBasket[]>(url, headers).subscribe({
      next: (items) => {
        this.basketItemsSubject.next(items);
        this.calculateTotal(items);
      },
      error: (err) => {
        console.error('Failed to load basket', err);
      }
    });
  }



  getBasket(): Observable<IBasket[]> {
    return this.basketItems$;
  }


  addToBasket(product: IPartialProduct, newBasketItem: IBasket): Observable<void> {
    const url = `${this.apiUrl}/Baskets/AddToBasket`;
    const headers = this.authService.getAuthHeaders();
    const userId = this.authService.getUserId();
    const payload = { ...product, userId };

    return new Observable<void>((observer) => {
      this.http.post<void>(url, payload, headers).subscribe({
        next: () => {
          const updatedItems = [...this.basketItemsSubject.value, newBasketItem];
          this.basketItemsSubject.next(updatedItems);
          this.calculateTotal(updatedItems);
          observer.next();
          observer.complete();
        },
        error: (err) => {
          console.error('Add to basket failed', err);
          observer.error(err);
        }
      });
    });
  }

  updateProduct(updatedItem: IPartialProduct, updatedBasketItem: IBasket): Observable<void> {
    const url = `${this.apiUrl}/Baskets/UpdateBasket`;
    const headers = this.authService.getAuthHeaders();
    const userId = this.authService.getUserId();

    const payload = { ...updatedItem, userId };

    return new Observable<void>((observer) => {
      this.http.put<void>(url, payload, headers).subscribe({
        next: () => {
          const currItems = this.basketItemsSubject.value;
          const updatedItems = currItems.map(item =>
            item.product.id === updatedBasketItem.product.id ? updatedBasketItem : item
          );
          this.basketItemsSubject.next(updatedItems);
          this.calculateTotal(updatedItems);
          observer.next();
          observer.complete();
        },
        error: (err) => observer.error(err)
      });
    });
  }

  deleteProduct(item: IBasket): Observable<void> {
    const url = `${this.apiUrl}/Baskets/DeleteProduct/${item.product.id}`;
    const headers = this.authService.getAuthHeaders();

    return new Observable<void>((observer) => {
      this.http.delete<void>(url, headers).subscribe({
        next: () => {
          const currItems = this.basketItemsSubject.value;
          const updatedItems = currItems.filter(currItem => item.product.id !== currItem.product.id);
          this.basketItemsSubject.next(updatedItems);
          this.calculateTotal(updatedItems);
          observer.next();
          observer.complete();
        },
        error: (err) => observer.error(err)
      });
    });
  }

  isInBasket(productId: number): boolean {
    if (productId == null) return false;
    const items = this.basketItemsSubject.getValue();
    return items.some(item => item?.product?.id === productId);
  }



  calculateTotal(items: IBasket[]) {
    const total = items.reduce((a, b) => a + b.price * b.quantity, 0);
    this.totalPriceSubject.next(total);
  }


  clearBasket(): Observable<void> {
    const url = `${this.apiUrl}/Baskets/Clear`;
    const headers = this.authService.getAuthHeaders();

    return new Observable<void>((observer) => {
      this.http.delete<void>(url, headers).subscribe({
        next: () => {
          this.basketItemsSubject.next([]);
          this.totalPriceSubject.next(0);
          observer.next();
          observer.complete();
        },
        error: (err) => observer.error(err)
      });
    });
  }


}
